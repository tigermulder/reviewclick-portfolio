// 필터 옵션 객체 배열
export type FilterOption = {
  id: number
  label: string
  value: string
}
export interface FilterDropDownProps {
  options: FilterOption[]
  selectedFilter: FilterOption
  setSelectedFilter: (option: FilterOption) => void
  buttonWidth?: string
  buttonHeight?: string
  containerWidth?: string
  containerHeight?: string
  containerTop?: string
}
