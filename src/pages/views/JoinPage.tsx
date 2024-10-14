// src/pages/JoinPage.tsx
import { useState, useEffect, useRef } from "react"
import styled from "styled-components"
import { useNavigate } from "react-router-dom"
import { RoutePath } from "@/types/route-path"
import { useMutation } from "@tanstack/react-query"
import {
  checkEmail,
  sendEmailCode,
  verifyEmailCode,
  joinUser,
} from "@/services/join"
import {
  EmailCheckRequest,
  EmailCheckResponse,
  SendEmailCodeRequest,
  SendEmailCodeResponse,
  VerifyEmailCodeRequest,
  VerifyEmailCodeResponse,
  JoinRequest,
  JoinResponse,
} from "types/api-types/signup-type"
import TextField from "@/components/TextField"
import Button from "@/components/Button"
import Checkbox from "@/components/CheckBox"
import BackIcon from "assets/ico_back.svg?react"
import useToast from "@/hooks/useToast"

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
  const [referrerCode, setReferrerCode] = useState("")
  const [agreements, setAgreements] = useState({
    all: false,
    essential1: false,
    essential2: false,
    essential3: false,
    optionalAll: false,
    optional1: false,
    optional2: false,
  })
  const [registerEnabled, setRegisterEnabled] = useState(false)
  const [emailTimer, setEmailTimer] = useState(0)
  const emailTimerRef = useRef<NodeJS.Timeout | null>(null)
  const { addToast } = useToast()

  // 이메일 체크 mutation
  const emailCheckMutation = useMutation<
    EmailCheckResponse,
    Error,
    EmailCheckRequest
  >({
    mutationFn: checkEmail,
    onSuccess: (data) => {
      if (data.statusCode === 0) {
        // 이메일 사용 가능
        addToast("가입이 가능한 네이버 아이디입니다.", "check", 1000, "email")
        // 이메일 인증 코드 전송
        const email = `${id}@naver.com`
        const sendCodeData: SendEmailCodeRequest = { email }
        sendEmailCodeMutation.mutate(sendCodeData)
      } else {
        // 이미 가입한 계정
        addToast("이미 가입한 계정입니다.", "warning", 1000, "email")
      }
    },
    onError: () => {
      addToast("이메일 체크 중 오류가 발생했습니다.", "warning", 1000, "email")
    },
  })

  // 이메일 인증 코드 전송 mutation
  const sendEmailCodeMutation = useMutation<
    SendEmailCodeResponse,
    Error,
    SendEmailCodeRequest
  >({
    mutationFn: sendEmailCode,
    onSuccess: (data) => {
      if (data.statusCode === 0) {
        setEmailSent(true)
        startEmailTimer()
        addToast("인증 코드를 이메일로 전송했습니다.", "check", 1000, "email")
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

  // 이메일 인증 코드 확인 mutation
  const verifyEmailCodeMutation = useMutation<
    VerifyEmailCodeResponse,
    Error,
    VerifyEmailCodeRequest
  >({
    mutationFn: verifyEmailCode,
    onSuccess: (data) => {
      if (data.statusCode === 0) {
        setEmailConfirmed(true)
        resetEmailTimer()
        addToast("이메일 인증이 완료되었습니다.", "check", 1000, "email")
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

  // 회원가입 mutation
  const joinUserMutation = useMutation<JoinResponse, Error, JoinRequest>({
    mutationFn: joinUser,
    onSuccess: (data) => {
      if (data.statusCode === 0) {
        addToast("회원가입이 완료되었습니다.", "info", 1000, "email")
        navigate(RoutePath.Login)
      } else {
        addToast("회원가입에 실패했습니다.", "warning", 1000, "email")
      }
    },
    onError: () => {
      addToast("회원가입 중 오류가 발생했습니다.", "warning", 1000, "email")
    },
  })

  // 이메일 인증 타이머 시작
  const startEmailTimer = () => {
    setEmailTimer(100) // 5분
    if (emailTimerRef.current) clearInterval(emailTimerRef.current)
    emailTimerRef.current = setInterval(() => {
      setEmailTimer((prev) => {
        if (prev <= 1) {
          if (emailTimerRef.current) clearInterval(emailTimerRef.current)
          setEmailSent(false) // 타이머 종료 시 인증 코드 입력 필드 및 재발송 버튼 사라지도록
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // 이메일 인증 타이머 초기화
  const resetEmailTimer = () => {
    if (emailTimerRef.current) clearInterval(emailTimerRef.current)
    setEmailTimer(0)
    setEmailSent(false) // 인증 완료 시 인증 코드 입력 필드 및 재발송 버튼 사라지도록
  }

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (emailTimerRef.current) clearInterval(emailTimerRef.current)
    }
  }, [])

  // 회원가입 버튼 활성화 조건 체크
  useEffect(() => {
    const isRegisterEnabled =
      emailConfirmed &&
      validateName(name) &&
      validatePassword(password1) &&
      password1 === password2 &&
      validatePhone(phone) &&
      agreements.essential1 &&
      agreements.essential2 &&
      agreements.essential3
    setRegisterEnabled(isRegisterEnabled)
  }, [
    emailConfirmed,
    name,
    password1,
    password2,
    phone,
    agreements.essential1,
    agreements.essential2,
    agreements.essential3,
  ])

  // 이메일 인증 코드 유효성 검사
  useEffect(() => {
    if (emailAuthCode.length === 6 && emailSent && !emailConfirmed) {
      // 인증 코드 확인 요청
      const requestData: VerifyEmailCodeRequest = { code: emailAuthCode }
      verifyEmailCodeMutation.mutate(requestData)
    }
  }, [emailAuthCode])

  // 이메일 체크 및 인증 코드 전송 함수
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
    const emailCheckData: EmailCheckRequest = { email }
    emailCheckMutation.mutate(emailCheckData)
  }

  // 재발송 버튼 클릭 시 함수
  const handleResendEmailCode = () => {
    const email = `${id}@naver.com`
    const sendCodeData: SendEmailCodeRequest = { email }
    sendEmailCodeMutation.mutate(sendCodeData)
    // 타이머 재시작
    startEmailTimer()
    addToast("인증 코드를 재전송했습니다.", "check", 1000, "email")
  }

  // 회원가입 요청 함수
  const handleRegister = () => {
    const email = `${id}@naver.com`
    const joinData: JoinRequest = {
      email,
      password: password1,
      nickname: name,
      phone,
      partner_uid: referrerCode,
    }
    joinUserMutation.mutate(joinData)
  }

  // 유효성 검사 함수들
  const validateEmail = (id: string) => {
    const email = `${id}@naver.com`
    const regex = /^[a-zA-Z0-9._%+-]+@naver\.com$/
    return regex.test(email)
  }

  const validateName = (name: string) => {
    const regex = /^[가-힣]{2,}$/
    return regex.test(name)
  }

  const validatePassword = (password: string) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/
    return regex.test(password)
  }

  const validatePhone = (phone: string) => {
    const regex = /^010\d{8}$/
    return regex.test(phone)
  }

  // 약관 동의 전체 체크박스 변경 함수
  const handleAgreementAllChange = (checked: boolean) => {
    setAgreements({
      all: checked,
      essential1: checked,
      essential2: checked,
      essential3: checked,
      optionalAll: checked,
      optional1: checked,
      optional2: checked,
    })
  }

  // 약관 동의 개별 체크박스 변경 함수
  const handleAgreementChange = (name: string, checked: boolean) => {
    setAgreements((prev) => ({
      ...prev,
      [name]: checked,
      all: false, // 전체 동의 해제
    }))
  }

  // 선택 약관 전체 체크박스 변경 함수
  const handleOptionalAllChange = (checked: boolean) => {
    setAgreements((prev) => ({
      ...prev,
      optionalAll: checked,
      optional1: checked,
      optional2: checked,
    }))
  }

  return (
    <Signup>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <BackIcon />
        </BackButton>
        <Title>회원가입</Title>
      </Header>
      {/* 아이디 입력 및 이메일 인증 */}
      <FormGroup>
        <Label>
          <Required>*</Required> 아이디
          <TitleInfo>
            리뷰클릭 서비스는 네이버 아이디로만 가입 가능하며, 가입한 네이버
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
            />
          </TextFieldWrapper>
          <ButtonWrapper>
            <Button
              type="button"
              $variant="red"
              onClick={handleEmailAuth}
              disabled={!validateEmail(id) || (emailSent && !emailConfirmed)}
              $marginTop="0" // 인증 버튼에 margin-top이 필요 없다면 '0'으로 설정
            >
              인증
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
                  $marginTop="0.8rem" // 인증 코드 입력 필드에 margin-top 적용
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
                $marginTop="0.8rem" // 재발송 버튼에 margin-top 적용
              >
                재발송
              </Button>
            </ButtonWrapper>
          </Row>
        )}
      </FormGroup>
      {/* 이름 입력 */}
      <FormGroup>
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
      </FormGroup>
      {/* 비밀번호 입력 */}
      <FormGroup>
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
      </FormGroup>
      {/* 휴대폰 번호 입력 */}
      <FormGroup>
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
      </FormGroup>
      {/* 추천인 코드 입력 */}
      <FormGroup>
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
      </FormGroup>
      {/* 약관 동의 섹션 */}
      <AgreementSection>
        <AgreementAll>
          <CheckboxWrapper>
            <Checkbox
              label="전체동의"
              checked={agreements.all}
              onChange={(e) => handleAgreementAllChange(e.target.checked)}
              isTitle={true}
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
                label="이벤트 및 혜택 안내 개인정보 수집·이용에 동의합니다. (선택)"
                checked={agreements.optionalAll}
                onChange={(e) => handleOptionalAllChange(e.target.checked)}
              />
            </CheckboxWrapper>
            <SubAgreementList>
              <CheckboxItem>
                <CheckboxWrapper>
                  <Checkbox
                    label="이메일 수신 동의(선택)"
                    checked={agreements.optional1}
                    onChange={(e) =>
                      handleAgreementChange("optional1", e.target.checked)
                    }
                  />
                </CheckboxWrapper>
              </CheckboxItem>
              <CheckboxItem>
                <CheckboxWrapper>
                  <Checkbox
                    label="SMS 수신 동의(선택)"
                    checked={agreements.optional2}
                    onChange={(e) =>
                      handleAgreementChange("optional2", e.target.checked)
                    }
                  />
                </CheckboxWrapper>
              </CheckboxItem>
            </SubAgreementList>
            <NoticeText>
              *이메일/SMS수신에 동의하지 않으실 경우 캠페인 알림, 계정 찾기 등
              관련 알림을 받아볼 수 없습니다.
            </NoticeText>
          </CheckboxItem>
        </AgreementList>
      </AgreementSection>
      {/* 회원가입 버튼 */}
      <ButtonWrap>
        <Button
          type="button"
          $variant="red"
          onClick={handleRegister}
          disabled={!registerEnabled}
          $marginTop="0" // 필요에 따라 설정
        >
          회원가입
        </Button>
      </ButtonWrap>
    </Signup>
  )
}

export default JoinPage

// 시간 형식 변환 함수
const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s < 10 ? `0${s}` : s}`
}

// 스타일 컴포넌트들
const Signup = styled.div`
  padding-bottom: 10rem;
`

const Header = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 4rem;
  background: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
`

const BackButton = styled.button`
  position: absolute;
  left: 0.4rem;
  background: none;
  border: none;
  cursor: pointer;
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

const Title = styled.h1`
  font-size: var(--font-h3-size);
  font-weight: var(--font-h3-weight);
  line-height: var(--font-h3-line-height);
  letter-spacing: var(--font-h3-letter-spacing);
`

// Form Group
const FormGroup = styled.div`
  margin-top: 2rem;
`

const Label = styled.label`
  display: block;
  margin-bottom: 0.6rem;
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

// Row
const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
`

// TextField Wrapper
const TextFieldWrapper = styled.div`
  flex: 4;
  position: relative;
`

// Button Wrapper
const ButtonWrapper = styled.div`
  flex: 1;
`

// 타이머 텍스트
const TimerText = styled.span`
  position: absolute;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  font-weight: var(--font-weight-medium);
  color: var(--revu-color);
`

// 약관 동의 섹션
const AgreementSection = styled.div`
  margin-top: 5rem;
`

// 전체 동의
const AgreementAll = styled.div`
  padding-bottom: 1.2rem;
  border-bottom: 0.1rem solid var(--n40-color);
`

// 약관 리스트
const AgreementList = styled.ul`
  margin-top: 1.7rem;
`

// 체크박스 아이템
const CheckboxItem = styled.li`
  margin-top: 1.2rem;
`

// 서브 약관 리스트
const SubAgreementList = styled.ul`
  margin-left: 2.5rem;
  margin-top: 1rem;
`

// 체크박스 래퍼
const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
`

// 알림 텍스트
const NoticeText = styled.p`
  margin-top: 2.4rem;
  font-size: var(--font-caption-size);
  font-weight: var(--font-caption-weight);
  line-height: var(--font-caption-line-height);
  letter-spacing: var(--font-caption-letter-spacing);
  color: var(--n400-color);
`

// 회원가입 버튼 래퍼
const ButtonWrap = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1.2rem 1.5rem;
  background: var(--white);
  border-top: 0.1rem solid var(--n40-color);
`
