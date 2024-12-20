import Keyframes from "styled-components/dist/models/Keyframes"
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
    | "onboarding02"
    | "uploadImage"
  type?: "button" | "submit" | "reset"
  $marginTop?: string
  $fontSize?: string
  $animation?: Keyframes | string
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
    | "onboarding02"
    | "uploadImage"
  $marginTop?: string
  $fontSize?: string
  $animation?: Keyframes | string
  disabled?: boolean
}
