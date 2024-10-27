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
  $marginTop?: string
  disabled?: boolean
}
