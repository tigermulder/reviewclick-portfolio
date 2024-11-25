//** 로그인처리 type */
export interface LoginRequest {
  email: string
  password: string
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

//** 로그인처리 type */
export interface LoginCheckResponseData {
  statusCode: number
  logined: number
  partner_uid: string
  partnerId: number
  spaceId: number
  spaceName: string
  token: string
  uid: number
  email: string
  penalty: string
}
