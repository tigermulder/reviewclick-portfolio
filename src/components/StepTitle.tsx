import IconStepCheck from "assets/ico_step_check.svg?react"
import styled from "styled-components"

const StepContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`

const Step = styled.span`
  padding: 0.2rem 0.8rem;
  width: 2.4rem;
  height: 2.4rem;
  background-color: var(--L20);
  color: var(--L300);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  font-weight: var(--font-light);

  &.active {
    padding: 0 1rem;
    width: auto;
    height: auto;
    border: 0.2rem solid var(--L200);
    border-radius: 5rem;
    font-size: var(--font-body-size);
    font-weight: var(--font-medium);
    background-color: transparent;
  }
`

const Check = styled(IconStepCheck)`
  width: 1.6rem;
  height: 1.6rem;
  margin: 0 0.4rem;
`

export type HeaderStatusType = "join" | "purchase" | "confirm" | "upload"
export const STEP_STATUS_MAP: { [key: number]: HeaderStatusType } = {
  1: "join" || "purchase",
  2: "confirm",
  3: "upload",
}
export const HEADER_TITLES: Record<HeaderStatusType, React.ReactNode> = {
  join: (
    <StepContainer>
      <Step className="active">상품구매</Step>
      <Step>2</Step>
      <Step>3</Step>
    </StepContainer>
  ),
  purchase: (
    <StepContainer>
      <Step className="active">상품구매</Step>
      <Step>2</Step>
      <Step>3</Step>
    </StepContainer>
  ),
  confirm: (
    <StepContainer>
      <Check />
      <Step className="active">리뷰검수</Step>
      <Step>3</Step>
    </StepContainer>
  ),
  upload: (
    <StepContainer>
      <Check />
      <Check />
      <Step className="active">리뷰등록</Step>
    </StepContainer>
  ),
}
