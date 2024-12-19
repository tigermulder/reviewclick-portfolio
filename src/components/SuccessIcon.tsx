import { SuccessIconType } from "@/types/component-types/success-icon-type"
import CheckIcon from "assets/ico_check_custom.svg?react"
import styled from "styled-components"

const SuccessIcon = ({
  backgroundColor,
  filter,
  filterColor,
}: SuccessIconType) => {
  return (
    <>
      <CheckIconContainer
        backgroundColor={backgroundColor}
        filter={filter}
        filterColor={filterColor}
      >
        <CheckIcon aria-hidden="true" />
      </CheckIconContainer>
    </>
  )
}

export default SuccessIcon

const CheckIconContainer = styled.div<SuccessIconType>`
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
    width: 80%;
    color: white;
  }
`
