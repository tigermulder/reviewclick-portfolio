import EmptyIcon from "assets/prd-empty.png"
import EmptyList from "assets/prd-empty-list.png"
import { NoCampaignProps } from "@/types/component-types/no-campaign-type"
import styled from "styled-components"

const NoCampaign = ({ title }: NoCampaignProps) => {
  return (
    <NoCampaignContainer>
      <NoCampaignIcon>
        <img src={EmptyIcon} alt="참여중인 캠페인없음" />
      </NoCampaignIcon>

      <NoCampaignTitle>{title}</NoCampaignTitle>
      <p>
        캠페인을 신청하고 미션을 시작해보세요! <br /> 여기서 모든 캠페인 진행
        상황을 확인할 수 있어요.
      </p>
      <h5>캠페인 참여 방법</h5>
      <NoCampaignList>
        <img src={EmptyList} alt="캠페인 참여방법" />
      </NoCampaignList>
    </NoCampaignContainer>
  )
}

export default NoCampaign

const NoCampaignContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 0 8rem;

  h5 {
    width: 100%;
    padding: 0 1.5rem;
    margin: 12rem 0 2rem;
    color: var(--N500);
    text-align: left;
  }
  p {
    margin-top: 1.2rem;
    color: var(--N300);
    text-align: center;
  }
`

const NoCampaignTitle = styled.h3`
  margin-top: 0.8rem;
  color: var(--N500);
`

const NoCampaignIcon = styled.div`
  width: 40%;
`

const NoCampaignList = styled.div`
  width: 80%;
`
