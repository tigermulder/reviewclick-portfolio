import styled from "styled-components"
import IconStar from "assets/ico-star1.svg?url"
import Button from "@/components/Button"
import { forwardRef } from "react"
import { formatDate } from "@/utils/util"
import { CampaignDetailsProps } from "@/types/component-types/campaign-detail-type"

const CampaignDetails = forwardRef<HTMLButtonElement, CampaignDetailsProps>(
  ({ campaign, handleViewProduct }, ref) => {
    return (
      <Container>
        <InfoBox>
          <div>
            <span>
              상품가 <em>{campaign.price.toLocaleString()}원</em>
            </span>
            <p>{campaign.reward.toLocaleString()}P</p>
          </div>
          <ButtonContainer>
            <Button $variant="arrow" onClick={handleViewProduct} ref={ref}>
              상품 구경하러가기
            </Button>
          </ButtonContainer>
        </InfoBox>
        <Divider />
        <DetailContainer>
          <DetailsList>
            <li>
              <DetailInfoHeading>신청 마감일</DetailInfoHeading>
              <DetailInfo>{formatDate(campaign.joinEndAt)}</DetailInfo>
            </li>
            <li>
              <DetailInfoHeading>미션완료기간</DetailInfoHeading>
              <DetailInfo>구매 영수증 인증 후 7일 이내 필수</DetailInfo>
            </li>
          </DetailsList>
        </DetailContainer>
      </Container>
    )
  }
)

export default CampaignDetails

const Container = styled.div`
  margin: 2.4rem 0 2.8rem;
`

const InfoBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: end;

  & > div {
    flex: 1;
  }
  & > div span {
    font-size: var(--font-body-size);
    color: var(--N200);
    em {
      display: inline-block;
      margin-left: 0.3rem;
      color: var(--N400);
    }
  }
  & div p {
    font-size: 2.6rem;
    letter-spacing: calc(2.6rem * (-0.4 / 100));
    font-weight: var(--font-extrabold);
  }
`

const ButtonContainer = styled.div`
  width: 15rem;
`

const Divider = styled.div`
  margin-top: 1.6rem;
  height: 0.1rem;
  background: var(--N20);
`

const DetailContainer = styled.div`
  position: relative;
  width: 100%;
  background-color: #fff;
  border-radius: 1rem;
  height: 4rem;
  margin: 2rem auto 0;
  padding: 0 0 0 1.6rem;
  &::before {
    content: "";
    position: absolute;
    top: 1.1rem;
    left: 0;
    height: 53%;
    width: 0.2rem;
    border-left: 1.5px dashed var(--N40);
  }
`

const DetailsList = styled.ul`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.4px;

  li {
    position: relative;
    display: flex;
    justify-content: space-between;
    font-size: var(--font-body-size);
    color: var(--N300);

    &::before {
      content: "";
      position: absolute;
      top: 50%;
      left: -1.72rem;
      transform: translateY(-50%);
      width: 0.4rem;
      height: 0.4rem;
      background: var(--N80);
      border-radius: 50%;
    }
    &:nth-child(1)::before {
      content: "";
      position: absolute;
      top: 50%;
      left: -2.1rem;
      transform: translateY(-50%);
      width: 1.1rem;
      height: 1.1rem;
      background: url("${IconStar}") no-repeat center / 100%;
    }
  }
`

const DetailInfoHeading = styled.span`
  display: block;
  width: 9rem;
  color: var(--N200);
  flex-shrink: 0;
`

const DetailInfo = styled.span`
  color: var(--N600);
`
