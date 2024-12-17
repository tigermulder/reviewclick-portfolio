import ReuseHeader from "@/components/ReuseHeader"
import { useNavigate } from "react-router-dom"
import dummyImage from "assets/dummy-image.png"
import { getRewardList } from "@/services/reward"
import styled from "styled-components"
import { useSuspenseQuery } from "@tanstack/react-query"
import { formatDate } from "@/utils/util"
import NoRewards from "./NoReward"

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
  const { data } = useSuspenseQuery({
    queryKey: ["RewardList"],
    queryFn: fetchMyRewardList,
    staleTime: 0,
    retry: 0, // 재요청 횟수
  })
  const rewardList = data?.list

  return (
    <>
      <ReuseHeader title="포인트 적립 내역" onBack={() => navigate(-1)} />
      <MyPointListContainer>
        {rewardList && rewardList.length > 0 ? (
          rewardList.map((rewardItem) => {
            const thumbnailUrl = rewardItem.campaignThumbnailUrl || dummyImage
            return (
              <li key={rewardItem.reviewId}>
                <h5>
                  {rewardItem.status === "reward"
                    ? "지급 완료"
                    : rewardItem.uploadComplete === 1
                      ? "지급 완료"
                      : "지급 대기"}
                </h5>
                <MyPointWrapper>
                  <ReviewCardThumb>
                    <img src={thumbnailUrl} alt="나의캠페인 썸네일" />
                  </ReviewCardThumb>
                  <ReviewCardInfo>
                    <CardDate>{formatDate(rewardItem.updatedAt)}</CardDate>
                    <CardTitle>{rewardItem.campaignTitle}</CardTitle>
                    <CardPoint>{rewardItem.reward.toLocaleString()}P</CardPoint>
                  </ReviewCardInfo>
                </MyPointWrapper>
              </li>
            )
          })
        ) : (
          <NoRewards /> // 리워드 리스트가 없을 때
        )}
      </MyPointListContainer>
    </>
  )
}

export default MyPointPage

const MyPointListContainer = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.4rem;

  li {
    background-color: white;
    padding: 1.3rem 2.3rem 1.8rem;
    border-radius: 1.2rem;
    overflow: hidden;
  }
`

const MyPointWrapper = styled.div`
  margin-top: 1.4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.4rem;
`

const ReviewCardThumb = styled.div`
  position: relative;
  width: 8.2rem;
  height: 8.2rem;
  border: 0.5px solid var(--WWood);
  overflow: hidden;
  border-radius: 1rem;
  flex-shrink: 0;

  img {
    aspect-ratio: 1 / 1;
  }
`

const ReviewCardInfo = styled.div`
  flex-grow: 1;
  min-width: 0;
  height: 8.2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`

const CardDate = styled.span`
  font-size: var(--caption-size) !important;
  font-weight: var(--font-light);
  color: var(--QSilver);
`

const CardTitle = styled.span`
  display: block;
  width: 100%;
  padding-right: 1rem;
  font-size: var(--font-body-size);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const CardPoint = styled.p`
  font-size: var(--font-h2-size);
  font-weight: var(--font-extrabold);
`
