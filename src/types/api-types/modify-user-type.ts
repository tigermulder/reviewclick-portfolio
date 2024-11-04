//** 내 정보 수정 (비밀번호 변경) type */
export interface ModifyUserRequest {
  password: string
  phone: string
}
export interface ModifyUserResponse {
  statusCode: number
  errorCode: number
  error: string
}

//** 회원탈퇴 type */
export interface QuitUserRequest {
  reason: string
}
export interface QuitUserResponse {
  statusCode: number
  errorCode?: number
  error?: string
}
