export interface OnboardingPopupProps {
  onClose: () => void
}
export interface CloseButtonProps {
  $color: string
}

export interface SlideData {
  title?: string
  description?: React.ReactNode
  buttonText?: string
  imageSrc?: string
  imageTitle?: string
  LastButtonText?: string
}

export interface InfoAreaTitleProps {
  isLast: boolean
}
