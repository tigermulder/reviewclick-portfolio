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
    // 프록시를 통해 호출 (/api로 시작하면 vite가 자동으로 프록시)
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

//** B2 API 테스트 함수 */
export const testB2API = async () => {
  console.log('B2 API 테스트 시작...')
  
  try {
    const result = await getCampaignListFromB2({ category: '1' })
    console.log('B2 API 성공:', result)
    return result
  } catch (error) {
    console.error('B2 API 실패:', error)
    return null
  }
}

//** 캠페인 리스트 요청 API - B2 API 우선 사용 */
export const getCampaignList = async (
  data: CampaignListRequest
): Promise<CampaignListResponse> => {
  // 1순위: B2 API 시도
  try {
    console.log('B2 API로 캠페인 리스트 요청...')
    const b2Result = await getCampaignListFromB2(data)
    console.log('B2 API 성공!')
    return b2Result
  } catch (b2Error) {
    console.warn('B2 API 실패, 기존 API로 시도:', b2Error)
  }

  // 2순위: 기존 API 시도
  try {
    const response = await axiosInstance.post<CampaignListResponse>(
      "/campaign/list",
      data
    )
    return response.data
  } catch (originalError) {
    console.warn('기존 API도 실패, mock 데이터 사용:', originalError)
    
    // 3순위: Mock 데이터 반환
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
