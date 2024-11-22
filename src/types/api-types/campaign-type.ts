//** 캠페인리스트 요청 type */
export interface CampaignListRequest {
  pageSize?: number
  pageIndex?: number
  order?: string
  category?: string
  keyword?: string
  startAt?: string
  endAt?: string
}
export interface CampaignListResponse {
  statusCode: number
  list: Campaign[]
  totalItems: number
  totalPages: number
  pageSize: number
  pageIndex: number
}
export interface Campaign {
  campaignId: number
  campaignCode: string
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
  startAt: string
  endAt: string
  joinEndAt: string
  status: string
  quota: number
  joins: number
  uploads: number
  favorites: number
  createdAt: string
  is_join: number
  is_favorite: number
}
export interface User {
  uid: number
  email: string
  partnerUid: string
  spaceId: number
  spaceName: string
  partnerId: number
}

//** 캠페인 상세 정보 요청 */
export interface CampaignItemRequest {
  campaignCode: string
}
export interface CampaignItemResponse {
  title: string
  statusCode: number
  campaign: Campaign
  reviews: any[]
  review_status: string | null
  is_join_enable: number
  is_join_cancellable: number
  is_campaign_open: number
  reviewId?: number
  user: User
}

export interface Review {
  [key: string]: any
}
