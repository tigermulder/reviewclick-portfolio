import { useEffect, useState } from "react"
import { useRouter } from "@/hooks/useRouting"
import { useQuery } from "@tanstack/react-query"
import { getReviewList } from "@/services/review"
import { useSetRecoilState } from "recoil"
import { reviewListState } from "@/store/mycampaign-recoil"
import ProgressStep from "@/components/ProgressStep"
import FilterCalendar from "@/components/FilterCalander"
import Button from "@/components/Button"
import { buttonConfig } from "@/types/component-types/my-campaign-type"
import { formatDate } from "@/utils/util"
import dummyImage from "assets/dummy-image.png"
import useScrollToTop from "@/hooks/useScrollToTop"
import { calculateRemainingTime } from "@/utils/util"
import { RoutePath } from "@/types/route-path"
import SinglePageHeader from "@/components/SinglePageHeader"
import styled from "styled-components"

const MyCampaignPage = () => {
  const [selectedChip, setSelectedChip] = useState("전체")
  const setReivewList = useSetRecoilState(reviewListState)
  const router = useRouter()
  //** 스크롤 0부터시작 */
  useScrollToTop()
  const chips = ["전체"]
  const handleSelectChip = (chip: string) => {
    setSelectedChip(chip)
  }
  const handleFixedButtonClick = () => {
    console.log("Fixed Button Clicked")
    // 추가 동작 구현
  }

  //** 리액트쿼리 나의 리뷰리스트 */
  const fetchCampaignList = async ({ queryKey }: { queryKey: string[] }) => {
    const [_key] = queryKey
    const requestData = {
      pageSize: 20,
      pageIndex: 1,
    }
    const response = await getReviewList(requestData)
    return response
  }
  const { data } = useQuery({
    queryKey: ["reviewList"],
    queryFn: fetchCampaignList,
    refetchOnMount: true,
    staleTime: 0,
  })
  // ** 현재 신청한캠페인 갯수 */
  const reviewLength = data?.totalItems
  const reviewList = data?.list
  // ** 나의리뷰리스트 데이터를 Recoil 상태로 업데이트  */
  useEffect(() => {
    if (data?.list) {
      const allReivews = data.list
      setReivewList(allReivews)
    }
  }, [data, setReivewList])

  return (
    <>
      <SinglePageHeader title="나의 캠페인" />
      <FilterCalendar
        chips={chips}
        selectedChip={selectedChip}
        onSelect={handleSelectChip}
      />
      {/* 다른 컴포넌트들 */}
      <CartCardDesc>
        <p>
          신청한 캠페인
          <Result>{reviewLength}</Result>
          <Total>/{reviewLength}</Total>
        </p>
      </CartCardDesc>
      <MyReviewContainer>
        {reviewList?.map((reviewItem) => {
          // 남은 시간 계산
          const endAt = reviewItem.endAt
          const { remainingTime, isEnded } = calculateRemainingTime(endAt)
          const thumbnailUrl = reviewItem.thumbnailUrl || dummyImage
          const button = buttonConfig[reviewItem.status] || {
            variant: "default",
            text: "상품구매",
          }

          const handleButtonClick = () => {
            if (button.text === "지급완료") {
              router.push(RoutePath.UserPointLog)
            } else if (button.text === "미션중단") {
              router.push(RoutePath.Notification)
            } else {
              const detail = RoutePath.MyReivewDetail(`${reviewItem.reviewId}`)
              router.push(detail)
            }
          }
          return (
            <li key={reviewItem.reviewId}>
              <ReviewCardHeader>
                <ReviewCardThumb>
                  <img src={thumbnailUrl} alt="나의캠페인 썸네일" />
                  {isEnded && <DimmedBackground />}
                  <RemainingDays $isEnded={isEnded}>
                    {isEnded ? "종료" : remainingTime}
                  </RemainingDays>
                  {isEnded && <EndedOverlay />}
                </ReviewCardThumb>
                <ReviewCardInfo>
                  <CardDate>{formatDate(reviewItem.createdAt)}</CardDate>
                  <CardTitle>[리뷰] {reviewItem.title}</CardTitle>
                  <CardPoint>{reviewItem.reward}P</CardPoint>
                </ReviewCardInfo>
              </ReviewCardHeader>
              <Button $variant={button.variant} onClick={handleButtonClick}>
                {button.text}
              </Button>
              <ProgressStep status={reviewItem.status} />
            </li>
          )
        })}
      </MyReviewContainer>
    </>
  )
}

export default MyCampaignPage

const CartCardDesc = styled.div`
  margin-bottom: 1.2rem;
  padding: 1.5rem 2rem;
  font-size: var(--font-h5-size);
  font-weight: var(--font-h5-weight);
  letter-spacing: var(--font-h5-letter-spacing);
  border-radius: 1.2rem;
  background: var(--white);
`

const Result = styled.span`
  margin-left: 0.4rem;
  color: var(--success-color);
`

const Total = styled.span`
  font-size: var(--font-callout-small-size);
  font-weight: var(--font-callout-small-weight);
  letter-spacing: var(--font-callout-small-letter-spacing);
`

const MyReviewContainer = styled.ul`
  margin-top: 1.2rem;
  background: var(--white);
  border-radius: 1.2rem;
  li {
    position: relative;
    padding: 2rem 1.5rem;
  }
  li:not(:last-child):after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 0.1rem;
    background: var(--n40-color);
  }
`

const ReviewCardHeader = styled.div`
  position: relative;
  margin-bottom: 2rem;
  border-radius: 0.8rem;
  overflow: hidden;
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

const DimmedBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
`

interface RemainingDaysProps {
  $isEnded: boolean
}
const RemainingDays = styled.span.attrs<RemainingDaysProps>((props) => ({
  "aria-label": props.$isEnded ? "캠페인이 종료되었습니다" : "캠페인 남은 일수",
  "data-is-ended": props.$isEnded,
}))<RemainingDaysProps>`
  position: absolute;
  bottom: ${({ $isEnded }) => ($isEnded ? "50%" : "0.7rem")};
  left: ${({ $isEnded }) => ($isEnded ? "50%" : "0")};
  transform: ${({ $isEnded }) => ($isEnded ? "translate(-50%, 50%)" : "none")};
  background-color: black;
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 0.2rem;
  font-size: var(--font-caption-size);
  font-weight: var(--font-caption-weight);
  line-height: var(--font-caption-line-height);
  letter-spacing: var(--font-caption-letter-spacing);
  z-index: 2;
`

const EndedOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1;
  pointer-events: none;
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
  font-size: var(--font-h5-size);
  font-weight: var(--font-h5-weight);
  line-height: var(--font-h5-line-height);
  letter-spacing: var(--font-h5-letter-spacing);
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
