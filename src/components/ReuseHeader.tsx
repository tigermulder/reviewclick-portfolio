import { useRouter } from "@/hooks/useRouting"
import { ReuseHeaderProps } from "@/types/component-types/reuse-header-type"
import BackIcon from "assets/ico_back.svg?react"
import styled from "styled-components"

const ReuseHeader = ({
  title,
  onBack,
  steps,
  currentStep,
  onStepChange,
}: ReuseHeaderProps) => {
  const router = useRouter()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.back()
    }
  }

  const handleStepClick = (stepIndex: number) => {
    if (onStepChange) {
      onStepChange(stepIndex)
    }
  }

  return (
    <HeaderContainer>
      {onBack && (
        <BackButton onClick={handleBack}>
          <BackIcon />
        </BackButton>
      )}
      <Title>{title}</Title>
      {/* 스텝이 존재하는 경우 */}
      {steps && steps.length > 0 && (
        <StepsContainer>
          {steps.map((step, index) => (
            <StepButton
              key={index}
              isActive={index + 1 === currentStep}
              onClick={() => handleStepClick(index + 1)}
            >
              {step}
            </StepButton>
          ))}
        </StepsContainer>
      )}
    </HeaderContainer>
  )
}

export default ReuseHeader

const HeaderContainer = styled.header`
  max-width: 768px;
  min-width: 280px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3;
  width: 100%;
  height: 4.4rem;
  background: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`

const BackButton = styled.button`
  position: absolute;
  width: 2rem;
  height: 2rem;
  left: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
`

const Title = styled.h1`
  font-size: var(--font-h3-size);
  font-weight: var(--font-h3-weight);
  line-height: var(--font-h3-line-height);
  letter-spacing: var(--font-h3-letter-spacing);
`

const StepsContainer = styled.div`
  display: flex;
  position: absolute;
  right: 0.4rem;
  gap: 0.5rem;
  align-items: center;
`

const StepButton = styled.button<{ isActive: boolean }>`
  background: ${({ isActive }) =>
    isActive ? "var(--primary-color)" : "var(--n10-color)"};
  color: ${({ isActive }) => (isActive ? "var(--white)" : "var(--n100-color)")};
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 0.4rem;
  cursor: pointer;
  font-size: var(--font-body-size);
  font-weight: var(--font-body-weight);
`
