import ReuseHeader from "@/components/ReuseHeader"
import { useNavigate } from "react-router-dom"
import { RoutePath } from "@/types/route-path"
import dummyImage from "assets/dummy-image.png"
import { getRewardList } from "@/services/reward"
import styled from "styled-components"
import { useQuery } from "@tanstack/react-query"
import { formatDate } from "@/utils/util"

const MyPointPage = () => {
  const navigate = useNavigate()

  // ** 리액트쿼리 나의 포인트내역리스트 */
  const fetchMyRewardList = async ({ queryKey }: { queryKey: string[] }) => {
    const [_key] = queryKey
    const requestData = {
      pageSize: 20,
      pageIndex: 1,
    }
    const response = await getRewardList(requestData)
    return response
  }
  const { data } = useQuery({
    queryKey: ["RewardList"],
    queryFn: fetchMyRewardList,
    refetchOnMount: true,
    staleTime: 0,
  })
  const rewardList = data?.list

  return (
    <MyPointContainer>
      <ReuseHeader
        title="포인트 적립 내역"
        onBack={() => navigate(RoutePath.UserProfile)}
      />
      <MyPointListContainer>
        {rewardList?.map((rewardItem) => {
          const thumbnailUrl = rewardItem.campaignThumbnailUrl || dummyImage
          return (
            <li key={rewardItem.reviewId}>
              <MyPointCard>지급완료</MyPointCard>
              <MyPointWrapper>
                <ReviewCardThumb>
                  <img src={thumbnailUrl} alt="나의캠페인 썸네일" />
                </ReviewCardThumb>
                <ReviewCardInfo>
                  <CardDate>{formatDate(rewardItem.updatedAt)}</CardDate>
                  <CardTitle>{rewardItem.campaignTitle}</CardTitle>
                  <CardPoint>{rewardItem.reward}P</CardPoint>
                </ReviewCardInfo>
              </MyPointWrapper>
            </li>
          )
        })}
      </MyPointListContainer>
    </MyPointContainer>
  )
}

export default MyPointPage

const MyPointContainer = styled.div`
  padding: 6rem 0;
`

const MyPointListContainer = styled.ul`
  li {
    background: var(--white);
    padding: 1.3rem 2.3rem 1.8rem;
    border-radius: 0.8rem;
    overflow: hidden;
  }
`

const MyPointCard = styled.p`
  font-size: var(--font-h5-size);
  font-weight: var(--font-h5-weight);
  line-height: var(--font-h5-line-height);
  letter-spacing: var(--font-h5-letter-spacing);
`

const MyPointWrapper = styled.div`
  margin-top: 1.4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const ReviewCardThumb = styled.div`
  position: relative;
  width: 8.1rem;
  height: 8.1rem;
  overflow: hidden;
  border-radius: 1rem;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
  }
`

const ReviewCardInfo = styled.div`
  margin-left: 1.4rem;
  flex-grow: 1;
  min-width: 0;
`

const CardDate = styled.p`
  font-size: var(--font-caption-size);
  font-weight: var(--font-caption-weight);
  line-height: var(--font-caption-line-height);
  letter-spacing: var(--font-caption-letter-spacing);
  color: var(--quicksilver);
`

const CardTitle = styled.span`
  display: block;
  width: 100%;
  margin-top: 0.4rem;
  padding-right: 1rem;
  font-size: var(--font-bodyM-size);
  font-weight: var(--font-bodyM-weight);
  line-height: var(--font-bodyM-line-height);
  letter-spacing: var(--font-bodyM-letter-spacing);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const CardPoint = styled.p`
  margin-top: 0.2rem;
  font-size: var(--font-h4-size);
  font-weight: var(--font-h4-weight);
  letter-spacing: var(--font-h4-letter-spacing);
`
