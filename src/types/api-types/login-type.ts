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
