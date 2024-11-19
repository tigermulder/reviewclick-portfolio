import EmptyIcon from "assets/prd-empty.png"
import EmptyList from "assets/prd-empty-list.png"
import styled from "styled-components"

const NoCampaign = () => {
  return (
    <NoCampaignContainer>
      <NoCampaignIcon>
        <img src={EmptyIcon} alt="참여중인 캠페인없음" />
      </NoCampaignIcon>

      <NoCampaignTitle>아직 참여중인 캠페인이 없어요.</NoCampaignTitle>
      <p>
        캠페인을 신청하고 미션을 시작해보세요! <br /> 여기서 모든 캠페인 진행
        상황을 확인할 수 있어요.
      </p>
      <h3>캠페인 참여 방법</h3>
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

  h3 {
    width: 100%;
    padding: 0 2rem;
    margin: 12rem 0 2rem;
    font-size: var(--font-h5-size);
    font-weight: var(--font-h5-weight);
    letter-spacing: var(--font-h5-letter-spacing);
    color: var(--n500-color);
    text-align: left;
  }
  p {
    margin-top: 1.2rem;
    font-size: var(--font-bodyL-size);
    font-weight: var(--font-bodyL-weight);
    letter-spacing: var(--font-bodyL-letter-spacing);
    color: var(--n300-color);
  }
`

const NoCampaignTitle = styled.h2`
  margin-top: 0.8rem;
  font-size: var(--font-h3-size);
  font-weight: var(--font-h3-weight);
  letter-spacing: var(--font-h3-letter-spacing);
  color: var(--n500-color);
`

const NoCampaignIcon = styled.div`
  width: 54%;
`

const NoCampaignList = styled.div`
  width: 80%;
`
