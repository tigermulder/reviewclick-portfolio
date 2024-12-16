export interface ReviewAuthResponseError {
  statusCode: -1
  errorCode: number
  error: string
}

export const handleAuthError = (response: ReviewAuthResponseError) => {
  switch (response.errorCode) {
    case 1:
      // 로그인 필요
      console.error("로그인이 필요합니다. 로그인 후 다시 시도해주세요.")
      break
    case 2:
      // 상태 오류: review.status가 'join'이 아님
      console.error(
        "인증할 수 없는 상태입니다. 다시 시도하거나 관리자에게 문의해주세요."
      )
      break
    case 3:
      // OCR 인증 실패
      console.error(
        "영수증 인증에 실패했습니다. 다시 시도하거나 관리자에게 문의해주세요."
      )
      break
    case 4:
      // 참여 내역 없음
      console.error("참여 내역이 존재하지 않습니다.")
      break
    case 5:
      // 시스템 오류
      console.error("시스템에 문제가 발생했습니다. 나중에 다시 시도해주세요.")
      break
    case 6:
      // 이미지 파일 오류
      console.error(
        "이미지 파일에 오류가 있습니다. 다른 파일을 시도하거나 관리자에게 문의해주세요."
      )
      break
    default:
      // 알 수 없는 오류
      console.error("알 수 없는 오류가 발생했습니다. 관리자에게 문의해주세요.")
      break
  }
}

// ** 스텝 1번 */
export interface StepOneProps {
  reviewIdKey: string | undefined
  thumbnailUrl: string
  campaignTitle: string | undefined
  reward: number | undefined
  createTime: string
  campaignsUrl: string | undefined
  goToNextStep: () => void
  refetchData: () => void
}
// ** 스텝 2번 */
export interface StepTwoProps {
  reviewIdKey: string | undefined
  thumbnailUrl: string
  campaignTitle: string | undefined
  reward: number | undefined
  createTime: string
  goToNextStep: () => void
  refetchData: () => void
  setValidatedReviewText: (text: string) => void
}
// ** 스텝 3번 */
export interface StepThreeProps {
  reviewIdKey: string | undefined
  validatedReviewText: string | undefined | null
  goToNextStep: () => void
  refetchData: () => void
  LOCAL_STORAGE_KEY: string
}
