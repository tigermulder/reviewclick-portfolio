import { ReactNode } from "react"

//** 캠페인리스트 요청 type */
export interface CampaignListRequest {
  pageSize?: number // optional
  pageIndex?: number // optional
  order?: string // optional, e.g., recent, joinDesc
  category?: string // optional
  keyword?: string // optional
  startAt?: string // optional, yyyyMMdd
  endAt?: string // optional, yyyyMMdd
}
export interface CampaignListResponse {
  statusCode: number
  list: Campaign[]
  totalItems: number
  totalPages: number
  pageSize: number
  pageIndex: number
}
// 캠페인 개체의 타입
export interface Campaign {
  campaignId: number
  reviewId: number
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
  status: string
  quota: number
  joins: number
  uploads: number
  favorites: number
  createdAt: string
  is_join: number
  is_favorite: number
}

//** 캠페인 상세 정보 요청 */
export interface CampaignItemRequest {
  campaignCode: string
}
export interface CampaignItemResponse {
  thumbnailUrl: string
  description: string
  title: string
  statusCode: number
  campaign: Campaign
  reviews: any[]
  review_status: string | null
  is_join_enable: number
  is_join_cancellable: number
  is_campaign_open: number
}

export interface Review {
  // 리뷰 객체가 어떻게 구성되어 있는지 모르기 때문에 임시로 빈 객체로 정의
  [key: string]: any
}
