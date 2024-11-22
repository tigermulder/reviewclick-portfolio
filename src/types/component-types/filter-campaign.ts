import { ChipType } from "./chip-type"
export interface FilterCampaignBar {
  selectedChip: ChipType
  onSelect: (chip: ChipType) => void
}
