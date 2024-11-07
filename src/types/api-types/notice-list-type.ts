//** NOTICE 리스트 요청 type */
export interface NoticeListRequest {
  pageSize: number
  pageIndex: number
  noticeCategory?: string
}
export interface NoticeListResponse {
  statusCode: number
  errorCode?: number
  error?: string
  list: Array<{
    noticeId: number
    noticeCategory: string
    createdAt: string
    title: string
    orderNo: number
  }>
  itemTotal: number
  pageTotal: number
  pageSize: number
  pageIndex: number
  faqCategory?: string
  order?: string
}

//** NOTICE 상세 내용 요청 type */
export interface NoticeItemRequest {
  noticeId: number
}
export interface NoticeItemResponse {
  statusCode: number
  errorCode?: number
  error?: string
  notice: {
    noticeId: number
    noticeCategory: string
    title: string
    content: string
    createdAt: string
    orderNo: number
    adminUid: number
    updatedAt: string
  }
}
