// ** 토스트 메시지 type */
export type ToastType = "check" | "uncheck" | "info" | "warning" | "copy"

export interface Toast {
  id: string // 고유 식별자
  key?: string // 토스트를 식별하기 위한 고유 키 (선택 사항)
  message: string // 토스트 메시지 내용
  duration?: number // 지속 시간 (밀리초 단위, 선택 사항)
}
