//** FAQ 리스트 요청 type */
export interface FaqListRequest {
  pageSize: number
  pageIndex: number
  faqCategory?: string
}
export interface FaqListResponse {
  statusCode: number
  errorCode?: number
  error?: string
  list: Array<{
    faqId: number
    faqCategory: string
    createdAt: string
    title: string
    content: string
    orderNo: number
    adminUid: number
    updatedAt: string
  }>
  itemTotal: number
  pageTotal: number
  pageSize: number
  pageIndex: number
  faqCategory: string
  order: string
}

//** FAQ 상세 내용 요청 type */
export interface FaqItemRequest {
  token: string
  faqId: number
}
export interface FaqItemResponse {
  statusCode: number
  errorCode?: number
  error?: string
  faq: {
    faqId: number
    faqCategory: string
    createAt: string // ISO format
    title: string
    content: string
  }
}
