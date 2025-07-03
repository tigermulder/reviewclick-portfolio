import axiosInstance from "./axios"
import {
  CampaignListRequest,
  CampaignListResponse,
  CampaignItemRequest,
  CampaignItemResponse,
} from "types/api-types/campaign-type"
import mockCampaignList from "./mock-campaign-list"

// B2 API 설정
const B2_CONFIG = {
  apiKey: 'NmSmTuUa2HRFQDiDEfvvWCaZT5Oj7V9H',
  spaceCode: 'Ska1a8fo'
}

//** B2 API를 통한 캠페인 리스트 요청 */
export const getCampaignListFromB2 = async (
  data: CampaignListRequest
): Promise<CampaignListResponse> => {
  try {
    const response = await fetch(
      `/api/b2/ads/${B2_CONFIG.spaceCode}?apikey=${B2_CONFIG.apiKey}&category=${data.category || ''}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
    
    if (!response.ok) {
      throw new Error(`B2 API Error: ${response.status}`)
    }
    
    const result = await response.json()
    return result
  } catch (error) {
    console.error('B2 API 호출 실패:', error)
    throw error
  }
}

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
