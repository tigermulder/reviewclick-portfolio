import styled from "styled-components"
import IconStar from "assets/ico-star.svg?url"
import { formatDate } from "@/utils/util"

interface CampaignDetailsProps {
  campaign: any // 캠페인 데이터의 정확한 타입으로 변경하세요.
}

function CampaignDetails({ campaign }: CampaignDetailsProps) {
  return (
    <Container>
      <DetailsList>
        <li>
          <span>신청 마감일</span>
          <DetailInfo>{formatDate(campaign.endAt)}</DetailInfo>
        </li>
        <li>
          <span>미션완료기간</span>
          <DetailInfo>구매 영수증 인증 후 7일 이내 필수</DetailInfo>
        </li>
        <li>
          <span>상품가</span>
          <DetailInfo>{campaign.price.toLocaleString()}원</DetailInfo>
        </li>
        <li>
          <span>적립포인트</span>
          <RewardDetailInfo>
            {campaign.reward.toLocaleString()}P
          </RewardDetailInfo>
        </li>
      </DetailsList>
    </Container>
  )
}

export default CampaignDetails

const Container = styled.div`
  width: 100%;
  background-color: #fff;
  border-radius: 10px;
  height: 80px;
  margin: 30px 0 28px 5px;
  padding: 0 0 0 20px;
`

const DetailsList = styled.ul`
  position: relative;
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  &:before {
    content: "";
    position: absolute;
    top: 50%;
    left: -1.2rem;
    transform: translateY(-50%);
    width: 1px;
    height: 90%;
    border-left: 0.2rem dashed var(--n40-color);
  }

  li {
    position: relative;
    display: flex;
    justify-content: space-between;
    margin-top: 0.4rem;
    font-size: var(--font-bodyL-size);
    line-height: var(--font-bodyL-line-height);
    letter-spacing: var(--font-bodyL-letter-spacing);

    &::before {
      content: "";
      position: absolute;
      top: 50%;
      left: -1.35rem;
      transform: translateY(-50%);
      width: 0.5rem;
      height: 0.5rem;
      background: var(--n80-color);
      border-radius: 50%;
    }
    &:first-child {
      margin-top: 0;
      color: var(--primary-color);
      &::before {
        background: none;
        background-image: url("${IconStar}");
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        width: 1.3rem;
        height: 1.6rem;
        left: -1.6rem;
      }
      span:first-child,
      span:last-child {
        color: inherit;
      }
    }
    &:not(:first-child) {
      span:first-child {
        color: var(--n300-color);
      }
      span:last-child {
        color: var(--n300-color);
      }
    }
    &:last-child {
      span:first-child,
      span:last-child {
        font-weight: var(--font-bodyM-weight);
      }
    }

    span {
      &:first-child {
        display: block;
        width: 100px;
        flex-shrink: 0;
      }
    }
  }
`

const DetailInfo = styled.span`
  color: var(--primary-color);
`

const RewardDetailInfo = styled.span`
  color: var(--purple) !important;
`
