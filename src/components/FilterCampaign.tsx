import styled from "styled-components"
import { FilterCampaignBar } from "@/types/component-types/filter-campaign"
import { ChipType } from "@/types/component-types/chip-type"

const FilterCampaign = ({
  chips,
  selectedChip,
  onSelect,
}: FilterCampaignBar) => {
  return (
    <FilterChipWrap>
      {chips.map((chip: ChipType) => (
        <Chip
          key={chip}
          selected={chip === selectedChip}
          onClick={() => onSelect(chip)}
          aria-pressed={chip === selectedChip}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onSelect(chip)
            }
          }}
        >
          {chip}
        </Chip>
      ))}
    </FilterChipWrap>
  )
}

export default FilterCampaign

const FilterChipWrap = styled.ul`
  position: fixed;
  width: 100%;
  top: 4.4rem;
  padding: 1.5rem 1.5rem 0.75rem;
  background: var(--white);
  display: flex;
  align-items: center;
  gap: 1rem;
  overflow-x: scroll;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
  z-index: 10;
`

const Chip = styled.li<{ selected: boolean }>`
  padding: 0.6rem 1.2rem;
  font-size: var(--font-bodyM-size);
  font-weight: ${({ selected }) => (selected ? "var(--font-weight-bold)" : "var(--font-bodyM-weight)")}
  line-height: var(--font-bodyM-line-height);
  letter-spacing: var(--font-bodyM-letter-spacing);
  white-space: nowrap;
  color: ${({ selected }) => (selected ? "var(--white)" : "var(--n300-color)")};
  background: ${({ selected }) =>
    selected ? "var(--revu-color)" : "transparent"};
  border: 0.1rem solid var(--whitesmoke);
  border-radius: 99.9rem;

  transition:
    background 0.1s ease-in-out,
    color 0.1s ease-in-out;
  &:hover {
    background: ${({ selected }) =>
      selected ? "var(--revu-color)" : "var(--whitesmoke)"};
  }
`
