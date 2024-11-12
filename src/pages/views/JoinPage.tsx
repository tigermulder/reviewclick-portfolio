import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { RoutePath } from "@/types/route-path"
import { useMutation } from "@tanstack/react-query"
import {
  checkEmail,
  sendEmailCode,
  verifyEmailCode,
  joinUser,
} from "@/services/join"
import { CustomError } from "@/types/api-types/signup-type"
import TextField from "@/components/TextField"
import Button from "@/components/Button"
import Checkbox from "@/components/CheckBox"
import ReuseHeader from "@/components/ReuseHeader"
import useToast from "@/hooks/useToast"
import {
  validateEmail,
  validateName,
  validatePassword,
  validatePhone,
} from "@/utils/util"
import styled from "styled-components"

const JoinPage = () => {
  const navigate = useNavigate()
  const [id, setId] = useState("")
  const [emailSent, setEmailSent] = useState(false)
  const [emailConfirmed, setEmailConfirmed] = useState(false)
  const [emailAuthCode, setEmailAuthCode] = useState("")
  const [name, setName] = useState("")
  const [password1, setPassword1] = useState("")
  const [password2, setPassword2] = useState("")
  const [phone, setPhone] = useState("")
  // const [referrerCode, setReferrerCode] = useState("")
  const [agreements, setAgreements] = useState({
    all: false,
    essential1: false,
    essential2: false,
    essential3: false,
    optionalAll: false,
    optional1: false,
  })
  const [registerEnabled, setRegisterEnabled] = useState(false)
  const [emailTimer, setEmailTimer] = useState(0)
  const emailTimerRef = useRef<NodeJS.Timeout | null>(null)
  const { addToast } = useToast()
  const [emailCheckMessage, setEmailCheckMessage] = useState<string>("")
  const [emailSendMessage, setEmailSendMessage] = useState<string>("")
  const [emailVerifyMessage, setEmailVerifyMessage] = useState<string>("")

  //** 이메일 체크 mutation */
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

  //** 이메일 인증 코드 전송 mutation */
  const sendEmailCodeMutation = useMutation({
    mutationFn: sendEmailCode,
    onSuccess: (data) => {
      if (data.statusCode === 0) {
        setEmailSent(true)
        startEmailTimer()
        setEmailSendMessage("인증 코드를 이메일로 전송했습니다.")
      } else {
        setEmailSendMessage("")
        addToast("인증 코드 전송에 실패했습니다.", "warning", 1000, "email")
      }
    },
    onError: () => {
      setEmailSendMessage("")
      addToast(
        "인증 코드 요청 중 오류가 발생했습니다.",
        "warning",
        1000,
        "email"
      )
    },
  })

  //** 이메일 인증 코드 확인 mutation */
  const verifyEmailCodeMutation = useMutation({
    mutationFn: verifyEmailCode,
    onSuccess: (data) => {
      if (data.statusCode === 0) {
        localStorage.setItem("email", id)
        setEmailConfirmed(true)
        resetEmailTimer()
        setEmailVerifyMessage("")
        addToast("계정인증이 완료되었습니다.", "check", 1200, "email")

        const redirect = sessionStorage.getItem("redirectPath")
        if (redirect) {
          navigate(redirect)
        }
      } else {
        setEmailVerifyMessage("")
        addToast("인증 코드가 올바르지 않습니다.", "warning", 1000, "email")
      }
    },
    onError: () => {
      setEmailVerifyMessage("")
      addToast(
        "인증 코드 확인 중 오류가 발생했습니다.",
        "warning",
        1000,
        "email"
      )
    },
  })

  //** 회원가입 mutation */
  // const joinUserMutation = useMutation({
  //   mutationFn: joinUser,
  //   onSuccess: (data) => {
  //     if (data.statusCode === 0) {
  //       addToast("회원가입이 완료되었습니다.", "info", 1000, "email")
  //       // navigate(RoutePath.Login)
  //     } else {
  //       addToast("회원가입에 실패했습니다.", "warning", 1000, "email")
  //     }
  //   },
  //   onError: () => {
  //     addToast("회원가입 중 오류가 발생했습니다.", "warning", 1000, "email")
  //   },
  // })

  //** 이메일 인증 타이머 시작 */
  const startEmailTimer = () => {
    setEmailTimer(300) // 5분
    if (emailTimerRef.current) clearInterval(emailTimerRef.current)
    emailTimerRef.current = setInterval(() => {
      setEmailTimer((prev) => {
        if (prev <= 1) {
          if (emailTimerRef.current) clearInterval(emailTimerRef.current)
          setEmailSent(false) // 타이머 종료 시 인증 코드 입력 필드 및 재발송 버튼 사라지도록
          setEmailSendMessage("")
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  //** 이메일 인증 타이머 초기화 */
  const resetEmailTimer = () => {
    if (emailTimerRef.current) clearInterval(emailTimerRef.current)
    setEmailTimer(0)
    setEmailSent(false) // 인증 완료 시 인증 코드 입력 필드 및 재발송 버튼 사라지도록
    setEmailSendMessage("")
  }

  //** 컴포넌트 언마운트 시 타이머 정리 */
  useEffect(() => {
    return () => {
      if (emailTimerRef.current) clearInterval(emailTimerRef.current)
    }
  }, [])

  //** 회원가입 버튼 활성화 조건 체크 */
  // useEffect(() => {
  //   const isRegisterEnabled =
  //     emailConfirmed &&
  //     validateName(name) &&
  //     validatePassword(password1) &&
  //     password1 === password2 &&
  //     validatePhone(phone) &&
  //     agreements.essential1 &&
  //     agreements.essential2 &&
  //     agreements.essential3
  //   setRegisterEnabled(isRegisterEnabled)
  // }, [
  //   emailConfirmed,
  //   name,
  //   password1,
  //   password2,
  //   phone,
  //   agreements.essential1,
  //   agreements.essential2,
  //   agreements.essential3,
  // ])

  //** 캐시워크 조건 체크 */
  useEffect(() => {
    const isRegisterEnabled = emailConfirmed
    setRegisterEnabled(isRegisterEnabled)
  }, [emailConfirmed])

  //** 이메일 인증 코드 유효성 검사 */
  useEffect(() => {
    if (emailAuthCode.length === 6 && emailSent && !emailConfirmed) {
      // 인증 코드 확인 요청
      const requestData = { code: emailAuthCode }
      verifyEmailCodeMutation.mutate(requestData)
    }
  }, [emailAuthCode])

  //** 이메일 체크 및 인증 코드 전송 함수 */
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

  //** 재발송 버튼 클릭 시 함수 */
  const handleResendEmailCode = () => {
    const email = `${id}@naver.com`
    const sendCodeData = { email }
    sendEmailCodeMutation.mutate(sendCodeData)
    // 타이머 재시작
    startEmailTimer()
    setEmailSendMessage("인증 코드를 재전송했습니다.")
  }

  //** 회원가입 요청 함수 */
  // const handleRegister = () => {
  //   const email = `${id}@naver.com`
  //   const joinData = {
  //     email,
  //     password: password1,
  //     nickname: name,
  //     phone,
  //   }
  //   joinUserMutation.mutate(joinData)
  // }

  //** 약관 동의 전체 체크박스 변경 함수 */
  const handleAgreementAllChange = (checked: boolean) => {
    setAgreements({
      all: checked,
      essential1: checked,
      essential2: checked,
      essential3: checked,
      optionalAll: checked,
      optional1: checked,
    })
    if (checked === false) {
      setId("")
    }
  }

  //** 선택 약관 전체 체크박스 변경 함수 */
  const handleOptionalAllChange = (checked: boolean) => {
    setAgreements((prev) => ({
      ...prev,
      optionalAll: checked,
      optional1: checked,
    }))
  }

  //** 약관 동의 개별 체크박스 변경 함수 */
  const handleAgreementChange = (name: string, checked: boolean) => {
    setAgreements((prev) => ({
      ...prev,
      [name]: checked,
      all: false,
    }))
  }

  //** 캐시워크 이메일 입력 필드의 활성화 상태를 결정변수 */
  const isEmailFieldDisabled =
    !agreements.essential1 ||
    !agreements.essential2 ||
    !agreements.essential3 ||
    emailSent ||
    emailConfirmed
  const redirect = sessionStorage.getItem("redirectPath")
  return (
    <Signup>
      <ReuseHeader
        title="계정인증"
        onBack={() => {
          if (redirect) {
            navigate(redirect)
          } else {
            navigate(RoutePath.MyCampaign)
          }
        }}
      />
      {/* 약관 동의 섹션 */}
      <AgreementSection>
        <AgreementAll>
          <CheckboxWrapper>
            <Checkbox
              label="전체약관동의"
              checked={agreements.all}
              onChange={(e) => handleAgreementAllChange(e.target.checked)}
              $isTitle={true}
            />
          </CheckboxWrapper>
        </AgreementAll>
        <AgreementList>
          <CheckboxItem>
            <CheckboxWrapper>
              <Checkbox
                label="만 14세 이상입니다. (필수)"
                checked={agreements.essential1}
                onChange={(e) =>
                  handleAgreementChange("essential1", e.target.checked)
                }
              />
            </CheckboxWrapper>
          </CheckboxItem>
          <CheckboxItem>
            <CheckboxWrapper>
              <Checkbox
                label="서비스 이용 약관에 동의합니다. (필수)"
                checked={agreements.essential2}
                onChange={(e) =>
                  handleAgreementChange("essential2", e.target.checked)
                }
              />
            </CheckboxWrapper>
          </CheckboxItem>
          <CheckboxItem>
            <CheckboxWrapper>
              <Checkbox
                label="개인 정보 수집 및 이용에 동의합니다. (필수)"
                checked={agreements.essential3}
                onChange={(e) =>
                  handleAgreementChange("essential3", e.target.checked)
                }
              />
            </CheckboxWrapper>
          </CheckboxItem>
          <CheckboxItem>
            <CheckboxWrapper>
              <Checkbox
                label="이메일/SMS/알림톡 수신 동의(선택)"
                checked={agreements.optionalAll}
                onChange={(e) => handleOptionalAllChange(e.target.checked)}
              />
            </CheckboxWrapper>
            {/* <SubAgreementList>
              <CheckboxItem>
                <CheckboxWrapper>
                  <Checkbox
                    label="이메일/SMS/알림톡 수신 동의(선택)"
                    checked={agreements.optional1}
                    onChange={(e) =>
                      handleAgreementChange("optional1", e.target.checked)
                    }
                  />
                </CheckboxWrapper>
              </CheckboxItem>
            </SubAgreementList> */}
            <NoticeText>
              * 이메일, SMS, 알림톡 수신에 동의하지 않는 경우 캠페인 관련
              알림을받아보실 수 없으며, 이에 따른 불이익에 대해서는 책임지지
              않습니다.
            </NoticeText>
          </CheckboxItem>
        </AgreementList>
      </AgreementSection>
      {/* 아이디 입력 및 이메일 인증 */}
      <FormGroup>
        <Label>
          <Required>*</Required> 아이디
          <TitleInfo>
            리뷰클릭 서비스는 네이버 아이디로만 인증 가능하며, 인증된 네이버
            계정과 캠페인 참여 계정이 동일해야 합니다.
          </TitleInfo>
        </Label>
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
              $suffixWidth="33.5%"
              successMessage={emailCheckMessage}
              disabled={isEmailFieldDisabled}
            />
          </TextFieldWrapper>
          <ButtonWrapper>
            <Button
              type="button"
              $variant="red"
              onClick={handleEmailAuth}
              disabled={!validateEmail(id) || emailConfirmed || emailSent}
              $marginTop="0"
            >
              {emailConfirmed ? "완료" : "인증"}
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
                  $marginTop="0.8rem"
                  errorMessage={
                    emailAuthCode !== "" && emailAuthCode.length !== 6
                      ? "인증 코드를 입력해 주세요."
                      : undefined
                  }
                  successMessage={emailVerifyMessage ? "" : emailSendMessage} // 인증 완료 시 메시지 숨기기
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
                $marginTop="0.8rem"
              >
                재발송
              </Button>
            </ButtonWrapper>
          </Row>
        )}
      </FormGroup>
      {/* 이름 입력 */}
      {/* <FormGroup>
        <Label>
          <Required>*</Required> 이름
        </Label>
        <TextFieldWrapper>
          <TextField
            type="text"
            name="name"
            placeholder="예) 김리뷰"
            value={name}
            onChange={(e) => setName(e.target.value)}
            $isError={name !== "" && !validateName(name)}
            errorMessage={
              name !== "" && !validateName(name)
                ? "한글로만 입력 가능합니다."
                : undefined
            }
          />
        </TextFieldWrapper>
      </FormGroup> */}
      {/* 비밀번호 입력 */}
      {/* <FormGroup>
        <Label>
          <Required>*</Required> 비밀번호
        </Label>
        <TextFieldWrapper>
          <TextField
            type="password"
            name="password1"
            placeholder="영문 대/소문자, 숫자, 특수문자 조합하여 8~16자"
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
            $isError={password1 !== "" && !validatePassword(password1)}
            errorMessage={
              password1 !== "" && !validatePassword(password1)
                ? "영문 대/소문자, 숫자, 특수문자를 조합하여 8~16자로 입력해 주세요."
                : undefined
            }
          />
        </TextFieldWrapper>
        <TextFieldWrapper>
          <TextField
            type="password"
            name="password2"
            placeholder="비밀번호 확인"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            $isError={password2 !== "" && password1 !== password2}
            errorMessage={
              password2 !== "" && password1 !== password2
                ? "비밀번호가 일치하지 않습니다."
                : undefined
            }
          />
        </TextFieldWrapper>
      </FormGroup> */}
      {/* 휴대폰 번호 입력 */}
      {/* <FormGroup>
        <Label>
          <Required>*</Required> 휴대폰 번호
          <Info>
            (아이디 찾기 시 필요한 정보입니다. 정확하게 입력해주세요.)
          </Info>
        </Label>
        <TextFieldWrapper>
          <TextField
            type="tel"
            name="phone"
            placeholder="휴대폰 번호 입력(‘-’제외)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            $isError={phone !== "" && !validatePhone(phone)}
            errorMessage={
              phone !== "" && !validatePhone(phone)
                ? "- 없이 8자리 이상의 숫자로 입력해주세요."
                : undefined
            }
          />
        </TextFieldWrapper>
      </FormGroup> */}
      {/* 추천인 코드 입력 */}
      {/* <FormGroup>
        <Label>
          추천인 코드 입력 <Info>(선택)</Info>
        </Label>
        <TextFieldWrapper>
          <TextField
            type="text"
            name="referrer_code"
            placeholder="추천인 코드 입력"
            value={referrerCode}
            onChange={(e) => setReferrerCode(e.target.value)}
          />
        </TextFieldWrapper>
      </FormGroup> */}
      {/* 회원가입 버튼 */}
      {/* <ButtonWrap>
        <Button
          type="button"
          $variant="red"
          onClick={handleRegister}
          disabled={!registerEnabled}
          $marginTop="0"
        >
          계정인증
        </Button>
      </ButtonWrap> */}
    </Signup>
  )
}

export default JoinPage

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s < 10 ? `0${s}` : s}`
}

const Signup = styled.div`
  padding: 6rem 0 10rem;
`

const TitleInfo = styled.p`
  margin: 0.6rem 0 0.9rem;
  padding: 0.8rem 1.5rem 0.9rem 1.1rem;
  font-size: 1.1rem;
  font-weight: var(--font-weight-medium);
  letter-spacing: -0.2px;
  line-height: normal;
  color: var(--prim-L300);
  background: #f4f5f5;
  border-radius: 0.8rem;
  display: flex;
  align-items: start;
`

const FormGroup = styled.div`
  margin-top: 0;
`

const Label = styled.label`
  display: block;
  margin-bottom: 1rem;
  font-size: var(--font-title-size);
  font-weight: var(--font-title-weight);
  line-height: var(--font-title-line-height);
  letter-spacing: var(--font-title-letter-spacing);
  color: var(--n600-color);
`

const Required = styled.em`
  color: var(--revu-color);
`

const Info = styled.span`
  margin-left: 0.4rem;
  font-size: 1.1rem;
  font-weight: var(--font-weight-light);
  letter-spacing: -0.2px;
`

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
`

const TextFieldWrapper = styled.div`
  flex: 4;
  position: relative;
`

const ButtonWrapper = styled.div`
  flex: 1;
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

const AgreementSection = styled.div`
  margin: 1rem 0 2rem;
`

const AgreementAll = styled.div`
  padding-bottom: 1.2rem;
  border-bottom: 0.1rem solid var(--n40-color);
`

const AgreementList = styled.ul`
  margin-top: 1.7rem;
`

const CheckboxItem = styled.li`
  margin-top: 1.2rem;
`

const SubAgreementList = styled.ul`
  margin-left: 2.5rem;
  margin-top: 1rem;
`

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
`

const NoticeText = styled.p`
  margin-top: 1rem;
  font-size: var(--font-caption-size);
  font-weight: var(--font-caption-weight);
  line-height: var(--font-caption-line-height);
  letter-spacing: var(--font-caption-letter-spacing);
  color: var(--n400-color);
`

const ButtonWrap = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1.2rem 1.5rem;
  background: var(--white);
  border-top: 0.1rem solid var(--n40-color);
`
