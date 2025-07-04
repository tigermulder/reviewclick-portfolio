import { ModalProps } from "@/types/component-types/modal-type"
import styled from "styled-components"
import Button from "@/components/Button"
import { useEffect } from "react"
import { Link } from "react-router-dom"
import { RoutePath } from "@/types/route-path"

const Modal = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
  content,
  confirmText = "확인",
  cancelText,
  isLoading = false,
  showRouteLink = false,
}: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <Overlay>
      <ModalContainer>
        <TextContainer>
          <ModalHeader>{title}</ModalHeader>
          <ModalBody>{content}</ModalBody>
        </TextContainer>
        {/* 액션 버튼들 */}
        <ModalFooter>
          {isLoading ? (
            // 로딩 중일 때는 스피너 버튼 하나만 노출
            <Button $variant="spinner" disabled children={undefined} />
          ) : cancelText === "확인" ||
            cancelText === "작성한 리뷰 수정하기" ||
            cancelText === "영수증 재인증하기" ||
            cancelText === "로그인" ? (
            <Button onClick={onCancel} $variant="red">
              {cancelText}
            </Button>
          ) : (
            <>
              <Button onClick={onCancel} $variant="grey">
                {cancelText || "취소"}
              </Button>
              {onConfirm && (
                <Button onClick={onConfirm} $variant="red">
                  {confirmText}
                </Button>
              )}
            </>
          )}
        </ModalFooter>
        {showRouteLink && (
          <RouteLink to={RoutePath.Alert}>
            등록이 안되나요? 1:1 문의하기
          </RouteLink>
        )}
      </ModalContainer>
    </Overlay>
  )
}

export default Modal

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const ModalContainer = styled.div`
  background: white;
  border-radius: 1.2rem;
  width: 80%;
  max-width: 400px;
  padding: 2.2rem 2.4rem 1.6rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`

const TextContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  gap: 0.8rem;
`

const ModalHeader = styled.h3`
  align-self: stretch;
  color: var(--N600);
  line-height: 2.5rem;
`

const ModalBody = styled.p`
  margin-bottom: 2rem;
  color: var(--N400);
  em,
  span {
    font-weight: var(--font-bold);
  }
  ol {
    padding-left: 1.6rem;
    list-style: decimal;
    li:not(:last-child) {
      margin-bottom: 0.2rem;
    }
    span {
      color: var(--L400);
    }
  }
`

const ModalFooter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;
`

const RouteLink = styled(Link)`
  display: block;
  margin-top: 1.2rem;
  text-align: center;
  color: var(--N200);
  text-decoration: underline;
`
