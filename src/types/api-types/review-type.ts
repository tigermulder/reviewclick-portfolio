//** 리뷰참여리스트 요청 type */
export interface ReviewListRequest {
  pageSize?: number
  pageIndex?: number
}
export interface ReviewListResponse {
  statusCode: number
  list: ReviewItem[]
  totalItems: number
  totalPages: number
  pageSize: number
  pageIndex: number
}

export interface ReviewItem {
  reviewId: number
  reward: number
  campaignId: number
  thumbnailUrl: string
  uid: number
  title: string
  partnerId: number
  partnerUid: number
  spaceId: number
  status:
    | "join"
    | "purchase"
    | "confirm"
    | "upload"
    | "reward"
    | "giveup"
    | "timeout"
  uploadComplete: number
  createdAt: string
  updatedAt: string
  endAt: string
}

//** 리뷰 참여 내역 요청 type */
export interface ReviewItemRequest {
  reviewId: string
}
export interface ReviewItemResponse {
  statusCode: number
  errorCode?: number
  error?: string
  review: {
    reviewId: number
    status: string
    reviewText: string // 리뷰 내용
    createdAt: string // ISO 형식 날짜
    updatedAt: string // ISO 형식 날짜 (리뷰가 업데이트된 시간)
  }
  review_detail: {
    reviewId: number
    campaignId: number
    reviewText: string | null
    signature: string | null
    positiveIndex: number | null
    joinAt: string // ISO 형식 날짜
    reviewRating: number | null
    purchaseAt: string | null
    confirmAt: string | null
    uploadAt: string | null
    rewardAt: string | null
    giveupAt: string | null
    timeoutAt: string | null
  }
  campaign: {
    campaignId: number
    advertiserId: number
    title: string
    categoryId: number
    NSproductNo: string
    price: number
    reward: number
    cost: number
    snsUrl: string
    costPartner: number
    reviewKeyword: string | null
    thumbnailUrl: string
    startAt: string // ISO 형식 날짜
    endAt: string // ISO 형식 날짜
    status: "edit" | "active" | "completed" // 예시로 상태 추가
    quota: number
    joins: number
    uploads: number
    favorites: number
    createdAt: string // ISO 형식 날짜
    type: string // 예: 'NS'
    purchaseUrl: string
  }
}

//** 리뷰참여 요청 type */
export interface ReviewJoinRequest {
  campaignId: number
}
export interface ReviewJoinResponse {
  statusCode: number
  errorCode?: number
  error?: string
  reviewId: number
  campaignId: number
}

//** 리뷰 참여 취소 요청 type */
export interface ReviewCancelRequest {
  reviewId: number
}
export interface ReviewCancelResponse {
  statusCode: number
  errorCode?: number
  error?: string
}

//** 리뷰 결제 인증 요청 type */
export interface ReviewAuthResponse {
  statusCode: number
  errorCode?: number
  error?: string
  reviewId: number
}

//** 리뷰 저장 요청 type */
export interface ReviewConfirmRequest {
  reviewId: number
  reviewText: string
}
export interface ReviewConfirmResponse {
  statusCode: number
  errorCode?: number
  error?: string
  reviewId: number
}

//** 리뷰 내용 검토 type */
export interface ReviewUploadResponse {
  statusCode: number
  errorCode?: number
  error?: string
  reviewId: number
  reviewText?: string // 변경된 텍스트 알고리즘상 text에 변형을 줄수있음
}
