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
  list: Notification[]
  totalItems: number
  totalPages: number
  pageSize: number
  pageIndex: number
  startAt: boolean
  endAt: boolean
  order?: string
}

export interface Notification {
  notificationId: number
  notificationCategory: string
  uid: number
  createdAt: string
  title: string
  content: string
  tableId: number
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
    content: string
    createdAt: string
    notificationId: number
    notificationCategory: string
    uid: number
    title: string
    cardInfoReview?: {
      type: string
      title: string
      campaignId: number
      campaignCode: string
      reward: number
      reviewId: number
      thumbnailUrl: string
    }
    cardInfoQnaAnswer?: {
      type: string
      title: string
      question: string
      answer: string
      answerAt: string
    }
  }
}
