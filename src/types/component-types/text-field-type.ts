export interface TextFieldProps {
  type: string
  name: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  suffix?: string
  $isError?: boolean
  $marginBottom?: string
  $suffixWidth?: string
  $marginTop?: string
  errorMessage?: string
  successMessage?: string
  disabled?: boolean
  maxLength?: number
}
