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
        setEmailCheckMessage("가입이 가능한 네이버 아이디입니다.")
        const email = `${id}@naver.com`
        const sendCodeData = { email }
        sendEmailCodeMutation.mutate(sendCodeData)
        setTimeout(() => {
          setEmailCheckMessage("")
        }, 500)
      } else {
        setEmailCheckMessage("")
        addToast("이미 인증한 계정입니다.", "warning", 1000, "email")
      }
    },
    onError: (error: CustomError) => {
      const errorCode = error.response?.data?.errorCode
      setEmailCheckMessage("")
      if (errorCode === 1) {
        addToast("매체사로 접속해주세요", "warning", 1000, "email")
      } else {
        addToast("네트워크 에러입니다", "warning", 1000, "email")
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
        addToast("인증 코드를 이메일로 전송했습니다.", "warning", 1000, "email")
      } else {
        addToast("인증 코드 전송에 실패했습니다.", "warning", 1000, "email")
      }
    },
    onError: () => {
      addToast(
        "인증 코드 요청 중 오류가 발생했습니다.",
        "warning",
        1000,
        "email"
      )
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
        addToast("계정인증이 완료되었습니다.", "check", 1200, "email")

        const redirect = sessionStorage.getItem("redirectPath")
        if (redirect) {
          navigate(redirect)
        } else {
          navigate(RoutePath.MyCampaign)
        }
      } else {
        addToast("인증 코드가 올바르지 않습니다.", "warning", 1000, "email")
      }
    },
    onError: () => {
      addToast(
        "인증 코드 확인 중 오류가 발생했습니다.",
        "warning",
        1000,
        "email"
      )
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
        1000,
        "email"
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
    sendEmailCodeMutation.mutate(sendCodeData)
    startEmailTimer()
    addToast("인증 코드를 재전송했습니다.", "warning", 1000, "email")
  }

  // ** 컴포넌트 언마운트 시 타이머 정리 */
  useEffect(() => {
    if (isLoggedIn) {
      if (isLoggedIn !== "null") {
        addToast("이미 인증되었습니다", "warning", 1000, "Join")
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
          리뷰클릭 캠페인은 네이버 계정으로만 참여 가능해요.
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
              $suffixWidth="25.5%"
              successMessage={emailCheckMessage}
              disabled={emailSent || emailConfirmed}
            />
          </TextFieldWrapper>
          <ButtonWrapper>
            <Button
              type="button"
              $variant="join"
              onClick={handleEmailAuth}
              disabled={!validateEmail(id) || emailConfirmed || emailSent}
              $marginTop="0"
            >
              {emailSent ? "전송완료" : "인증메일 받기"}
            </Button>
          </ButtonWrapper>
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
                  $marginTop="3.2rem"
                  errorMessage={
                    emailAuthCode !== "" && emailAuthCode.length !== 6
                      ? "인증 코드를 입력해 주세요."
                      : undefined
                  }
                />
                <TimerText>{formatTime(emailTimer)}</TimerText>
              </div>
            </TextFieldWrapper>
            <ButtonWrapper>
              <Button
                type="button"
                $variant="red"
                onClick={handleResendEmailCode}
                disabled={!validateEmail(id) || emailConfirmed}
              >
                재발송
              </Button>
            </ButtonWrapper>
          </Row>
        )}
      </FormGroup>
    </VerificationContainer>
  )
}

export default AccountVerificationPage

const VerificationContainer = styled.div`
  padding: 6rem 0 10rem;
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
  margin-top: 2.8rem;
  font-size: var(--font-h2-size);
  font-weight: var(--font-h2-weight);
  letter-spacing: var(--font-h2-letter-spacing);
  color: var(--n600-color);
  em {
    color: var(--revu-color);
  }
`

const AccountVerifyText = styled.p`
  margin: 1.4rem 0 3.4rem;
  font-size: var(--font-bodyM-size);
  font-weight: var(--font-bodyM-weight);
  line-height: var(--font-bodyM-line-height);
  letter-spacing: var(--font-bodyM-letter-spacing);
`

const TextFieldWrapper = styled.div`
  flex: 4;
  position: relative;
`

const ButtonWrapper = styled.div`
  width: 100%;
`

const TimerText = styled.span`
  position: absolute;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  font-weight: var(--font-weight-medium);
  color: var(--revu-color);
`
