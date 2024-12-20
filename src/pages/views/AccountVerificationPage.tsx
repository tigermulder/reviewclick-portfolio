import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { RoutePath } from "@/types/route-path"
import { useMutation } from "@tanstack/react-query"
import { checkEmail, sendEmailCode, verifyEmailCode } from "@/services/join"
import { CustomError } from "@/types/api-types/signup-type"
import TextField from "@/components/TextField"
import Button from "@/components/Button"
import SeoHelmet from "@/components/SeoHelmet"
import ReuseHeader from "@/components/ReuseHeader"
import useToast from "@/hooks/useToast"
import { validateEmail, formatTime } from "@/utils/util"
import useScrollToTop from "@/hooks/useScrollToTop"
import styled from "styled-components"
import useDebounce from "@/hooks/useDebounce"

const AccountVerificationPage = () => {
  // ** 스크롤 0부터시작 */
  useScrollToTop()
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
        console.log("Email check successful:", id)
        setEmailCheckMessage("인증 가능한 아이디입니다.")
        const email = `${id}@naver.com`
        const sendCodeData = { email }
        sendEmailCodeMutation.mutate(sendCodeData)
        setTimeout(() => {
          setEmailCheckMessage("")
        }, 500)
      } else {
        setEmailCheckMessage("")
        addToast("이미 인증한 계정입니다.", 3000, "verify")
      }
    },
    onError: (error: CustomError) => {
      const errorCode = error.response?.data?.errorCode
      setEmailCheckMessage("")
      switch (errorCode) {
        case 1:
          addToast("매체사로 접속해주세요", 3000, "verify")
          break
        case 3:
          addToast("이미 인증한 이메일입니다", 3000, "verify")
          break
        case 4:
          addToast("이미 사용중인 이메일입니다.", 3000, "verify")
          break
        default:
          addToast("네트워크 에러입니다", 3000, "verify")
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
        addToast("인증코드가 이메일로 전송됐어요", 3000, "verify")
      } else {
        addToast("인증 코드 전송에 실패했습니다.", 3000, "verify")
      }
    },
    onError: (error: CustomError) => {
      const errorCode = error.response?.data?.errorCode
      switch (errorCode) {
        case 2:
          addToast("이메일체크를 먼저 해주세요", 3000, "verify")
          break
        default:
          addToast("인증 코드 전송에 실패했습니다.", 3000, "verify")
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
        addToast("이메일 인증이 완료되었습니다", 3000, "verify")
        navigate(RoutePath.JoinPhoneVerify)
      } else {
        addToast("인증 코드가 올바르지 않습니다", 3000, "verify")
      }
    },
    onError: (error: CustomError) => {
      const errorCode = error.response?.data?.errorCode
      switch (errorCode) {
        case 2:
          addToast("인증 코드가 일치하지 않습니다", 3000, "verify")
          break
        default:
          addToast("인증 코드가 올바르지 않습니다", 3000, "verify")
          break
      }
    },
  })

  // ** 이메일 인증 타이머 시작 */
  const startEmailTimer = () => {
    console.log("Email timer started")
    setEmailTimer(300) // 5분
    if (emailTimerRef.current) clearInterval(emailTimerRef.current)
    emailTimerRef.current = setInterval(() => {
      setEmailTimer((prev) => {
        if (prev <= 1) {
          if (emailTimerRef.current) clearInterval(emailTimerRef.current)
          setEmailSent(false)
          console.log("Email timer ended")
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
    console.log("Email timer reset")
  }

  // ** 이메일 인증 코드 유효성 검사 */
  useEffect(() => {
    if (emailAuthCode.length === 6 && emailSent && !emailConfirmed) {
      const requestData = { code: emailAuthCode }
      console.log("Verifying email code:", emailAuthCode)
      verifyEmailCodeMutation.mutate(requestData)
    }
  }, [emailAuthCode, emailSent, emailConfirmed, verifyEmailCodeMutation])

  // ** 이메일 체크 및 인증 코드 전송 함수 */
  const handleEmailAuth = () => {
    if (!validateEmail(id)) {
      addToast("올바른 네이버 아이디 형식이 아닙니다", 3000, "verify")
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
          startEmailTimer()
          setEmailAuthCode("")
          addToast("인증 코드를 재전송했습니다", 3000, "verify")
        } else {
          addToast("인증 코드 전송에 실패했습니다", 3000, "verify")
        }
      },
      onError: (error: CustomError) => {
        const errorCode = error.response?.data?.errorCode
        switch (errorCode) {
          case 2:
            addToast("이메일체크를 먼저 해주세요", 3000, "verify")
            break
          default:
            addToast("인증 코드 전송에 실패했습니다", 3000, "verify")
            break
        }
      },
    })
  }

  // ** 컴포넌트 언마운트 시 타이머 정리 */
  useEffect(() => {
    if (isLoggedIn && isLoggedIn !== "null") {
      addToast("이미 인증되었습니다", 3000, "verify")
      if (redirect) {
        navigate(redirect)
      }
    }
    return () => {
      if (emailTimerRef.current) clearInterval(emailTimerRef.current)
    }
  }, [isLoggedIn, redirect, navigate, addToast])

  // ** 디바운스를 사용한 이메일 유효성 검사 및 체크 */
  const debouncedValidateEmail = useDebounce((currentId: string) => {
    console.log("디바운스된 verifyEmail:", currentId)
    if (currentId.trim() === "") {
      // 입력값이 빈 문자열일 때 에러 상태 초기화
      setEmailCheckMessage("")
      return
    }

    if (!validateEmail(currentId)) {
      setEmailCheckMessage("")
    } else {
      handleEmailAuth()
    }
  }, 300) // 300ms 디바운스

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newId = e.target.value
    setId(newId)
    debouncedValidateEmail(newId)
  }

  // ** 디바운스를 사용한 이메일 인증 코드 유효성 검사 */
  const debouncedValidateEmailAuthCode = useDebounce((currentCode: string) => {
    console.log("디바운스된 validateEmailAuthCode:", currentCode)
    if (currentCode.length === 6 && emailSent && !emailConfirmed) {
      verifyEmailCodeMutation.mutate({ code: currentCode })
    }
  }, 300) // 300ms 디바운스

  const handleEmailAuthCodeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newCode = e.target.value
    setEmailAuthCode(newCode)
    debouncedValidateEmailAuthCode(newCode)
  }

  return (
    <>
      <SeoHelmet
        title="리뷰클릭-User Authentication"
        description="리뷰클릭은 제품과 서비스 전반에 걸친 다양한 사용자 리뷰를 한곳에서 제공합니다. 믿을 수 있는 평가와 상세한 리뷰로 현명한 소비를 지원합니다."
      />
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
                onChange={handleIdChange} // 변경된 핸들러 사용
                suffix="@naver.com"
                $isError={id !== "" && !validateEmail(id)}
                $marginBottom="0"
                errorMessage={
                  id !== "" && !validateEmail(id)
                    ? "올바른 형식의 계정이 아닙니다."
                    : undefined
                }
                $suffixWidth="28%"
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
                    onChange={handleEmailAuthCodeChange} // 변경된 핸들러 사용
                    $isError={
                      emailAuthCode !== "" && emailAuthCode.length !== 6
                    }
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

          <ButtonWrapper $visible={validateEmail(id) && !emailConfirmed}>
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
    </>
  )
}

export default AccountVerificationPage

const VerificationContainer = styled.div`
  padding: 5.2rem 0 0;
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
  color: var(--N600);
  em {
    color: var(--L400);
  }
`

const AccountVerifyText = styled.p`
  margin: 1.2rem 0 2.4rem;
  font-size: var(--font-body-size);
`

const TextFieldWrapper = styled.div`
  flex: 4;
  position: relative;
`

const ButtonWrapper = styled.div<{ $visible: boolean }>`
  position: fixed;
  padding: 1.6rem 1.5rem 4.1rem;
  width: 100%;
  bottom: 0;
  left: 0;
  background-color: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.08);
  transform: ${({ $visible }) =>
    $visible ? "translateY(0)" : "translateY(100%)"};
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition:
    transform 0.2s ease-in-out,
    opacity 0.1s ease-in-out;
  z-index: 100;
`

const TimerText = styled.span`
  position: absolute;
  right: 1.4rem;
  top: 1.5rem;
  font-size: var(--caption-size);
  color: var(--L400);
`
