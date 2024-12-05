import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { RoutePath } from "@/types/route-path"
import { useMutation } from "@tanstack/react-query"
import { phoneSendCode, phoneVerify } from "@/services/join"
import TextField from "@/components/TextField"
import Button from "@/components/Button"
import ReuseHeader from "@/components/ReuseHeader"
import useToast from "@/hooks/useToast"
import { validatePhone, formatTime } from "@/utils/util"
import { CustomError } from "@/types/api-types/signup-type"
import styled from "styled-components"

const PhoneVerificationPage = () => {
  const navigate = useNavigate()
  const [phone, setPhone] = useState("")
  const [codeSent, setCodeSent] = useState(false)
  const [phoneConfirmed, setPhoneConfirmed] = useState(false)
  const [authCode, setAuthCode] = useState("")
  const [timer, setTimer] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const { addToast } = useToast()

  const redirect = sessionStorage.getItem("redirectPath")
  const isPhoneVerify = localStorage.getItem("userPhoneNumber")

  // ** 휴대폰 인증 코드 전송 mutation */
  const sendPhoneCodeMutation = useMutation({
    mutationFn: phoneSendCode,
    onSuccess: (data) => {
      if (data.statusCode === 0) {
        setCodeSent(true)
        startTimer()
        addToast("인증번호가 발송되었습니다.", "check", 3000, "verify")
      } else {
        addToast("인증번호 전송에 실패했습니다.", "warning", 3000, "verify")
      }
    },
    onError: (error: CustomError) => {
      const errorCode = error.response?.data?.errorCode
      switch (errorCode) {
        case 2:
          addToast("이메일인증을 먼저해주세요.", "warning", 3000, "verify")
          break
        default:
          addToast("인증번호 전송에 실패했습니다.", "warning", 3000, "verify")
          break
      }
    },
  })

  // ** 휴대폰 인증 코드 확인 mutation */
  const verifyPhoneCodeMutation = useMutation({
    mutationFn: phoneVerify,
    onSuccess: (data) => {
      if (data.statusCode === 0) {
        localStorage.setItem("userPhoneNumber", phone)
        setPhoneConfirmed(true)
        resetTimer()
        addToast("계정인증이 완료되었습니다", "check", 3000, "verify")

        if (redirect) {
          navigate(redirect)
        } else {
          navigate(RoutePath.MyCampaign)
        }
      } else {
        addToast("인증번호가 올바르지 않습니다.", "warning", 3000, "verify")
      }
    },
    onError: (error: CustomError) => {
      const errorCode = error.response?.data?.errorCode
      switch (errorCode) {
        case 2:
          addToast("인증번호가 일치하지않습니다", "warning", 3000, "verify")
          break
        default:
          addToast("인증번호가 올바르지 않습니다.", "warning", 3000, "verify")
          break
      }
    },
  })

  // ** 인증 타이머 시작 */
  const startTimer = () => {
    setTimer(300) // 5분
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          setCodeSent(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // ** 인증 타이머 초기화 */
  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setTimer(0)
    setCodeSent(false)
  }

  // ** 인증 코드 유효성 검사 */
  useEffect(() => {
    if (authCode.length === 6 && codeSent && !phoneConfirmed) {
      const requestData = { code: authCode }
      verifyPhoneCodeMutation.mutate(requestData)
    }
  }, [authCode, codeSent, phoneConfirmed])

  // ** 인증번호 전송 함수 */
  const handleSendCode = () => {
    sendPhoneCodeMutation.mutate({ phone })
  }

  // ** 재발송 버튼 클릭 시 함수 */
  const handleResendCode = () => {
    sendPhoneCodeMutation.mutate(
      { phone },
      {
        onSuccess: (data) => {
          if (data.statusCode === 0) {
            startTimer()
            setAuthCode("")
            addToast("인증번호가 재발송되었습니다.", "warning", 3000, "verify")
          } else {
            addToast("인증번호 전송에 실패했습니다.", "warning", 3000, "verify")
          }
        },
        onError: (error: CustomError) => {
          const errorCode = error.response?.data?.errorCode
          switch (errorCode) {
            case 2:
              addToast("이메일인증을 먼저해주세요.", "warning", 3000, "verify")
              break
            default:
              addToast(
                "인증번호 전송에 실패했습니다.",
                "warning",
                3000,
                "verify"
              )
              break
          }
        },
      }
    )
  }

  // ** 컴포넌트 언마운트 시 타이머 정리 */
  useEffect(() => {
    if (isPhoneVerify && isPhoneVerify !== "null") {
      addToast("이미 인증되었습니다", "warning", 3000, "verify")
      if (redirect) {
        navigate(redirect)
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  return (
    <VerificationContainer>
      <ReuseHeader
        title="휴대폰 번호 인증"
        onBack={() => {
          navigate(-1)
        }}
      />
      <FormGroup>
        <AccountVerifyTitle>
          리뷰클릭 이용을 위해 <br />
          <em>휴대폰 번호 인증</em>을 해주세요
        </AccountVerifyTitle>
        <AccountVerifyText>
          캠페인 진행 및 1:1 문의 안내에 대한 알림톡을 받아볼 수 있어요. <br />
          알림톡 수신에 동의하지 않을 경우 캠페인 신청이 어려워요.
        </AccountVerifyText>

        <TextFieldWrapper>
          <TextField
            type="text"
            name="phone"
            placeholder="휴대폰 번호 입력"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            $isError={phone !== "" && !validatePhone(phone)}
            $marginBottom="0"
            errorMessage={
              phone !== "" && !validatePhone(phone)
                ? " - 없이 11자리 숫자로 입력해 주세요."
                : undefined
            }
            disabled={codeSent || phoneConfirmed}
          />
        </TextFieldWrapper>
        {codeSent && (
          <TextFieldWrapper>
            <div style={{ position: "relative" }}>
              <TextField
                type="text"
                name="phone_auth_code"
                placeholder="인증번호 입력"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                $isError={authCode !== "" && authCode.length !== 6}
                $marginBottom="0"
                $marginTop="1.2rem"
                errorMessage={
                  authCode !== "" && authCode.length !== 6
                    ? "인증번호가 올바르지 않습니다. 다시 확인해 주세요."
                    : undefined
                }
              />
              <TimerText>{formatTime(timer)}</TimerText>
            </div>
          </TextFieldWrapper>
        )}

        <ButtonWrapper $visible={validatePhone(phone) && !phoneConfirmed}>
          <Button
            type="button"
            $variant="red"
            onClick={codeSent ? handleResendCode : handleSendCode}
            disabled={phoneConfirmed}
            $marginTop="0"
          >
            {codeSent ? "인증번호 다시받기" : "인증번호 받기"}
          </Button>
        </ButtonWrapper>
      </FormGroup>
    </VerificationContainer>
  )
}

export default PhoneVerificationPage

const VerificationContainer = styled.div`
  padding: 4.4rem 0 0;
  height: 100vh;
`

const FormGroup = styled.div`
  margin-top: 0;
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
  position: relative;
  margin-bottom: 0.8rem;
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
