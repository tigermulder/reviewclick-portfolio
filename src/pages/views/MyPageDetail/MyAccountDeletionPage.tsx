// MyAccountDeletionPage.tsx

import React, { useState, useEffect } from "react"
import ReuseHeader from "@/components/ReuseHeader"
import useToast from "@/hooks/useToast"
import { RoutePath } from "@/types/route-path"
import { useNavigate } from "react-router-dom"
import Modal from "@/components/Modal"
import Button from "@/components/Button"
import { quitUser } from "@/services/user"
import IconCheckList from "assets/ico_check_list.svg?url"
import IconChecking from "assets/ico_checking.svg?react"
import { authState } from "@/store/auth-recoil"
import { useSetRecoilState } from "recoil"
import styled from "styled-components"

const MyAccountDeletionPage: React.FC = () => {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const setAuth = useSetRecoilState(authState)
  const [registerEnabled, setRegisterEnabled] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [isResultModalOpen, setResultModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState<string>("")
  const [modalContent, setModalContent] = useState<string | React.ReactNode>("")
  const [modalConfirmText, setModalConfirmText] = useState<string>("확인")
  const [modalCancelText, setModalCancelText] = useState<string | undefined>(
    undefined
  )
  const userNickName = localStorage.getItem("nickname") || "사용자"

  useEffect(() => {
    setRegisterEnabled(isChecked)
  }, [isChecked])

  const handleDeleteAccount = async () => {
    try {
      const response = await quitUser({ reason: feedback })
      // const response = {
      //   statusCode: 0,
      // }
      if (response.statusCode === 0) {
        addToast("계정이 탈퇴처리 되었습니다.", "info", 3000, "QuitUser")
        // Recoil 로그인상태 업데이트
        setAuth({
          isLoggedIn: false,
          token: null,
        })
        sessionStorage.removeItem("authToken")
        localStorage.removeItem("email")
        localStorage.removeItem("nickname")
        const redirect = sessionStorage.getItem("redirectPath")
        if (redirect) {
          navigate(redirect)
        } else {
          navigate(RoutePath.Login)
        }
      } else {
        throw new Error()
      }
    } catch (err) {
      setResultModalOpen(false)
      addToast(
        "회원 탈퇴에 실패했습니다. 다시 시도해주세요.",
        "warning",
        3000,
        "QuitUser"
      )
    }
  }

  // 모달 오픈 핸들러
  const handleModalOpen = () => {
    setResultModalOpen(true)
    setModalTitle("정말 탈퇴하시겠어요?")
    setModalContent(
      <>
        탈퇴할 경우 3개월 이내
        <br />
        동일 계정으로 재가입이 불가능합니다.
      </>
    )
    setModalConfirmText("탈퇴하기")
    setModalCancelText("아니요")
  }

  // 모달 취소 버튼 핸들러
  const handleModalCancel = () => {
    setResultModalOpen(false)
  }

  return (
    <Container>
      <ReuseHeader
        title="회원탈퇴"
        onBack={() => navigate(RoutePath.UserAccountSetting)}
      />
      <UserTitle>
        <span>{userNickName}님</span>
        <br />
        정말 탈퇴하시겠어요?
      </UserTitle>

      <StepReasonList>
        <li>
          지금 탈퇴하시면 참여 예정이거나 현재 참여중인 캠페인을 더 이상
          이용하실 수 없게 돼요!
        </li>
        <li>
          지금 탈퇴하시면 보유하신 포인트도 함께 사라져요. 추후에 동일 계정으로
          재가입하셔도 포인트 내역은 복구되지 않아요!
        </li>
        <li>
          탈퇴 후에는 작성하신 리뷰를 수정 혹은 삭제하실 수 없어요. 탈퇴 신청
          전에 꼭 확인해주세요!
        </li>
        <li>
          <CheckboxWrapper>
            <Checkbox
              type="checkbox"
              id="agreement"
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
            />
            <CheckboxLabel htmlFor="agreement">
              <Icon checked={isChecked} />
              회원탈퇴 유의사항을 확인하였으며 이에 동의합니다.
            </CheckboxLabel>
          </CheckboxWrapper>
        </li>
      </StepReasonList>
      <StepReason>
        <Label>떠나시는 이유를 알려주세요.</Label>
        <TextArea
          placeholder={`서비스 탈퇴 사유에 대해 알려주세요.\n고객님의 소중한 피드백을 담아\n더 나은 서비스로 보답하겠습니다.`}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
      </StepReason>
      <Button
        type="button"
        $variant="red"
        disabled={!registerEnabled}
        onClick={handleModalOpen}
      >
        탈퇴하기
      </Button>
      {/* 결과 모달 */}
      <Modal
        isOpen={isResultModalOpen}
        onConfirm={handleDeleteAccount}
        onCancel={handleModalCancel}
        title={modalTitle}
        content={modalContent}
        confirmText={modalConfirmText}
        cancelText={modalCancelText}
      >
        <ModalContent>정말로 탈퇴하시겠습니까?</ModalContent>
      </Modal>
    </Container>
  )
}

export default MyAccountDeletionPage

// Styled Components

const Container = styled.div`
  padding: 4.4rem 0;
`

const UserTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: var(--font-weight-bold);
  line-height: var(--font-h2-line-height);
`

const StepReasonList = styled.ul`
  margin-top: 1.9rem;

  li {
    font-size: var(--font-bodyM-size);
    font-weight: var(--font-bodyM-weight);
    line-height: var(--font-bodyM-line-height);
    color: var(--n400-color);
    display: flex;
    align-items: flex-start;
    gap: 0.9rem;
    position: relative;
  }

  li:not(:last-child) {
    margin-bottom: 1rem;

    &::before {
      content: "";
      width: 1.6rem;
      height: 1.6rem;
      background: url("${IconCheckList}") no-repeat center / 100%;
      flex-shrink: 0;
    }
  }
`

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
`

const Checkbox = styled.input`
  display: none;
`

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: var(--font-bodyM-size);
  color: var(--n400-color);
`

const Icon = styled(IconChecking)<{ checked: boolean }>`
  width: 1.6rem;
  height: 1.6rem;
  margin-right: 0.9rem;
  color: ${({ checked }) =>
    checked ? "var(--success-color)" : "var(--n100-color)"};
`

const StepReason = styled.div`
  margin-top: 4.5rem;
`

const Label = styled.h2`
  margin-bottom: 0.65rem;
  font-size: 1.8rem;
  font-weight: var(--font-weight-bold);
`

const TextArea = styled.textarea`
  display: block;
  margin: 1.5rem 0;
  padding: 1.5rem;
  width: 100%;
  height: 19.8rem;
  border-radius: 1rem;
  border: 1px solid var(--whitesmoke);
  font-size: var(--font-bodyM-size);
  line-height: 1.5;
  resize: none;

  &::placeholder {
    font-size: var(--font-caption-size);
    line-height: 1.5;
    color: var(--n300-color);
  }
`

const ModalContent = styled.p`
  padding: 1rem;
  font-size: var(--font-bodyM-size);
  text-align: center;
`
