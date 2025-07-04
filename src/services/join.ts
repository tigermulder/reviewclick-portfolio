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
  ResetPassWordEmailRequest,
  ResetPassWordEmailResponse,
  ResetPassWordRequest,
  ResetPassWordResponse,
  PhoneVerifyRequest,
  PhoneVerifyResponse,
  PhoneSendCodeRequest,
  PhoneSendCodeResponse,
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
  // return {
  //   statusCode: 0,
  //   errorCode: 0,
  //   error: "",
  // }
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
  // return {
  //   statusCode: 0,
  //   errorCode: 0,
  //   error: "",
  // }
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
  // return {
  //   statusCode: 0,
  //   errorCode: 0,
  //   error: "",
  // }
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
  data: ResetPassWordEmailRequest
): Promise<ResetPassWordEmailResponse> => {
  const response = await axiosInstance.post<ResetPassWordEmailResponse>(
    "/user/password/send_reset_email",
    data
  )
  return response.data
}

//** 비밀번호 초기화 API */
export const resetPassword = async (
  data: ResetPassWordRequest
): Promise<ResetPassWordResponse> => {
  const response = await axiosInstance.post<ResetPassWordResponse>(
    "/user/password/reset",
    data
  )
  return response.data
}

//** 휴대폰 인증 코드전송 */
export const phoneSendCode = async (
  data: PhoneSendCodeRequest
): Promise<PhoneSendCodeResponse> => {
  const response = await axiosInstance.post<PhoneSendCodeResponse>(
    "/join/phone/sendcode",
    data
  )
  return response.data
  // return {
  //   statusCode: 0,
  //   errorCode: 0,
  //   error: "",
  // }
}

//** 휴대폰 인증 코드확인 */
export const phoneVerify = async (
  data: PhoneVerifyRequest
): Promise<PhoneVerifyResponse> => {
  const response = await axiosInstance.post<PhoneVerifyResponse>(
    "/join/phone/verifycode",
    data
  )
  return response.data
  // return {
  //   statusCode: 0,
  //   errorCode: 0,
  //   error: "",
  // }
}
