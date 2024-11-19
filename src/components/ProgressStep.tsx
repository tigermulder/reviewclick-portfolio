import styled, { css } from "styled-components"
import {
  statusToStepMap,
  ProgressStepProps,
  StepBoxProps,
  IcoCustomProps,
} from "@/types/component-types/progress-type"
import StepDone from "assets/ico_step_done.svg?url"
import StepSuccess from "assets/ico_step_success.svg"
import StepFailed from "assets/ico_step_failed.svg"

const ProgressStep = ({ status }: ProgressStepProps) => {
  const isMissionFailed = status === "giveup" || status === "timeout"
  const isReviewFailed = status === "confirm" || status === "upload"
  const fourthStepName = isMissionFailed ? "미션중단" : "지급완료"
  const threeStepName = isReviewFailed ? "리뷰등록" : "리뷰등록"
  const fourthStepIcon = isMissionFailed ? StepFailed : StepSuccess

  const steps = [
    { name: "상품구매", key: "join" },
    { name: "리뷰검수", key: "purchase" },
    { name: threeStepName, key: "confirm" },
    { name: fourthStepName, key: "reward" }, // 4단계는 조건부
  ]

  const currentStep = statusToStepMap[status] || 1

  return (
    <ProgressContainer>
      <ProgressStepWrapper>
        {steps.map((step, index) => {
          let stepStatus: "done" | "active" | "default" = "default"

          if (isMissionFailed) {
            // 미션중단인 경우, 모든 단계는 default except 마지막 단계
            stepStatus = index === 3 ? "active" : "default"
          } else {
            if (index + 1 < currentStep) {
              stepStatus = "done"
            } else if (index + 1 === currentStep) {
              stepStatus = "active"
            }
          }
          const isFourthStep = index === 3
          return (
            <StepBox key={step.key} $status={stepStatus}>
              <Circle>
                {stepStatus === "done" ? (
                  <IcoDone />
                ) : stepStatus === "active" ? (
                  index === 3 ? (
                    <IcoCustom
                      $icon={fourthStepIcon}
                      $isMissionFailed={isMissionFailed && isFourthStep}
                    />
                  ) : (
                    <IcoActive>
                      <div></div>
                      <div></div>
                    </IcoActive>
                  )
                ) : (
                  <IcoDefault />
                )}
              </Circle>
              <ProgressName>{step.name}</ProgressName>
            </StepBox>
          )
        })}
      </ProgressStepWrapper>
    </ProgressContainer>
  )
}

export default ProgressStep

const ProgressContainer = styled.div`
  position: relative;
  height: 7rem;
  margin: 2rem 0;
`

const ProgressStepWrapper = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const StepBox = styled.div<StepBoxProps>`
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 1.5px;
    background: ${({ $status }) =>
      $status === "done"
        ? "linear-gradient(to right, var(--revu-color) 5%, transparent 5% 10%, var(--revu-color) 10% 15%, transparent 15% 20%, var(--revu-color) 20% 25%, transparent 25% 30%, var(--revu-color) 30% 35%, transparent 35% 40%, var(--revu-color) 40% 45%, transparent 45% 50%, var(--revu-color) 50% 55%, transparent 55% 60%, var(--revu-color) 60% 65%, transparent 65% 70%, var(--revu-color) 70% 75%, transparent 75% 80%, var(--revu-color) 80% 85%, transparent 85% 90%, var(--revu-color) 90% 95%, transparent 95% 100%)"
        : "var(--n40-color)"};
    z-index: -1;
  }

  &:last-child::after {
    content: none;
  }
`

const Circle = styled.div`
  position: relative;
  width: 1.3rem;
  height: 1.3rem;
  display: flex;
  justify-content: center;
  align-items: center;
`

const IcoDefault = styled.div`
  width: 1rem;
  height: 1rem;
  background: var(--lightsilver);
  border-radius: 50%;
`

const IcoActive = styled.div`
  position: relative;
  width: 1.3rem;
  height: 1.3rem;

  & > div:nth-child(1) {
    width: 100%;
    height: 100%;
    position: absolute;
    background: white;
    box-shadow: 0px 0px 10px rgba(245, 70, 78, 0.3);
    border-radius: 50%;
    border: 1px solid var(--revu-color);
  }

  & > div:nth-child(2) {
    width: 0.7rem;
    height: 0.7rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--revu-color);
    border-radius: 50%;
  }
`

const IcoDone = styled.div`
  width: 1.3rem;
  height: 1.3rem;
  background: url("${StepDone}") #fff no-repeat center / 100%;
`

const IcoCustom = styled.div<IcoCustomProps>`
  width: 1.3rem;
  height: 1.3rem;
  background: url("${(props) => props.$icon}") no-repeat center / 100%;

  ${({ $isMissionFailed }) =>
    $isMissionFailed &&
    css`
      box-shadow: 0px 0px 10px rgba(32, 32, 32, 0.25);
    `}
`

const ProgressName = styled.span`
  position: absolute;
  bottom: 0.7rem;
  font-size: 1rem;
  line-height: var(--base-line-height);
  font-weight: var(--font-weight-medium);
  color: var(--n400-color);
`
