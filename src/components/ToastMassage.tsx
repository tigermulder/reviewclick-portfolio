import { useEffect, useRef } from "react"
import { useRecoilState } from "recoil"
import { toastListState } from "store/toast-recoil"
import { Toast, ToastItemProps } from "types/component-types/toast-type"
import IconCopy from "assets/ico-copy.svg?react"
import styled, { keyframes } from "styled-components"

const toastIcons: Record<Toast["type"], React.ReactNode> = {
  check: <span role="img" aria-label="check"></span>,
  uncheck: <span role="img" aria-label="uncheck"></span>,
  info: <span role="img" aria-label="info"></span>,
  warning: <span role="img" aria-label="warning"></span>,
  copy: <IconCopy />,
}

const ToastMassage = (): JSX.Element => {
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

    // 클린업: 컴포넌트 언마운트 시 모든 타이머 클리어
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
        <ToastItem
          key={toast.id}
          type={toast.type}
          onClick={() => handleClose(toast.id)}
        >
          <Icon>{toastIcons[toast.type]}</Icon>
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

// 스타일 컴포넌트 정의
const ToastWrapper = styled.div`
  position: fixed;
  top: 20px;
  right: 15px;
  left: 15px;
  z-index: 9999;
`

const ToastItem = styled.div<ToastItemProps>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.2rem 1.5rem;
  border-radius: 1.3rem;
  background-color: var(--primary-color);
  color: white;
  animation: ${fadeIn} 0.18s ease-out;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
`

const Icon = styled.span`
  margin-right: 0.4rem;
  align-items: center;
  font-size: 1.5rem; /* 이모지 크기 조정 */

  svg {
    width: 1.3rem;
    height: 1.3rem;
    fill: currentColor;
  }
`
