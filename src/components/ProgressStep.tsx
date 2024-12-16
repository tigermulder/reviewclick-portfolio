import styled, { keyframes } from "styled-components"
import {
  statusToStepMap,
  ProgressStepProps,
  StepBoxProps,
} from "@/types/component-types/progress-type"
import StepDone from "assets/ico_step_done.svg?url"
import SuccessIcon from "./SuccessIcon"
import FailedIcon from "./FailedIcon"

const ProgressStep = ({ status, uploadComplete }: ProgressStepProps) => {
  let adjustedStatus = status
  let isMissionFailed = false
  let isReviewFailed = false
  let fourthStepName = "지급완료"

  if (status === "upload") {
    if (uploadComplete === 1) {
      adjustedStatus = "reward"
    } else {
      adjustedStatus = "timeout"
      fourthStepName = "지급대기"
      isMissionFailed = false
    }
  } else if (status === "giveup" || adjustedStatus === "timeout") {
    isMissionFailed = true
    fourthStepName = "미션중단"
  } else if (status === "confirm") {
    isReviewFailed = true
  }

  const steps = [
    {
      name: "상품구매",
      key: "join",
      tooltip: (
        <>
          상품을 구매하고 구매 <br />
          영수증을 인증해주세요!
        </>
      ),
    },
    {
      name: "리뷰검수",
      key: "purchase",
      tooltip: (
        <>
          리뷰 작성하고 AI검수를 통해 <br />
          긍정적인 리뷰인지 확인받으세요!
        </>
      ),
    },
    {
      name: "리뷰등록",
      key: "confirm",
      tooltip: (
        <>
          상품 사이트에 등록한 리뷰 <br />
          캡쳐본을 업로드하면 미션 완료!
        </>
      ),
    },
    { name: fourthStepName, key: "reward" },
  ]

  const currentStep = statusToStepMap[adjustedStatus] || 1

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
          const showTooltip = index + 1 === currentStep
          return (
            <StepBox key={step.key} $status={stepStatus}>
              {stepStatus === "done" ? (
                <IcoDone />
              ) : stepStatus === "active" ? (
                isFourthStep ? (
                  isMissionFailed ? (
                    <FailedIcon
                      backgroundColor="var(--RevBlack)"
                      filter={false}
                    />
                  ) : (
                    <SuccessIcon
                      backgroundColor="var(--L500)"
                      filter={true}
                      filterColor="rgba(245, 46, 54, 0.3)"
                    />
                  )
                ) : (
                  <IcoActive>
                    <div></div>
                    <div></div>
                  </IcoActive>
                )
              ) : (
                <IcoDefault />
              )}
              <ProgressName>{step.name}</ProgressName>
              {showTooltip && step.tooltip && (
                <Tooltip>
                  <TooltipText>{step.tooltip}</TooltipText>
                </Tooltip>
              )}
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
    left: 50%;
    width: 100%;
    height: 0.15rem;
    background: ${({ $status }) =>
      $status === "done"
        ? "linear-gradient(to right, var(--L500) 5%, transparent 5% 10%, var(--L500) 10% 15%, transparent 15% 20%, var(--L500) 20% 25%, transparent 25% 30%, var(--L500) 30% 35%, transparent 35% 40%, var(--L500) 40% 45%, transparent 45% 50%, var(--L500) 50% 55%, transparent 55% 60%, var(--L500) 60% 65%, transparent 65% 70%, var(--L500) 70% 75%, transparent 75% 80%, var(--L500) 80% 85%, transparent 85% 90%, var(--L500) 90% 95%, transparent 95% 100%)"
        : "var(--N40)"};
    z-index: -1;
  }

  &:last-child::after {
    content: none;
  }
`

const IcoDefault = styled.div`
  width: 0.8rem;
  height: 0.8rem;
  background: var(--LSilver);
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
    border: 1px solid var(--L500);
  }

  & > div:nth-child(2) {
    width: 0.7rem;
    height: 0.7rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--L500);
    border-radius: 50%;
  }
`

const IcoDone = styled.div`
  width: 1.2rem;
  height: 1.2rem;
  background: url("${StepDone}") white no-repeat center / 100%;
`

const ProgressName = styled.span`
  position: absolute;
  bottom: 0.7rem;
  font-size: var(--caption-small-size);
  color: var(--N400);
`

const tooltipAnimation = keyframes`
  from {
      transform: translate(0, 25%);
  }
  to {
      transform: translate(0, 15%);
  }
`

const Tooltip = styled.div`
  position: absolute;
  bottom: 6.45rem;

  background: rgba(33, 37, 41, 0.92);
  padding: 0.9rem 1rem;
  width: max-content;
  border-radius: 0.8rem;
  font-size: var(--caption-small-size);
  white-space: normal;
  animation: ${tooltipAnimation} 0.65s ease-in-out infinite alternate;
  z-index: 10;

  &::before {
    content: "";
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: -0.7rem;
    border-left: 0.7rem solid transparent;
    border-right: 0.7rem solid transparent;
    border-top: 0.8rem solid rgba(33, 37, 41, 0.92);
  }
`

const TooltipText = styled.p`
  font-size: var(--caption-small-size);
  font-weight: var(--font-bold);
  color: white;
  word-break: keep-all;
`

const Icon = styled.img`
  display: inline-block;
  vertical-align: -0.15rem;
  width: 1rem;
  height: 1rem;
  margin-left: 0.2rem;
`
