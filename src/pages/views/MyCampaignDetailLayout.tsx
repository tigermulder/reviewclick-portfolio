import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getReviewItem } from "@/services/review"
import useScrollToTop from "@/hooks/useScrollToTop"
import ReuseHeader from "@/components/ReuseHeader"
import dummyImage from "assets/dummy-image.png"
import { calculateRemainingTime } from "@/utils/util"
import {
  HeaderStatusType,
  HEADER_TITLES,
} from "@/types/component-types/my-campaigndetail-type"
import StepOne from "./MyCampaignDetail/StepOne"
import StepTwo from "./MyCampaignDetail/StepTwo"
import StepThree from "./MyCampaignDetail/StepThree"

const MyCampaignDetailLayout = () => {
  const { reviewId } = useParams<{ reviewId: string }>()
  const [currentStep, setCurrentStep] = useState<number>(1)

  //** 스크롤 0부터시작 */
  useScrollToTop()

  // My리뷰내역Detail fetch
  const fetchCampaignListItem = async (reviewId: string) => {
    const reviewIdKey = {
      reviewId,
    }
    const response = await getReviewItem(reviewIdKey)
    return response
  }
  const { data } = useQuery({
    queryKey: ["reviewListItem", reviewId],
    queryFn: () => fetchCampaignListItem(reviewId as string),
    enabled: !!reviewId,
  })
  const {
    status,
    campaignThumb,
    campaignTitle,
    campaignUrl,
    reward,
    endAt,
    creatAt,
  } = {
    status: data?.review.status as HeaderStatusType,
    campaignThumb: data?.campaign.thumbnailUrl,
    campaignTitle: data?.campaign.title,
    campaignUrl: data?.campaign.purchaseUrl,
    reward: data?.campaign.reward,
    endAt: data?.campaign.endAt,
    creatAt: String(data?.campaign.createdAt),
  }
  // 남은 시간 계산
  const { remainingTime, isEnded } = calculateRemainingTime(endAt)
  const thumbnailUrl = campaignThumb || dummyImage

  //** 상세 스텝 결정 */
  useEffect(() => {
    if (status === "join" || status === "purchase") {
      setCurrentStep(1)
    } else if (status === "confirm") {
      setCurrentStep(2)
    } else if (status === "upload") {
      setCurrentStep(3)
    }
  }, [status])
  // ReuseHeader 제목
  const headerTitle: string =
    (status && HEADER_TITLES[status]) || "마이캠페인상세"
  const renderStepContent = (): JSX.Element | null => {
    switch (currentStep) {
      case 1:
        return (
          <StepOne
            reviewIdKey={reviewId}
            thumbnailUrl={thumbnailUrl}
            campaignTitle={campaignTitle}
            reward={reward}
            isEnded={isEnded}
            remainingTime={remainingTime}
            campaignsUrl={campaignUrl}
          />
        )
      case 2:
        return (
          <StepTwo
            reviewIdKey={reviewId}
            thumbnailUrl={thumbnailUrl}
            campaignTitle={campaignTitle}
            reward={reward}
            isEnded={isEnded}
            remainingTime={remainingTime}
            creatTime={creatAt}
          />
        )
      case 3:
        return <StepThree reviewIdKey={reviewId} campaignsUrl={campaignUrl} />
      default:
        return null
    }
  }
  return (
    <>
      <ReuseHeader title={headerTitle} />
      {/* 스텝마다 다른페이지 */}
      {renderStepContent()}
    </>
  )
}

export default MyCampaignDetailLayout
