import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useRouter } from "@/hooks/useRouting"
import { useSuspenseQuery } from "@tanstack/react-query"
import { getReviewList } from "@/services/review"
import { useSetRecoilState } from "recoil"
import { reviewListState } from "@/store/mycampaign-recoil"
import ProgressStep from "@/components/ProgressStep"
import FilterCampaign from "@/components/FilterCampaign"
import Button from "@/components/Button"
import { buttonConfig } from "@/types/component-types/my-campaign-type"
import { formatDate } from "@/utils/util"
import dummyImage from "assets/dummy-image.png"
import useScrollToTop from "@/hooks/useScrollToTop"
import { RoutePath } from "@/types/route-path"
import ReuseHeader from "@/components/ReuseHeader"
import { currentCalculateRemainingTime } from "@/utils/util"
import NoCampaign from "./MyCampaignDetail/NoCampaign"
import SeoHelmet from "@/components/SeoHelmet"
import styled from "styled-components"
import { ButtonProps } from "@/types/component-types/button-type"
import { chips, ChipType } from "@/types/component-types/chip-type"

const MyCampaignPage = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [currTimes, setCurrTimes] = useState<
    { reviewId: number; currTime: string | null }[]
  >([]) // 각 리뷰 아이템의 currTime을 저장
  const setReivewList = useSetRecoilState(reviewListState)
  const navigate = useNavigate()
  const router = useRouter()

  //** 스크롤 0부터시작 */
  useScrollToTop()

  //** FilterCampaign option상태 */
  const [selectedChip, setSelectedChip] = useState<ChipType>("전체")
  const handleSelectChip = (chip: ChipType) => {
    setSelectedChip(chip)
  }

  //** step status 매핑 */
  const statusMapping: Record<ChipType, string[]> = {
    전체: [],
    상품구매: ["join"],
    리뷰검수: ["purchase"],
    리뷰등록: ["confirm"],
    지급대기: ["upload"],
    지급완료: ["reward"],
    미션중단: ["giveup", "timeout"],
  }

  //** 스텝타이머 */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000) // 매초 업데이트
    return () => clearInterval(timer) // 컴포넌트 언마운트 시 클리어
  }, [])

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

  const { data, refetch } = useSuspenseQuery({
    queryKey: ["reviewList"],
    queryFn: fetchCampaignList,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: false,
  })

  // ** 현재 신청한캠페인 */
  const reviewList = data?.list
  const reviewJoin = data?.n_review_join

  // ** 나의리뷰리스트 데이터를 Recoil 상태로 업데이트  */
  useEffect(() => {
    if (data?.list) {
      const allReivews = data.list
      setReivewList(allReivews)
    }
  }, [data, setReivewList])

  //** currentTime이나 reviewList가 변경될 때마다 currTimes 업데이트 */
  useEffect(() => {
    if (reviewList) {
      const updatedCurrTimes = reviewList.map((reviewItem) => {
        const currTime = reviewItem.purchase_timeout
          ? currentCalculateRemainingTime(
              reviewItem.purchase_timeout,
              reviewItem.joinAt,
              currentTime
            ).currTime
          : null
        return { reviewId: reviewItem.reviewId, currTime }
      })
      setCurrTimes(updatedCurrTimes)
    }
  }, [currentTime, reviewList])

  //** currTime이 '00시 00분 00초'에 도달하면 refetch 트리거 */
  useEffect(() => {
    const anyTimeZero = currTimes.some(
      (item) => item.currTime === "(-00:00:00)"
    )
    if (anyTimeZero) {
      refetch()
    }
  }, [currTimes, refetch])

  // ** 캠페인상세 이동핸들러 */
  const handleGoBack = () => {
    const redirectPath = sessionStorage.getItem("redirectPath")
    if (redirectPath) {
      navigate(redirectPath)
    } else {
      navigate(-1) // 이전 페이지로 돌아감
    }
  }

  //** selectedChip에 따라 reviewList 필터링 */
  const filteredReviewList = useMemo(() => {
    if (!reviewList) return []

    const statusesToFilter = statusMapping[selectedChip]
    if (statusesToFilter.length === 0) {
      return reviewList // 필터링 없이 모든 항목 표시
    }

    return reviewList.filter((reviewItem) =>
      statusesToFilter.includes(reviewItem.status)
    )
  }, [reviewList, selectedChip])

  // ** NoCampaign 타이틀 및 메시지 결정
  const getNoCampaignProps = () => {
    if (!reviewList || reviewList.length === 0) {
      return {
        title: "아직 참여중인 캠페인이 없어요.",
      }
    } else {
      return {
        title: "선택한 필터에 맞는 캠페인이 없어요.",
      }
    }
  }
  const noCampaignProps = getNoCampaignProps()

  return (
    <>
      <SeoHelmet
        title="리뷰클릭-MyCampaign"
        description="리뷰클릭은 제품과 서비스 전반에 걸친 다양한 사용자 리뷰를 한곳에서 제공합니다. 믿을 수 있는 평가와 상세한 리뷰로 현명한 소비를 지원합니다."
      />
      <ReuseHeader title="나의 캠페인" onBack={handleGoBack} />
      <FilterCampaign
        chips={chips}
        selectedChip={selectedChip}
        onSelect={handleSelectChip}
      />
      {/* 다른 컴포넌트들 */}
      <CartCardDesc>
        <p>
          신청한 캠페인
          <Result>
            {reviewJoin === 0 ||
            reviewJoin === undefined ||
            reviewJoin === null ||
            !reviewJoin
              ? "0"
              : reviewJoin}
          </Result>
          <Total>/{reviewList.length}</Total>
        </p>
      </CartCardDesc>
      {/* hasItems prop 추가 */}
      <MyReviewContainer $hasItems={filteredReviewList.length > 0}>
        {filteredReviewList && filteredReviewList.length > 0 ? (
          filteredReviewList.map((reviewItem) => {
            //** 캠페인 남은 시간 */
            const thumbnailUrl = reviewItem.thumbnailUrl || dummyImage
            const button: { variant: ButtonProps["$variant"]; text: string } =
              reviewItem.uploadComplete === 1 && reviewItem.status === "upload"
                ? { variant: "success", text: "지급완료" }
                : buttonConfig[reviewItem.status] || {
                    variant: "default",
                    text: "상품구매",
                  }

            //** 스텝별 버튼 핸들러 */
            const handleStepRouting = () => {
              if (button.text === "지급완료") {
                router.push(RoutePath.UserPointLog)
              } else if (
                button.text === "미션중단" ||
                button.text === "지급대기"
              ) {
                router.push(RoutePath.MyCampaign)
              } else {
                const detail = RoutePath.MyReviewDetail(
                  `${reviewItem.reviewId}`
                )
                router.push(detail)
              }
            }

            //** 구매전타이머 함수 */
            const currTime = reviewItem.purchase_timeout
              ? currentCalculateRemainingTime(
                  reviewItem.purchase_timeout,
                  reviewItem.joinAt,
                  currentTime
                ).currTime
              : null
            //** 리뷰인증후 타이머 */
            const currDayTime = reviewItem.review_timeout
              ? currentCalculateRemainingTime(
                  reviewItem.review_timeout,
                  reviewItem.purchaseAt,
                  currentTime
                ).currTime
              : null
            return (
              <li key={reviewItem.reviewId}>
                <ReviewCardHeader to={`/campaign/${reviewItem.campaignCode}`}>
                  <ReviewCardThumb>
                    <img src={thumbnailUrl} alt="나의캠페인 썸네일" />
                  </ReviewCardThumb>
                  <ReviewCardInfo>
                    <CardDate>{formatDate(reviewItem.createdAt)}</CardDate>
                    <CardTitle>{reviewItem.title}</CardTitle>
                    <CardPoint>{reviewItem.reward.toLocaleString()}P</CardPoint>
                  </ReviewCardInfo>
                </ReviewCardHeader>
                <ProgressStep
                  status={reviewItem.status}
                  uploadComplete={reviewItem.uploadComplete}
                />
                <Button $variant={button.variant} onClick={handleStepRouting}>
                  {button.text}
                  {button.text === "지급대기" ||
                  (button.text === "지급완료" &&
                    reviewItem.uploadComplete === 1 &&
                    reviewItem.status) ? (
                    ""
                  ) : (
                    <>
                      {currTime && <em>{currTime}</em>}
                      {currDayTime && <em>{currDayTime}</em>}
                    </>
                  )}
                </Button>
              </li>
            )
          })
        ) : (
          <NoCampaign {...noCampaignProps} />
        )}
      </MyReviewContainer>
    </>
  )
}

