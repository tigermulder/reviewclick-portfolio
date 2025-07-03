import axiosInstance from "./axios"
import {
  CampaignListRequest,
  CampaignListResponse,
  CampaignItemRequest,
  CampaignItemResponse,
} from "types/api-types/campaign-type"
import mockCampaignList from "./mock-campaign-list"

//** 캠페인 리스트 요청 API */
export const getCampaignList = async (
  data: CampaignListRequest
): Promise<CampaignListResponse> => {
  try {
    const response = await axiosInstance.post<CampaignListResponse>(
      "/campaign/list",
      data
    )
    return response.data
  } catch (e) {
    // 에러 발생 시 mock 데이터 반환
    return mockCampaignList as CampaignListResponse
  }
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
  return response.data
}
