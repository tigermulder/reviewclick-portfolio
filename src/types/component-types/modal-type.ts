export interface ModalProps {
  isOpen: boolean
  onConfirm?: () => void
  onCancel: () => void
  title: string | React.ReactNode
  content: React.ReactNode
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
  showRouteLink?: boolean
  children?: React.ReactNode
}
