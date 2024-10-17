import { useState, useEffect } from "react"
import { checkEmail, checkPassword } from "utils/util"
import { login } from "services/login"
import { Link, useNavigate } from "react-router-dom"
import { RoutePath } from "@/types/route-path"
import { useMutation } from "@tanstack/react-query"
import { useSetRecoilState } from "recoil"
import { toastListState } from "@/store/toast-recoil"
import RevuLogoIcon from "assets/revu_icon.svg?react"
import RevuTextIcon from "assets/revu_logo.svg?react"
import TextField from "@/components/TextField"
import Button from "@/components/Button"
import styled from "styled-components"

const LoginPage = () => {
  const navigate = useNavigate()
  const [emailId, setEmailId] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false)
  const [emailError, setEmailError] = useState<string>("") // 수정된 부분
  const [passwordError, setPasswordError] = useState<string>("") // 수정된 부분
  const setToasts = useSetRecoilState(toastListState)

  // 로그인된 사용자가 /login 페이지로 접근하면 메인 페이지로 리다이렉트
  useEffect(() => {
    const token = sessionStorage.getItem("authToken")
    if (token) {
      navigate(RoutePath.Home)
      addToast("로그인된 상태입니다.", "info")
    }
  }, [navigate])

  // 토스트 메시지를 추가하는 함수
  const addToast = (
    message: string,
    type: "info" | "warning" | "check" | "uncheck",
    duration = 3000
  ) => {
    setToasts((prevToasts) => [
      ...prevToasts,
      { id: Date.now().toString(), message, type, duration },
    ])
  }

  // 유효성 검사 및 에러 메시지 설정
  useEffect(() => {
    const emailValidationResult = checkEmail(emailId)
    const passwordValidationResult = checkPassword(password)
    const isEmailValid = emailValidationResult !== false
    const isPasswordValid = passwordValidationResult !== false
    setIsButtonEnabled(isEmailValid && isPasswordValid)

    // 이메일 에러 메시지 설정
    if (emailId !== "" && !isEmailValid) {
      setEmailError("아이디가 잘못되었습니다. 아이디를 정확히 입력해주세요.")
    } else {
      setEmailError("")
    }

    // 비밀번호 에러 메시지 설정
    if (password !== "" && !isPasswordValid) {
      setPasswordError(
        "비밀번호가 잘못되었습니다. 비밀번호를 정확히 입력해주세요."
      )
    } else {
      setPasswordError("")
    }
  }, [emailId, password])

  // React Query mutation for login
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      const token = data.token
      if (token) {
        sessionStorage.setItem("authToken", token)
        addToast("로그인이 완료되었습니다.", "check", 1000)
        navigate(RoutePath.Home)
      } else {
        console.error("Token not found in response:", data)
        addToast("로그인에 실패했습니다. 다시 시도해주세요.", "warning", 1000)
      }
    },
    onError: (error: any) => {
      console.error("로그인 실패:", error)
      if (error?.response?.data?.statusCode === -1) {
        switch (error.response.data.errorCode) {
          case 1:
          case 2:
            addToast("아이디 또는 비밀번호가 잘못되었습니다.", "warning", 1000)
            break
          case 3:
          case 4:
            addToast("인증 정보가 올바르지 않습니다.", "warning", 1000)
            break
          case 5:
            addToast("탈퇴한 회원입니다.", "warning", 1000)
            break
          default:
            addToast("오류가 발생했습니다.", "warning", 1000)
        }
      } else {
        addToast("오류가 발생했습니다.", "warning", 1000)
      }
    },
  })

  // 로그인 함수
  const handleLogin = () => {
    const email = checkEmail(emailId)
    const validPassword = checkPassword(password)
    if (!email || !validPassword) {
      addToast("이메일과 비밀번호를 확인해 주세요.", "warning", 1000)
      return
    }
    const loginData = {
      email,
      password: validPassword,
    }
    mutation.mutate(loginData)
  }

  if (mutation.isError) {
    console.error("Throwing mutation error to ErrorBoundary:", mutation.error)
    throw mutation.error
  }

  return (
    <Container>
      <Title>
        <RevuClickLogo aria-label="RevuClick Logo" />
        <RevuClickText aria-label="RevuClick Text" />
        <MainText>
          리뷰로
          <br />
          <span>
            결제 금액을
            <br />
            돌려 받는
            <br />
          </span>
          특별한 혜택!
        </MainText>
      </Title>
      <FormWrap>
        <Form
          onSubmit={(e) => {
            e.preventDefault()
            handleLogin()
          }}
        >
          <TextField
            type="text"
            name="email_id"
            placeholder="네이버ID"
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
            suffix="@naver.com"
            $isError={emailError !== ""}
            errorMessage={emailError}
          />
          <TextField
            type="password"
            name="password"
            placeholder="영문 대/소문자, 숫자, 특수문자 조합하여 8~16자"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            $isError={passwordError !== ""}
            errorMessage={passwordError}
          />
          <Button type="submit" disabled={!isButtonEnabled} $variant="red">
            로그인
          </Button>
          <LinkContainer>
            <StyledLink to={RoutePath.FindId}>아이디 찾기</StyledLink>
            <Divider />
            <StyledLink to={RoutePath.FindPassword}>비밀번호 재설정</StyledLink>
          </LinkContainer>
          <Button type="button" $variant="outlined">
            <Link
              to={RoutePath.Join}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              계정인증 (가입)
            </Link>
          </Button>
        </Form>
      </FormWrap>
    </Container>
  )
}

export default LoginPage

const Container = styled.div`
  padding: 6.8rem 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Title = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const RevuClickLogo = styled(RevuLogoIcon)`
  width: 3.5rem;
  color: var(--revu-color);
`

const RevuClickText = styled(RevuTextIcon)`
  width: 8.4rem;
  margin-top: 0.9rem;
  color: var(--revu-color);
`

const MainText = styled.h2`
  margin-top: 3.2rem;
  font-size: var(--font-h1-size);
  font-weight: var(--font-weight-medium);
  line-height: var(--font-h1-line-height);
  letter-spacing: var(--font-h1-letter-spacing);
  span {
    font-weight: var(--font-weight-extrabold);
  }
`

const FormWrap = styled.div`
  margin-top: 6rem;
  width: 100%;
  max-width: 400px;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: stretch;
`

const LinkContainer = styled.div`
  margin: 2.5rem 0 4rem 0;
  font-size: 1.2rem;
  font-weight: var(--font-weight-medium);
  color: var(--n300-color);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;
`

const StyledLink = styled(Link)`
  cursor: pointer;
  color: var(--n300-color);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

const Divider = styled.span`
  width: 1px;
  height: 1rem;
  background: var(--n300-color);
`
