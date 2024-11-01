import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import ReuseHeader from "@/components/ReuseHeader"
import TextField from "@/components/TextField"
import Button from "@/components/Button"
import useToast from "@/hooks/useToast"
import { RoutePath } from "@/types/route-path"
import { resetPasswordEmail } from "@/services/join"
import styled from "styled-components"
import { checkEmail } from "@/utils/util"

const FindPasswordPage = () => {
  const [emailId, setEmailId] = useState("")
  const [emailError, setEmailError] = useState<string>("")
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false) // 성공 상태 추가

  // 유효성 검사 및 에러 메시지 설정
  useEffect(() => {
    const emailValidationResult = checkEmail(emailId)
    const isEmailValid = emailValidationResult !== false
    setIsButtonEnabled(isEmailValid)

    // 이메일 에러 메시지 설정
    if (emailId !== "" && !isEmailValid) {
      setEmailError("아이디가 잘못되었습니다. 아이디를 정확히 입력해주세요.")
    } else {
      setEmailError("")
    }
  }, [emailId])

  const handleResetPassword = async () => {
    const email = checkEmail(emailId)
    if (email) {
      try {
        const response = await resetPasswordEmail({ email })
        const { statusCode } = response

        if (statusCode === 0) {
          setSuccess(true)
        }
      } catch (err) {
        setEmailError("입력한 정보로 가입된 계정이 없습니다.")
      }
    }
  }

  //** 성공 시 결과 화면 렌더링 */
  if (success) {
    return (
      <ResultContainer>
        <ReuseHeader
          title="비밀번호 재설정"
          onBack={() => navigate(RoutePath.Login)}
        />
        <ResultInfo>
          <ResultInfoTitle>비밀번호 재설정 메일 발송 완료</ResultInfoTitle>
          <p>
            비밀번호 재설정 링크가 포함된 메일이 발송되었습니다. <br />
            변경한 비밀번호로 로그인 후 서비스 이용 부탁드립니다.
          </p>
        </ResultInfo>
        <Button
          type="button"
          $variant="red"
          onClick={() => navigate(RoutePath.Login)}
        >
          로그인
        </Button>
      </ResultContainer>
    )
  }

  return (
    <Container>
      <ReuseHeader
        title="비밀번호 재설정"
        onBack={() => navigate(RoutePath.Login)}
      />
      <TitleContainer>
        <Title>
          가입 시 입력한
          <br />
          네이버 ID를 입력해 주시면
          <br />
          비밀번호 재설정 안내 메일을 보내드립니다.
        </Title>
      </TitleContainer>

      <TextField
        type="text"
        name="email_id"
        placeholder="네이버ID"
        value={emailId}
        onChange={(e) => setEmailId(e.target.value)}
        suffix="@naver.com"
        errorMessage={emailError}
        $isError={emailError !== ""}
        $suffixWidth="26.5%"
      />
      <Button
        type="button"
        disabled={!isButtonEnabled}
        $variant="red"
        onClick={handleResetPassword}
      >
        비밀번호 재설정 링크 발송
      </Button>
    </Container>
  )
}

export default FindPasswordPage

const Container = styled.div`
  padding: 4.4rem 0;
  display: flex;
  flex-direction: column;
`

const TitleContainer = styled.div`
  padding: 2.8rem 0 4.2rem;
`

const Title = styled.h4`
  color: var(--primary-color);
  font-size: var(--font-h3-size);
  font-weight: var(--font-weight-bold);
  line-height: 2.5rem;
`

const ResultContainer = styled.div`
  min-height: 100vh;
  padding: 4.4rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const ResultInfo = styled.div`
  padding: 4rem 0;
  text-align: center;

  p {
    font-size: 1.4rem;
    font-weight: var(--font-weight-light);
    line-height: 1.4;
    color: var(--n400-color);
  }
`

const ResultInfoTitle = styled.h3`
  margin-bottom: 1.6rem;
  color: var(--primary-color);
  font-size: var(--font-h3-size);
  font-weight: var(--font-weight-medium);
`
