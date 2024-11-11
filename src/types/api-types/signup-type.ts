//** 이메일 체크 type */
export interface EmailCheckRequest {
  email: string
}
export interface EmailCheckResponse {
  statusCode: number
  errorCode?: number
  error?: string
}

//** 이메일 인증 코드 전송 type */
export interface SendEmailCodeRequest {
  email: string
}
export interface SendEmailCodeResponse {
  statusCode: number
  errorCode?: number
  error?: string
}

//** 이메일 인증 코드 확인 type */
export interface VerifyEmailCodeRequest {
  code: string
}
export interface VerifyEmailCodeResponse {
  statusCode: number
  errorCode?: number
  error?: string
}

//** 회원가입 처리 type */
export interface JoinRequest {
  email: string
  password: string
  nickname: string
  phone: string
}
export interface JoinResponse {
  statusCode: number
  errorCode?: number
  error?: string
}

// ** User ID 찾기 type */
export interface FindIdRequest {
  nickname: string
  phone: string
}
export interface FindIdResponse {
  email: string
  statusCode: number
  errorCode: number
  error: string
}

// ** User Password 초기화 이메일전송 type */
export interface ResetPassWordEmailRequest {
  email: string
}
export interface ResetPassWordEmailResponse {
  statusCode: number
  errorCode: number
  error: string
}

//** User Password Reset 패스워드 초기화 */
export interface ResetPassWordRequest {
  token: string | null
  password: string
}
export interface ResetPassWordResponse {
  statusCode: number
  errorCode: number
  error: string
}

export interface CustomError extends Error {
  status?: number
  code?: string
  config?: any
  response?: {
    data?: {
      statusCode?: number
      errorCode?: number
    }
    status?: number
    [key: string]: any
  }
}
