//** 리워드 적립 내역 요청 type */
export interface RewardListRequest {
  pageSize?: number // optional
  pageIndex?: number // optional
}
export interface RewardListResponse {
  statusCode: number
  errorCode?: number
  error?: string
  list: RewardItem[]
  totalItems: number
  totalPages: number
  pageSize: number
  pageIndex: number
}

export interface RewardItem {
  campaignId: number
  campaignTitle: string
  campaignThumbnailUrl: string
  createdAt: string
  partnerId: number
  partnerUid: string
  reviewId: number
  reward: number
  rewardAt: string | null // Date 객체로 변환 가능하다면 Date | null 타입 사용
  spaceId: number
  status: string // 특정 상태값이 고정되어 있다면 union type 사용 가능 ('reward' | 'otherStatus')
  uid: number
  updatedAt: string // Date 객체로 변환 가능하다면 Date 타입 사용
  uploadComplete: number
}
