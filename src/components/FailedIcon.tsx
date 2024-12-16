import { FailedIconType } from "@/types/component-types/failed-icon-type"
import BangIcon from "assets/ico_bang_cutom.svg?react"
import styled from "styled-components"

const FailedIcon = ({
  backgroundColor,
  filter,
  filterColor,
}: FailedIconType) => {
  return (
    <>
      <BangIconContainer
        backgroundColor={backgroundColor}
        filter={filter}
        filterColor={filterColor}
      >
        <BangIcon />
      </BangIconContainer>
    </>
  )
}

export default FailedIcon

const BangIconContainer = styled.div<FailedIconType>`
  width: 1.5rem;
  height: 1.5rem;
  background-color: ${({ backgroundColor }) => backgroundColor};
  filter: ${({ filter, filterColor }) => {
    if (!filter || !filterColor) return "none"
    return `drop-shadow(0 0 0.3rem ${filterColor})`
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  svg {
    color: white;
  }
`
