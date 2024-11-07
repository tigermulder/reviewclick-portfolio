//** QnA 리스트 요청 type */
export interface QnaListRequest {
  token: string
  pageSize: number
  pageIndex: number
  startAt?: string // optional
  endAt?: string // optional
  order?: string // optional
}
export interface QnaListResponse {
  statusCode: number
  errorCode?: number
  error?: string
  list: Array<{
    qnaId: number
    createAt: string // ISO format
    answerAt: string // ISO format
    title: string
  }>
  itemTotal: number
  pageTotal: number
  pageSize: number
  pageIndex: number
  startAt: string // date 형식, string으로 처리
  endAt: string // date 형식, string으로 처리
}

//** QnA 상세 내용 요청 type */
export interface QnaItemRequest {
  token: string
  qnaId: number
}
export interface QnaItemResponse {
  statusCode: number
  errorCode?: number
  error?: string
  qna: {
    qnaId: number
    createAt: string // ISO format
    answerAt?: string // ISO format (optional)
    title: string
    question: string
    answer?: string
  }
}

//** QnA add 요청type */
export interface QnaAddRequest {
  qnaCategory: string
  title: string
  question: string
}
export interface QnaAddResponse {
  statusCode: number
  errorCode?: number
  error?: string
}
