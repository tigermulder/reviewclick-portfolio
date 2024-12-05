export interface CheckboxProps {
  label: string
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  $isTitle?: boolean // 새로운 프롭 추가
}

export interface CheckboxCustomProps {
  checked: boolean
}

export interface CheckboxTextProps {
  $isTitle: boolean
  checked: boolean
}

export type Agreements = {
  all: boolean
  essential1: boolean
  essential2: boolean
  essential3: boolean
  optionalAll: boolean
}
