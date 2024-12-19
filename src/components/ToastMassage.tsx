import { useEffect, useRef } from "react"
import { useRecoilState } from "recoil"
import { toastListState } from "store/toast-recoil"
import styled, { keyframes } from "styled-components"

const ToastMassage = () => {
  const [toasts, setToasts] = useRecoilState(toastListState)
  const timersRef = useRef<{ [id: string]: NodeJS.Timeout }>({})

  useEffect(() => {
    toasts.forEach((toast) => {
      // 기존 타이머가 있다면 클리어
      if (timersRef.current[toast.id]) {
        clearTimeout(timersRef.current[toast.id])
      }
      // 지속 시간이 지정된 경우 타이머 설정
      if (toast.duration) {
        const timer = setTimeout(() => {
          removeToast(toast.id)
        }, toast.duration)
        // 타이머를 ref에 저장
        timersRef.current[toast.id] = timer
      }
    })

    // 컴포넌트 언마운트 시 모든 타이머 클리어
    return () => {
      Object.values(timersRef.current).forEach(clearTimeout)
      timersRef.current = {}
    }
  }, [toasts])

  /**
   * 토스트 메시지를 제거합니다.
   * @param id - 제거할 토스트 메시지의 고유 ID
   */
  const removeToast = (id: string): void => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    )
    // 타이머 클리어
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id])
      delete timersRef.current[id]
    }
  }

  /**
   * 토스트 메시지를 수동으로 닫습니다.
   * @param id - 닫을 토스트 메시지의 고유 ID
   */
  const handleClose = (id: string): void => {
    removeToast(id)
  }

  return (
    <ToastWrapper>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} onClick={() => handleClose(toast.id)}>
          <span>{toast.message}</span>
        </ToastItem>
      ))}
    </ToastWrapper>
  )
}

export default ToastMassage

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-15px); }
  to { opacity: 1; transform: translateY(0); }
`

const ToastWrapper = styled.div`
  position: fixed;
  top: 3.2rem;
  right: 1.6rem;
  left: 1.6rem;
  z-index: 9999;
`

const ToastItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.2rem 1.5rem;
  border-radius: 1.3rem;
  background-color: var(--RevBlack);
  color: white;
  animation: ${fadeIn} 0.18s ease-in-out;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
`
