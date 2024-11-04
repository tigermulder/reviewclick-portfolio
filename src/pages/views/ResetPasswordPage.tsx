import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import ReuseHeader from "@/components/ReuseHeader"
import TextField from "@/components/TextField"
import { RoutePath } from "@/types/route-path"
import Modal from "@/components/Modal"
import Button from "@/components/Button"
import { validatePassword } from "@/utils/util"
import { resetPassword } from "@/services/join"

const ResetPasswordPage = () => {
  const navigate = useNavigate()
  const [password1, setPassword1] = useState("")
  const [password2, setPassword2] = useState("")
  const [registerEnabled, setRegisterEnabled] = useState(false)
  //** 모달 상태 관리 */
  const [isResultModalOpen, setResultModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState<string>("")
  const [modalContent, setModalContent] = useState<string | React.ReactNode>("")
  const [modalConfirmText, setModalConfirmText] = useState<string>("확인")
  const [modalCancelText, setModalCancelText] = useState<string | undefined>(
    undefined
  )

  //** 비밀번호 재설정 활성화 조건 체크 */
  useEffect(() => {
    const buttonEnabled =
      password1 !== "" &&
      password2 !== "" &&
      password1 === password2 &&
      validatePassword(password1)
    setRegisterEnabled(buttonEnabled)
  }, [password1, password2])

  //** 비밀번호 재설정 핸들러 */
  const handleResetPassword = async () => {
    try {
      const response = await resetPassword({
        password: password1,
      })

      if (response.statusCode === 0) {
        setModalTitle("👏 비밀번호 재설정 완료!")
        setModalContent(
          <>
            비밀번호 재설정이 완료되었습니다
            <br />
            로그인 후 이용해주세요.
          </>
        )
        setModalConfirmText("로그인하기")
        setModalCancelText("로그인")
        setResultModalOpen(true)
      }
    } catch (err) {
      setModalTitle("⛔ 비밀번호 재설정 실패")
      setModalContent(
        <>
          비밀번호 재설정에 실패하였습니다
          <br />
          다시 시도해주세요.
        </>
      )
      setModalCancelText("확인")
      setResultModalOpen(true)
    }
  }

  // 모달 로그인버튼 핸들러
  const handleModalConfirm = () => {
    setResultModalOpen(false)
    if (modalCancelText === "로그인") {
      navigate(RoutePath.Login)
    }
  }

  return (
    <Container>
      <ReuseHeader
        title="비밀번호 재설정"
        onBack={() => navigate(RoutePath.Login)}
      />
      <Label>새로운 비밀번호</Label>
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
      <Label>새로운 비밀번호 확인</Label>
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
      <Button
        type="button"
        disabled={!registerEnabled}
        $variant="red"
        onClick={handleResetPassword}
      >
        비밀번호 재설정
      </Button>

      {/* 결과 모달 */}
      <Modal
        isOpen={isResultModalOpen}
        title={modalTitle}
        content={modalContent}
        confirmText={modalConfirmText}
        cancelText={modalCancelText}
        onCancel={handleModalConfirm}
        showRouteLink={true}
      />
    </Container>
  )
}

export default ResetPasswordPage

const Container = styled.div`
  padding: 4.6rem 0;
  display: flex;
  flex-direction: column;
`

const Label = styled.p`
  margin: 0 0 0.8rem 0.4rem;
  color: var(--primary-color);
  font-size: var(--font-bodyL-size);
  font-weight: var(--font-weight-medium);
`
