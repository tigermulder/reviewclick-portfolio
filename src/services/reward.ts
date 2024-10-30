import axiosInstance from "./axios"
import {
  RewardListRequest,
  RewardListResponse,
} from "types/api-types/reward-type"

//** 리워드 리스트 요청 API */
export const getRewardList = async (
  data: RewardListRequest
): Promise<RewardListResponse> => {
  const response = await axiosInstance.post<RewardListResponse>(
    "/reward/list",
    data
  )
  console.log(response)
  return response.data
}
