import { ChipType } from "./chip-type"
export interface FilterCampaignBar {
  chips: readonly ChipType[]
  selectedChip: ChipType
  onSelect: (chip: ChipType) => void
}
