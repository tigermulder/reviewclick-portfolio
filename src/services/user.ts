import axiosInstance from "./axios"
import {
  ModifyUserRequest,
  ModifyUserResponse,
  QuitUserRequest,
  QuitUserResponse,
} from "types/api-types/modify-user-type"

//** 내 정보 수정 API */
export const modifyUser = async (
  data: ModifyUserRequest
): Promise<ModifyUserResponse> => {
  const response = await axiosInstance.post<ModifyUserResponse>(
    "/user/modify",
    data
  )
  console.log(response)
  return response.data
}

//** 회원탈퇴 API */
export const quitUser = async (
  data: QuitUserRequest
): Promise<QuitUserResponse> => {
  const response = await axiosInstance.post<QuitUserResponse>(
    "/user/quit",
    data
  )
  return response.data
}
