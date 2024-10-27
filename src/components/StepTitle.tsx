import styled from 'styled-components';

const StepContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const Step = styled.span`
  padding: 0.2rem 0.8rem;
  width: 2.4rem;
  height: 2.4rem;
  font-size: var(--font-bodyL-size);
  font-weight: var(--font-bodyL-weight);
  letter-spacing: var(--font-bodyL-letter-spacing);
  background: var(--prim-L20);
  color: var(--prim-L300);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;

  &.active {
    padding: 0.2rem 1.4rem;
    width: auto;
    height: auto;
    border: 0.15rem solid var(--prim-L200);
    border-radius: 5rem;
    font-size: var(--font-callout-size);
    font-weight: var(--font-callout-weight);
    letter-spacing: var(--font-callout-letter-spacing);
    background: transparent;
  }
`;

export type HeaderStatusType = "join" | "purchase" | "confirm" | "upload"
export const STEP_STATUS_MAP: { [key: number]: HeaderStatusType } = {
  1: "join" || "purchase",     // 또는 "purchase"
  2: "confirm",
  3: "upload",
  // 필요한 경우 추가 스텝과 상태를 정의
};
export const HEADER_TITLES: Record<HeaderStatusType, React.ReactNode> = {
  join: (
    <StepContainer>
      <Step className="active">상품구매</Step>
      <Step>2</Step>
      <Step>3</Step>
      <Step>4</Step>
    </StepContainer>
  ),
  purchase: (
    <StepContainer>
      <Step className="active">상품구매</Step>
      <Step>2</Step>
      <Step>3</Step>
      <Step>4</Step>
    </StepContainer>
  ),
  confirm: (
    <StepContainer>
      <Step>1</Step>
      <Step className="active">리뷰검수</Step>
      <Step>3</Step>
      <Step>4</Step>
    </StepContainer>
  ),
  upload: (
    <StepContainer>
      <Step>1</Step>
      <Step>2</Step>
      <Step className="active">리뷰등록</Step>
      <Step>4</Step>
    </StepContainer>
  ),
};
