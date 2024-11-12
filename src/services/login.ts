import axiosInstance from "./axios"
import {
  LoginRequest,
  LoginResponse,
  LoginCheckResponseData,
} from "types/api-types/login-type"
import { LogoutResponse } from "types/api-types/logout-type"
import { HangResponse } from "types/api-types/hang-type"

//** 로그인 처리 API */
export const logincheck = async (): Promise<LoginCheckResponseData> => {
  const response =
    await axiosInstance.get<LoginCheckResponseData>("/login/check")

  console.log(response)
  return response.data
}

//** 로그인 처리 API */
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>("/login", data)

  console.log(response)
  return response.data
}

//** 로그아웃 처리 API */
export const logout = async (): Promise<LogoutResponse> => {
  const token = sessionStorage.getItem("authToken")
  const response = await axiosInstance.get<LogoutResponse>("/logout", {
    params: {
      token: token,
    },
  })
  return response.data
}

// ** 세션 유지용 API */
export const keepSessionAlive = async (): Promise<HangResponse> => {
  const response = await axiosInstance.post<HangResponse>("/hang")
  return response.data
}
