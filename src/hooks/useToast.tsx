import { useSetRecoilState } from "recoil"
import { toastListState } from "store/toast-recoil"
import { Toast, ToastType } from "types/component-types/toast-type"
import { v4 as uuidv4 } from "uuid"

const useToast = () => {
  const setToasts = useSetRecoilState(toastListState)

  /**
   * 토스트 메시지를 추가하거나 업데이트합니다.
   * @param message - 토스트 메시지 내용
   * @param duration - 지속 시간 (밀리초 단위)
   * @param key - 토스트를 식별하기 위한 고유 키 (선택 사항)
   */
  const addToast = (
    message: string,
    duration: number = 1000,
    key?: string
  ): void => {
    setToasts((currentToasts) => {
      if (key) {
        const existingToastIndex = currentToasts.findIndex(
          (toast) => toast.key === key
        )
        if (existingToastIndex !== -1) {
          // 기존 토스트 메시지 업데이트
          const updatedToasts = [...currentToasts]
          updatedToasts[existingToastIndex] = {
            ...updatedToasts[existingToastIndex],
            message,
            duration,
          }
          return updatedToasts
        }
      }
      // 새로운 토스트 메시지 추가
      const id = uuidv4() // 고유 ID 생성
      const newToast: Toast = { id, message, duration, key }
      return [...currentToasts, newToast]
    })
  }

  return { addToast }
}
export default useToast
