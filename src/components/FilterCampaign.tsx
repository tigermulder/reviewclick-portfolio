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
  padding: 0.75rem 1.5rem;
  background: var(--white);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--n60-color);
  z-index: 10;
`

const FilterChipBarStyled = styled.ul`
  background: var(--white);
  display: flex;
  align-items: center;
  gap: 1rem;
  overflow-x: scroll;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`

const Chip = styled.li<{ selected: boolean }>`
  padding: 0.55rem 1.1rem;
  font-size: 1.3rem;
  font-weight: var(--font-bodyM-weight);
  line-height: var(--font-bodyM-line-height);
  letter-spacing: var(--font-bodyM-letter-spacing);
  white-space: nowrap;
  color: ${({ selected }) => (selected ? "var(--white)" : "var(--n300-color)")};
  background: ${({ selected }) =>
    selected ? "var(--revu-color)" : "transparent"};
  border: 0.1rem solid var(--whitesmoke);
  border-radius: 99.9rem;
  cursor: pointer;
  transition:
    background 0.1s,
    color 0.1s;
  &:hover {
    background: ${({ selected }) =>
      selected ? "var(--revu-color)" : "var(--whitesmoke)"};
  }
`
