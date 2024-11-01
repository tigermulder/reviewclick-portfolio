import axiosInstance from "./axios"
import {
  EmailCheckRequest,
  EmailCheckResponse,
  SendEmailCodeRequest,
  SendEmailCodeResponse,
  VerifyEmailCodeRequest,
  VerifyEmailCodeResponse,
  JoinRequest,
  JoinResponse,
  FindIdRequest,
  FindIdResponse,
  ResetPassWordRequest,
  ResetPassWordResponse,
} from "types/api-types/signup-type"

//** 이메일 체크 API */
export const checkEmail = async (
  data: EmailCheckRequest
): Promise<EmailCheckResponse> => {
  const response = await axiosInstance.post<EmailCheckResponse>(
    "/join/email/check",
    data
  )
  return response.data
}

//** 이메일 인증 코드 전송 API */
export const sendEmailCode = async (
  data: SendEmailCodeRequest
): Promise<SendEmailCodeResponse> => {
  const response = await axiosInstance.post<SendEmailCodeResponse>(
    "/join/email/sendcode",
    data
  )
  return response.data
}

//** 이메일 인증 코드 확인 API */
export const verifyEmailCode = async (
  data: VerifyEmailCodeRequest
): Promise<VerifyEmailCodeResponse> => {
  const response = await axiosInstance.post<VerifyEmailCodeResponse>(
    "/join/email/verifycode",
    data
  )
  return response.data
}

//** 회원가입 처리 API */
export const joinUser = async (data: JoinRequest): Promise<JoinResponse> => {
  const response = await axiosInstance.post<JoinResponse>("/join", data)
  return response.data
}

//** 아이디 찾기 API */
export const findId = async (data: FindIdRequest): Promise<FindIdResponse> => {
  const response = await axiosInstance.post<FindIdResponse>(
    "/user/find_email",
    data
  )
  return response.data
}

// ** 비밀번호 초기화 이메일요청 API */
export const resetPasswordEmail = async (
  data: ResetPassWordRequest
): Promise<ResetPassWordResponse> => {
  const response = await axiosInstance.post<ResetPassWordResponse>(
    "/user/password/send_reset_email",
    data
  )
  return response.data
}