export default MyCampaignPage

const CartCardDesc = styled.div`
  padding: 1.5rem 2rem;
  font-size: var(--font-h5-size);
  border-radius: 1.2rem;
  background-color: white;
`

const Result = styled.span`
  margin-left: 0.5rem;
  color: var(--Success);
  font-weight: var(--font-bold);
`

const Total = styled.span`
  font-size: var(--caption-small-size);
  font-weight: var(--font-bold);
  margin-left: 0.14rem;
`

const MyReviewContainer = styled.ul<{ $hasItems: boolean }>`
  margin-top: 1.2rem;
  background: ${({ $hasItems }) => ($hasItems ? "white" : "transparent")};
  border-radius: 1.2rem;

  li {
    position: relative;
    padding: 2.7rem 2.9rem 2.4rem;

    em {
      margin-left: 0.4rem;
    }
  }

  li:not(:last-child):after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 0.1rem;
    background: var(--N40);
  }
`

const ReviewCardHeader = styled(Link)`
  position: relative;
  border-radius: 0.8rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.4rem;
`

const ReviewCardThumb = styled.div`
  position: relative;
  width: 8.2rem;
  height: 8.2rem;
  overflow: hidden;
  border: 0.5px solid var(--WWood);
  border-radius: 1rem;
  flex-shrink: 0;

  img {
    aspect-ratio: 1 / 1;
  }
`

const ReviewCardInfo = styled.div`
  padding: 0.4rem 0;
  min-width: 0;
  height: 8.2rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 0.2rem;
`

const CardDate = styled.span`
  font-size: var(--caption-size) !important;
  color: var(--QSilver);
`

const CardTitle = styled.span`
  display: block;
  width: 100%;
  padding-right: 1rem;
  font-size: var(--font-h5-size);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const CardPoint = styled.p`
  flex-grow: 1;
  display: flex;
  align-items: flex-end;
  font-size: var(--font-h2-size);
  font-weight: var(--font-extrabold);
`
