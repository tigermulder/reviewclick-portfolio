import NoRewardsImage from "assets/ico_no_reward.svg?url"
import { useNavigate } from "react-router-dom"
import Button from "@/components/Button"
import { RoutePath } from "@/types/route-path"
import styled from "styled-components"

const NoRewards = () => {
  const navigate = useNavigate()
  return (
    <NoRewardsContainer>
      <img src={NoRewardsImage} alt="리워드 없음" />
      <NoRewardsMessage>적립된 포인트가 아직 없어요.</NoRewardsMessage>
      <NoRewardsSubMessage>
        포인트를 적립하려면 캠페인에 참여해보세요!
      </NoRewardsSubMessage>
      <Button $variant="grey" onClick={() => navigate(RoutePath.MyCampaign)}>
        나의 캠페인 이동
      </Button>
    </NoRewardsContainer>
  )
}

export default NoRewards

const NoRewardsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10rem 0;
  text-align: center;
`

const NoRewardsMessage = styled.h5`
  margin-top: 2rem;
  color: var(--N400);
`

const NoRewardsSubMessage = styled.p`
  margin: 1rem 0 6.4rem;
  color: var(--N200);
`
