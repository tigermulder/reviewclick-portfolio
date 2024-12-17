// 필터 옵션 객체 배열
export type FilterOption = {
  id: number
  label: string
  value: string | number
}
export interface FilterDropDownProps {
  id: string
  options: FilterOption[]
  selectedFilter: FilterOption
  setSelectedFilter: (option: FilterOption) => void
  buttonWidth?: string
  buttonHeight?: string
  containerWidth?: string
  containerHeight?: string
  containerTop?: string
  marginBottom?: string
  openDropdown: string | null // 현재 열려 있는 드롭다운 ID
  setOpenDropdown: (id: string | null) => void // 열려 있는 드롭다운 ID 설정 함수
  placeholder?: string
}
