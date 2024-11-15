import axiosInstance from "./axios"
import {
  CampaignListRequest,
  CampaignListResponse,
  CampaignItemRequest,
  CampaignItemResponse,
} from "types/api-types/campaign-type"

//** 캠페인 리스트 요청 API */
export const getCampaignList = async (
  data: CampaignListRequest
): Promise<CampaignListResponse> => {
  const response = await axiosInstance.post<CampaignListResponse>(
    "/campaign/list",
    data
  )
  console.log(response.data)
  return response.data
}

//** 캠페인 상세 정보 요청 API */
export const getCampaignItem = async (
  data: CampaignItemRequest
): Promise<CampaignItemResponse> => {
  // await new Promise((resolve) => setTimeout(resolve, 3000))
  const response = await axiosInstance.post<CampaignItemResponse>(
    "/campaign/item",
    data
  )
  console.log(response.data)
  return response.data
}
