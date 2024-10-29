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
  STEP_STATUS_MAP,
} from "@/components/StepTitle"
import StepOne from "./MyCampaignDetail/StepOne"
import StepTwo from "./MyCampaignDetail/StepTwo"
import StepThree from "./MyCampaignDetail/StepThree"

const MyCampaignDetailLayout = () => {
  const { reviewId } = useParams<{ reviewId: string }>()
  const [currentStep, setCurrentStep] = useState<number>(1)

  const LOCAL_STORAGE_KEY = `validatedReviewText_${reviewId}`
  // 초기값을 로컬 스토리지에서 가져오기
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
  const { data, refetch } = useQuery({
    queryKey: ["reviewListItem", reviewId],
    queryFn: () => fetchCampaignListItem(reviewId as string),
    enabled: !!reviewId,
    refetchOnWindowFocus: true, // 창이 포커스될 때 데이터 갱신
    refetchOnMount: true, // 컴포넌트 마운트 시 데이터 갱신
    staleTime: 0, // 데이터가 항상 최신이 아니라고 간주
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
            isEnded={isEnded}
            remainingTime={remainingTime}
            campaignsUrl={campaignUrl}
            goToNextStep={goToNextStep}
            refetchData={refetch}
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
            validatedReviewText={validatedReviewText}
            LOCAL_STORAGE_KEY={LOCAL_STORAGE_KEY}
          />
        )
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
