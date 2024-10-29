//** 로그인체크 type */
export interface LoginCheckResponse {
  statusCode: number
  logined: number
  // 1: 로그인 중, 0: 로그인하지 않음
}

//** 로그인처리 type */
export interface LoginRequest {
  email: string
  password: string
  partner_uid?: string // optional
  hmac?: string // optional
  space_code?: string // optional
}
export interface LoginResponse {
  statusCode: number
  nickname: string
  email: string
  token: string
  spaceName: string
  fromPartner: boolean
  errorCode?: number // optional
  error?: string // optional
}
