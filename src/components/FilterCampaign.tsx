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
      <FilterChipBarStyled>
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
      </FilterChipBarStyled>
    </FilterChipWrap>
  )
}

export default FilterCampaign

const FilterChipWrap = styled.div`
  position: fixed;
  width: 100%;
  top: 4.4rem;
  left: 0;
  padding: 1.2rem 1.5rem;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--N60);
  z-index: 10;
`

const FilterChipBarStyled = styled.ul`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  overflow-x: scroll;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`

const Chip = styled.li<{ selected: boolean }>`
  padding: 0.6rem 1.2rem;
  font-size: var(--font-body-size);
  font-weight: ${({ selected }) =>
    selected ? "var(--font-bold)" : "var(--font-medium)"};
  white-space: nowrap;
  color: ${({ selected }) => (selected ? "white" : "var(--N300)")};
  background-color: ${({ selected }) =>
    selected ? "var(--L400)" : "transparent"};
  border: 0.1rem solid var(--WSmoke);
  border-radius: 99.9rem;

  transition:
    background-color 0.1s ease-in-out,
    color 0.1s ease-in-out;
  &:hover {
    background: ${({ selected }) =>
      selected ? "var(--L400)" : "var(--WSmoke)"};
  }
`
