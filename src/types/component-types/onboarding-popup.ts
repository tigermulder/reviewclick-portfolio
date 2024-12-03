export interface OnboardingPopupProps {
  onClose: () => void
}
export interface CloseButtonProps {
  $color: string
}

export interface SlideData {
  title?: string
  description?: React.ReactNode
  animationButton?: React.ReactNode
  handIcon?: string
  buttonText?: string
  imageSrc?: string
  imageTitle?: string
  LastButtonText?: string
  fixedButton?: React.ReactNode
}

export interface InfoAreaTitleProps {
  isLast: boolean
}

export interface IcoHandProps {
  $animate: boolean
}

export interface SlideHeightProvider {
  $height: boolean
}
