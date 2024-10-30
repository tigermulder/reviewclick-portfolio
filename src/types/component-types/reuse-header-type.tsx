export interface HeaderProps {
  title: string | React.ReactNode
  onBack?: () => void // BackButton 동작을 외부에서 정의할 수 있게 함 (옵션)
}

export interface ReuseHeaderProps extends HeaderProps {
  steps?: string[] // 스텝 이름 배열
  currentStep?: number // 현재 스텝 인덱스
  onStepChange?: (step: number) => void // 스텝 변경 핸들러
}
