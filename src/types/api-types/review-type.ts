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
  n_review_join: number
  n_max_review_join: number
}

export interface ReviewItem {
  reviewId: number
  reward: number
  campaignCode: string
  campaignId: number
  thumbnailUrl: string
  uid: number
  title: string
  partnerId: number
  partnerUid: number
  purchase_timeout: string
  purchaseAt: string
  review_timeout: string
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
  joinAt: string
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
    reviewText: string
    createdAt: string
    updatedAt: string
  }
  review_detail: {
    reviewId: number
    campaignId: number
    reviewText: string | null
    signature: string | null
    positiveIndex: number | null
    joinAt: string
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
  reviewId: number | undefined
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
