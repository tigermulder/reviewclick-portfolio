export interface ButtonProps {
  children: React.ReactNode
  disabled?: boolean
  $variant:
    | "red"
    | "outlined"
    | "join"
    | "arrow"
    | "grey"
    | "pink"
    | "default"
    | "success"
    | "failed"
    | "copy"
    | "spinner"
    | "disable"
    | "onboarding01"
  type?: "button" | "submit" | "reset"
  $marginTop?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

export interface StyledButtonProps {
  $variant:
    | "red"
    | "outlined"
    | "join"
    | "arrow"
    | "grey"
    | "pink"
    | "default"
    | "success"
    | "failed"
    | "copy"
    | "spinner"
    | "disable"
    | "onboarding01"
  $marginTop?: string
  disabled?: boolean
}
