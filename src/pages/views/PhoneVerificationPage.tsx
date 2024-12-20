import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { RoutePath } from "@/types/route-path"
import { useMutation } from "@tanstack/react-query"
import { phoneSendCode, phoneVerify } from "@/services/join"
import useScrollToTop from "@/hooks/useScrollToTop"
import TextField from "@/components/TextField"
import SeoHelmet from "@/components/SeoHelmet"
import Button from "@/components/Button"
import ReuseHeader from "@/components/ReuseHeader"
import useToast from "@/hooks/useToast"
import { validatePhone, formatTime } from "@/utils/util"
import { CustomError } from "@/types/api-types/signup-type"
import styled from "styled-components"
import useDebounce from "@/hooks/useDebounce"

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

  // ** 스크롤 0부터 시작 */
  useScrollToTop()

  // ** 휴대폰 인증 코드 전송 mutation */
  const sendPhoneCodeMutation = useMutation({
    mutationFn: phoneSendCode,
    onSuccess: (data) => {
      if (data.statusCode === 0) {
        setCodeSent(true)
        startTimer()
        addToast("인증번호가 발송되었습니다.", 3000, "verify")
      } else {
        addToast("인증번호 전송에 실패했습니다.", 3000, "verify")
      }
    },
    onError: (error: CustomError) => {
      const errorCode = error.response?.data?.errorCode
      switch (errorCode) {
        case 2:
          addToast("이메일인증을 먼저해주세요.", 3000, "verify")
          break
        default:
          addToast("인증번호 전송에 실패했습니다.", 3000, "verify")
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
        addToast("계정인증이 완료되었습니다", 3000, "verify")

        if (redirect) {
          navigate(redirect)
        } else {
          navigate(RoutePath.MyCampaign)
        }
      } else {
        addToast("인증번호가 올바르지 않습니다.", 3000, "verify")
      }
    },
    onError: (error: CustomError) => {
      const errorCode = error.response?.data?.errorCode
      switch (errorCode) {
        case 2:
          addToast("인증번호가 일치하지않습니다", 3000, "verify")
          break
        default:
          addToast("인증번호가 올바르지 않습니다.", 3000, "verify")
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
  }, [authCode, codeSent, phoneConfirmed, verifyPhoneCodeMutation])

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
            addToast("인증번호가 재발송되었습니다.", 3000, "verify")
          } else {
            addToast("인증번호 전송에 실패했습니다.", 3000, "verify")
          }
        },
        onError: (error: CustomError) => {
          const errorCode = error.response?.data?.errorCode
          switch (errorCode) {
            case 2:
              addToast("이메일인증을 먼저해주세요.", 3000, "verify")
              break
            default:
              addToast("인증번호 전송에 실패했습니다.", 3000, "verify")
              break
          }
        },
      }
    )
  }

  // ** 컴포넌트 언마운트 시 타이머 정리 */
  useEffect(() => {
    if (isPhoneVerify && isPhoneVerify !== "null") {
      addToast("이미 인증되었습니다", 3000, "verify")
      if (redirect) {
        navigate(redirect)
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPhoneVerify, redirect, navigate, addToast])

  // ** 디바운스를 사용한 전화번호 유효성 검사 */
  const debouncedValidatePhone = useDebounce((currentPhone: string) => {
    console.log("디바운스된 validatePhone:", currentPhone)
    if (currentPhone.trim() === "") {
      return
    }

    if (!validatePhone(currentPhone)) {
      console.log("유효하지 않은 전화번호:", currentPhone)
    }
  }, 300) // 300ms 디바운스

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = e.target.value
    setPhone(newPhone)
    debouncedValidatePhone(newPhone)
  }

  // ** 디바운스를 사용한 인증 코드 유효성 검사 */
  const debouncedValidateAuthCode = useDebounce((currentCode: string) => {
    console.log("Debounced validateAuthCode called with:", currentCode)
    if (currentCode.length === 6 && codeSent && !phoneConfirmed) {
      console.log("Auth code is 6 digits. Verifying...")
      verifyPhoneCodeMutation.mutate({ code: currentCode })
    }
  }, 300) // 300ms 디바운스

  const handleAuthCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCode = e.target.value
    setAuthCode(newCode)
    debouncedValidateAuthCode(newCode)
  }

  return (
    <>
      <SeoHelmet
        title="리뷰클릭-User Authentication"
        description="리뷰클릭은 제품과 서비스 전반에 걸친 다양한 사용자 리뷰를 한곳에서 제공합니다. 믿을 수 있는 평가와 상세한 리뷰로 현명한 소비를 지원합니다."
      />
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
            캠페인 진행 및 1:1 문의 안내에 대한 알림톡을 받아볼 수 있어요.
          </AccountVerifyText>

          <TextFieldWrapper>
            <TextField
              type="tel" // 전화번호 입력용
              name="phone"
              placeholder="휴대폰 번호 입력"
              value={phone}
              onChange={handlePhoneChange} // 변경된 핸들러 사용
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
                  onChange={handleAuthCodeChange} // 변경된 핸들러 사용
                  $isError={authCode !== "" && authCode.length !== 6}
                  $marginBottom="0"
                  $marginTop="0.8rem"
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
    </>
  )
}

export default PhoneVerificationPage

// Styled Components
const VerificationContainer = styled.div`
  padding: 5.2rem 0 0;
  height: 100vh;
`

const FormGroup = styled.div`
  margin-top: 0;
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
  position: relative;
  margin-bottom: 0.8rem;
`

const ButtonWrapper = styled.div<{ $visible: boolean }>`
  position: fixed;
  padding: 1.6rem 1.5rem 4.1rem;
  width: 100%;
  bottom: 0;
  left: 0;
  background-color: white;
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
  font-weight: var(--font-medium);
  color: var(--L400);
`
