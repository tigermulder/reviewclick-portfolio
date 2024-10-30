export interface FilterCalendarBar {
  chips: string[]
  selectedChip: string
  onSelect: (chip: string) => void
}
