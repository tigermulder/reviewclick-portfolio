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
          <BackIcon aria-hidden="true" />
        </BackButton>
      )}
      <h3>{title}</h3>
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
  height: 5.2rem;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`

const BackButton = styled.button`
  position: absolute;
  width: 4rem;
  height: 100%;
  left: 0;
  background: none;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
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
    isActive ? "var(--RevBlack)" : "var(--N20)"};
  color: ${({ isActive }) => (isActive ? "white" : "var(--N100)")};
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 0.4rem;
  cursor: pointer;
  font-size: var(--font-body-size);
`
