// Progress 타입 정의
export const statusToStepMap: Record<string, number> = {
  join: 1,
  purchase: 2,
  confirm: 3,
  upload: 3,
  reward: 4,
  giveup: 4,
  timeout: 4,
}

export interface ProgressStepProps {
  status: string
}

export interface StepBoxProps {
  $status: "done" | "active" | "default"
}

export interface IcoCustomProps {
  $icon: string
  $isMissionFailed?: boolean
}
