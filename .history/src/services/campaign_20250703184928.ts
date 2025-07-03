import axiosInstance from "./axios"
import axios from "axios"
import {
  CampaignListRequest,
  CampaignListResponse,
  CampaignItemRequest,
  CampaignItemResponse,
} from "types/api-types/campaign-type"
import mockCampaignList from "./mock-campaign-list"

// B2 API 설정 - 환경 변수 우선, 없으면 기본값 사용
const B2_API_BASE_URL = import.meta.env.VITE_SERVER_URL || "https://dev-api.revuclick.io"
const B2_API_KEY = import.meta.env.VITE_B2_API_KEY || "NmSmTuUa2HRFQDiDEfvvWCaZT5Oj7V9H"
const B2_SPACE_CODE = import.meta.env.VITE_B2_SPACE_CODE || "Ska1a8fo"

//** 캠페인 리스트 요청 API (B2 API 사용) */
export const getCampaignList = async (
  data: CampaignListRequest
): Promise<CampaignListResponse> => {
  try {
    // 먼저 B2 API로 시도 (프록시 사용)
    const response = await axios.get(
      `/api/b2/ads/${B2_SPACE_CODE}`,
      {
        params: {
          apikey: B2_API_KEY,
          category: data.category,
          ...data
        }
      }
    )
    return response.data
  } catch (e) {
    console.log("B2 API 실패, 기존 API로 재시도:", e)
    
    try {
      // B2 API 실패 시 기존 API로 시도
      const response = await axiosInstance.post<CampaignListResponse>(
        "/campaign/list",
        data
      )
      return response.data
    } catch (fallbackError) {
      console.log("기존 API도 실패, mock 데이터 반환:", fallbackError)
      // 모든 API 실패 시 mock 데이터 반환
      return mockCampaignList as CampaignListResponse
    }
  }
}

//** 캠페인 상세 정보 요청 API (B2 API 사용) */
export const getCampaignItem = async (
  data: CampaignItemRequest
): Promise<CampaignItemResponse> => {
  try {
    // 먼저 B2 API Check로 시도 (프록시 사용)
    const response = await axios.get(
      `/api/b2/ads/${B2_SPACE_CODE}/${data.campaignCode}/check`,
      {
        params: {
          apikey: B2_API_KEY,
          uid: "user123", // 필요에 따라 실제 uid로 변경
          advId: "744" // 필요에 따라 실제 advId로 변경
        }
      }
    )
    return response.data
  } catch (e) {
    console.log("B2 Check API 실패, 기존 API로 재시도:", e)
    
    // B2 API 실패 시 기존 API로 시도
    const response = await axiosInstance.post<CampaignItemResponse>(
      "/campaign/item",
      data
    )
    return response.data
  }
}
