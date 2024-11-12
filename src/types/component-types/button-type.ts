export interface ButtonProps {
  children: React.ReactNode
  disabled?: boolean
  $variant:
    | "red"
    | "outlined"
    | "arrow"
    | "grey"
    | "pink"
    | "default"
    | "success"
    | "failed"
    | "copy"
    | "spinner"
    | "disable"
  type?: "button" | "submit" | "reset"
  $marginTop?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

export interface StyledButtonProps {
  $variant:
    | "red"
    | "outlined"
    | "arrow"
    | "grey"
    | "pink"
    | "default"
    | "success"
    | "failed"
    | "copy"
    | "spinner"
    | "disable"
  $marginTop?: string
  disabled?: boolean
}
