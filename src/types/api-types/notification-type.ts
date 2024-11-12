//** Notification 리스트 요청 type */
export interface NotificationListRequest {
  pageSize: number
  pageIndex: number
  notificationCategory?: string // optional
}
export interface NotificationListResponse {
  statusCode: number
  errorCode?: number
  error?: string
  list: Array<{
    notificationId: number
    notificationCategory: string
    uid: number
    createdAt: string
    title: string
    content: string
  }>
  itemTotal: number
  pageTotal: number
  pageSize: number
  pageIndex: number
  notificationCategory?: string
  order?: string
}

//** Notification 상세 내용 요청 type */
export interface NotificationItemRequest {
  notificationId: number
}
export interface NotificationItemResponse {
  statusCode: number
  errorCode?: number
  error?: string
  notification: {
    notificationId: number
    noticeCategory: string
    createAt: string // ISO format
    title: string
    content: string
    cardInfo?: {
      campaignCode: string
      campaignId: number
      reviewId: number
      reward: number
      thumbnailUrl: string
      title: string
    }
  }
}
