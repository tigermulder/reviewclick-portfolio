import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { RoutePath } from "@/types/route-path"
import { useMutation } from "@tanstack/react-query"
import { checkEmail, sendEmailCode, verifyEmailCode } from "@/services/join"
import { CustomError } from "@/types/api-types/signup-type"
import TextField from "@/components/TextField"
import Button from "@/components/Button"
import ReuseHeader from "@/components/ReuseHeader"
import useToast from "@/hooks/useToast"
import { validateEmail, formatTime } from "@/utils/util"
import styled from "styled-components"

const AccountVerificationPage = () => {
  const navigate = useNavigate()
  const [id, setId] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const [emailConfirmed, setEmailConfirmed] = useState(false)
  const [emailAuthCode, setEmailAuthCode] = useState("")
  const [emailTimer, setEmailTimer] = useState(0)
  const emailTimerRef = useRef<NodeJS.Timeout | null>(null)
  const { addToast } = useToast()
  const [emailCheckMessage, setEmailCheckMessage] = useState<string>("")

  const redirect = sessionStorage.getItem("redirectPath")
  const isLoggedIn = localStorage.getItem("email")

  // ** 이메일 체크 mutation */
  const emailCheckMutation = useMutation({
    mutationFn: checkEmail,
    onSuccess: (data) => {
      if (data.statusCode === 0) {
        setEmailCheckMessage("인증 가능한 아이디입니다.")
        const email = `${id}@naver.com`
        const sendCodeData = { email }
        sendEmailCodeMutation.mutate(sendCodeData)
        setTimeout(() => {
          setEmailCheckMessage("")
        }, 500)
      } else {
        setEmailCheckMessage("")
        addToast("이미 인증한 계정입니다.", "warning", 3000, "verify")
      }
    },
    onError: (error: CustomError) => {
      const errorCode = error.response?.data?.errorCode
      setEmailCheckMessage("")
      switch (errorCode) {
        case 1:
          addToast("매체사로 접속해주세요", "warning", 3000, "verify")
          break
        case 3:
          addToast("이미 인증한 이메일입니다", "warning", 3000, "verify")
          break
        case 4:
          addToast("이미 사용중인 이메일입니다.", "warning", 3000, "verify")
          break
        default:
          addToast("네트워크 에러입니다", "warning", 3000, "verify")
          break
      }
    },
  })
  // ** 이메일 인증 코드 전송 mutation */
  const sendEmailCodeMutation = useMutation({
    mutationFn: sendEmailCode,
    onSuccess: (data) => {
      if (data.statusCode === 0) {
        setEmailSent(true)
        startEmailTimer()
        addToast("인증코드가 이메일로 전송됐어요", "warning", 3000, "verify")
      } else {
        addToast("인증 코드 전송에 실패했습니다.", "warning", 3000, "verify")
      }
    },
    onError: (error: CustomError) => {
      const errorCode = error.response?.data?.errorCode
      switch (errorCode) {
        case 2:
          addToast("이메일체크를 먼저 해주세요", "warning", 3000, "verify")
          break
        default:
          addToast("인증 코드 전송에 실패했습니다.", "warning", 3000, "verify")
          break
      }
    },
  })
  // ** 이메일 인증 코드 확인 mutation */
  const verifyEmailCodeMutation = useMutation({
    mutationFn: verifyEmailCode,
    onSuccess: (data) => {
      if (data.statusCode === 0) {
        localStorage.setItem("email", id)
        setEmailConfirmed(true)
        resetEmailTimer()
        addToast("이메일 인증이 완료되었습니다.", "check", 3000, "verify")
        navigate(RoutePath.JoinPhoneVerify)
      } else {
        addToast("인증 코드가 올바르지 않습니다.", "warning", 3000, "verify")
      }
    },
    onError: (error: CustomError) => {
      const errorCode = error.response?.data?.errorCode
      switch (errorCode) {
        case 2:
          addToast("인증 코드가 일치하지 않습니다.", "warning", 3000, "verify")
          break
        default:
          addToast("인증 코드가 올바르지 않습니다.", "warning", 3000, "verify")
          break
      }
    },
  })

  // ** 이메일 인증 타이머 시작 */
  const startEmailTimer = () => {
    setEmailTimer(300) // 5분
    if (emailTimerRef.current) clearInterval(emailTimerRef.current)
    emailTimerRef.current = setInterval(() => {
      setEmailTimer((prev) => {
        if (prev <= 1) {
          if (emailTimerRef.current) clearInterval(emailTimerRef.current)
          setEmailSent(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }
  // ** 이메일 인증 타이머 초기화 */
  const resetEmailTimer = () => {
    if (emailTimerRef.current) clearInterval(emailTimerRef.current)
    setEmailTimer(0)
    setEmailSent(false)
  }

  // ** 이메일 인증 코드 유효성 검사 */
  useEffect(() => {
    if (emailAuthCode.length === 6 && emailSent && !emailConfirmed) {
      const requestData = { code: emailAuthCode }
      verifyEmailCodeMutation.mutate(requestData)
    }
  }, [emailAuthCode])

  // ** 이메일 체크 및 인증 코드 전송 함수 */
  const handleEmailAuth = () => {
    if (!validateEmail(id)) {
      addToast(
        "올바른 네이버 아이디 형식이 아닙니다.",
        "warning",
        3000,
        "verify"
      )
      return
    }
    const email = `${id}@naver.com`
    const emailCheckData = { email }
    emailCheckMutation.mutate(emailCheckData)
  }

  // ** 재발송 버튼 클릭 시 함수 */
  const handleResendEmailCode = () => {
    const email = `${id}@naver.com`
    const sendCodeData = { email }
    sendEmailCodeMutation.mutate(sendCodeData, {
      onSuccess: (data) => {
        if (data.statusCode === 0) {
          setEmailSent(true)
          startEmailTimer()
          setEmailAuthCode("")
          addToast("인증 코드를 재전송했습니다.", "warning", 3000, "verify")
        } else {
          addToast("인증 코드 전송에 실패했습니다.", "warning", 3000, "verify")
        }
      },
      onError: (error: CustomError) => {
        const errorCode = error.response?.data?.errorCode
        switch (errorCode) {
          case 2:
            addToast("이메일체크를 먼저 해주세요", "warning", 3000, "verify")
            break
          default:
            addToast(
              "인증 코드 전송에 실패했습니다.",
              "warning",
              3000,
              "verify"
            )
            break
        }
      },
    })
  }

  // ** 컴포넌트 언마운트 시 타이머 정리 */
  useEffect(() => {
    if (isLoggedIn) {
      if (isLoggedIn !== "null") {
        addToast("이미 인증되었습니다", "warning", 3000, "verify")
        if (redirect) {
          navigate(redirect)
        }
      }
    }
    return () => {
      if (emailTimerRef.current) clearInterval(emailTimerRef.current)
    }
  }, [])

  return (
    <VerificationContainer>
      <ReuseHeader
        title="계정인증"
        onBack={() => {
          navigate(-1)
        }}
      />
      <FormGroup>
        <AccountVerifyTitle>
          리뷰클릭 이용을 위해 <br />
          <em>계정인증</em>을 해주세요
        </AccountVerifyTitle>
        <AccountVerifyText>
          리뷰클릭 서비스는 네이버 아이디로만 인증 가능하며, 인증된 네이버
          계정과 캠페인 참여 계정이 동일해야 합니다.
        </AccountVerifyText>
        <Row>
          <TextFieldWrapper>
            <TextField
              type="text"
              name="email_id"
              placeholder="네이버ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
              suffix="@naver.com"
              $isError={id !== "" && !validateEmail(id)}
              $marginBottom="0"
              errorMessage={
                id !== "" && !validateEmail(id)
                  ? "올바른 형식의 계정이 아닙니다."
                  : undefined
              }
              $suffixWidth="27%"
              successMessage={emailCheckMessage}
              disabled={emailSent || emailConfirmed}
            />
          </TextFieldWrapper>
        </Row>
        {emailSent && (
          <Row>
            <TextFieldWrapper>
              <div style={{ position: "relative" }}>
                <TextField
                  type="text"
                  name="email_auth_code"
                  placeholder="인증 코드 입력"
                  value={emailAuthCode}
                  onChange={(e) => setEmailAuthCode(e.target.value)}
                  $isError={emailAuthCode !== "" && emailAuthCode.length !== 6}
                  $marginBottom="0"
                  $marginTop="0.8rem"
                  errorMessage={
                    emailAuthCode !== "" && emailAuthCode.length !== 6
                      ? "인증 코드를 다시 입력해주세요."
                      : undefined
                  }
                />
                <TimerText>{formatTime(emailTimer)}</TimerText>
              </div>
            </TextFieldWrapper>
          </Row>
        )}

        <ButtonWrapper $visible={validateEmail(id)}>
          <Button
            type="button"
            $variant="red"
            onClick={emailSent ? handleResendEmailCode : handleEmailAuth}
            disabled={emailConfirmed}
          >
            {emailSent ? "인증코드 다시받기" : "인증메일 발송"}
          </Button>
        </ButtonWrapper>
      </FormGroup>
    </VerificationContainer>
  )
}

export default AccountVerificationPage

const VerificationContainer = styled.div`
  padding: 4.4rem 0 0;
  height: 100vh;
`

const FormGroup = styled.div`
  margin-top: 0;
`

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
`

const AccountVerifyTitle = styled.h2`
  margin-top: 2.4rem;
  font-size: var(--font-h2-size);
  font-weight: var(--font-h2-weight);
  letter-spacing: var(--font-h2-letter-spacing);
  color: var(--n600-color);
  em {
    color: var(--revu-color);
  }
`

const AccountVerifyText = styled.p`
  margin: 1.2rem 0 2.4rem;
  font-size: var(--font-bodyM-size);
  font-weight: var(--font-bodyM-weight);
  line-height: var(--font-bodyM-line-height);
  letter-spacing: var(--font-bodyM-letter-spacing);
`

const TextFieldWrapper = styled.div`
  flex: 4;
  position: relative;
`

const ButtonWrapper = styled.div<{ $visible: boolean }>`
  position: fixed;
  padding: 1.5rem;
  width: 100%;
  bottom: 0;
  left: 0;
  background-color: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.08);
  transform: ${({ $visible }) =>
    $visible ? "translateY(0)" : "translateY(100%)"};
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition:
    transform 0.3s ease-out,
    opacity 0.2s ease-out;
  z-index: 100;
`

const TimerText = styled.span`
  position: absolute;
  right: 1.4rem;
  top: 1.5rem;
  font-size: 1.2rem;
  font-weight: var(--font-weight-medium);
  color: var(--revu-color);
`
