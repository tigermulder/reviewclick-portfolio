import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useSuspenseQuery } from "@tanstack/react-query"
import { getReviewItem } from "@/services/review"
import useScrollToTop from "@/hooks/useScrollToTop"
import ReuseHeader from "@/components/ReuseHeader"
import SeoHelmet from "@/components/SeoHelmet"
import dummyImage from "assets/dummy-image.png"
import {
  HeaderStatusType,
  HEADER_TITLES,
  STEP_STATUS_MAP,
} from "@/components/StepTitle"
import StepOne from "./MyCampaignDetail/StepOne"
import StepTwo from "./MyCampaignDetail/StepTwo"
import StepThree from "./MyCampaignDetail/StepThree"
import { useNavigate } from "react-router-dom"
import { RoutePath } from "@/types/route-path"

const MyCampaignDetailLayout = () => {
  const { reviewId } = useParams<{ reviewId: string }>()
  const [currentStep, setCurrentStep] = useState<number>(1)
  const navigate = useNavigate()

  const LOCAL_STORAGE_KEY = `validatedReviewText_${reviewId}`
  const [validatedReviewText, setValidatedReviewText] = useState<string>(() => {
    const storedText = localStorage.getItem(LOCAL_STORAGE_KEY)
    return storedText || ""
  })

  useEffect(() => {
    if (validatedReviewText) {
      localStorage.setItem(LOCAL_STORAGE_KEY, validatedReviewText)
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY)
    }
  }, [validatedReviewText, LOCAL_STORAGE_KEY])

  //** 스크롤 0부터시작 */
  useScrollToTop()

  // ** 다음스텝함수 */
  const goToNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1)
  }

  //** My리뷰내역Detail fetch */
  const fetchCampaignListItem = async (reviewId: string) => {
    const reviewIdKey = {
      reviewId,
    }
    const response = await getReviewItem(reviewIdKey)
    return response
  }
  const { data, refetch } = useSuspenseQuery({
    queryKey: ["reviewListItem", reviewId],
    queryFn: () => fetchCampaignListItem(reviewId as string),
    staleTime: 0, // 데이터가 항상 최신이 아니라고 간주
  })

  const {
    status,
    campaignThumb,
    campaignTitle,
    campaignUrl,
    reward,
    createAt,
    reviewText,
  } = {
    status: data?.review.status as HeaderStatusType,
    campaignThumb: data?.campaign.thumbnailUrl,
    campaignTitle: data?.campaign.title,
    campaignUrl: data?.campaign.purchaseUrl,
    reward: data?.campaign.reward,
    createAt: String(data?.campaign.createdAt),
    reviewText: data?.review_detail.reviewText,
  }
  const thumbnailUrl = campaignThumb || dummyImage

  //** 상세 스텝 결정 */
  useEffect(() => {
    if (status === "join") {
      setCurrentStep(1)
    } else if (status === "purchase") {
      setCurrentStep(2)
    } else if (status === "confirm" || status === "upload") {
      setCurrentStep(3)
    }
  }, [status])

  const currentStatus = STEP_STATUS_MAP[currentStep]

  //** ReuseHeader 제목 */
  const headerTitle: React.ReactNode =
    currentStatus && HEADER_TITLES[currentStatus]

  const renderStepContent = (): JSX.Element | null => {
    switch (currentStep) {
      case 1:
        return (
          <StepOne
            reviewIdKey={reviewId}
            thumbnailUrl={thumbnailUrl}
            campaignTitle={campaignTitle}
            reward={reward}
            createTime={createAt}
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
            createTime={createAt}
            goToNextStep={goToNextStep}
            refetchData={refetch}
            setValidatedReviewText={setValidatedReviewText}
          />
        )
      case 3:
        return (
          <StepThree
            reviewIdKey={reviewId}
            goToNextStep={goToNextStep}
            refetchData={refetch}
            validatedReviewText={reviewText}
            LOCAL_STORAGE_KEY={LOCAL_STORAGE_KEY}
          />
        )
      default:
        return null
    }
  }
  return (
    <>
      <SeoHelmet
        title="리뷰클릭-MyCampaign Detail"
        description="리뷰클릭은 제품과 서비스 전반에 걸친 다양한 사용자 리뷰를 한곳에서 제공합니다. 믿을 수 있는 평가와 상세한 리뷰로 현명한 소비를 지원합니다."
      />
      <ReuseHeader
        title={headerTitle}
        onBack={() => navigate(RoutePath.MyCampaign)}
      />
      {/* 스텝마다 다른페이지 */}
      {renderStepContent()}
    </>
  )
}

export default MyCampaignDetailLayout
