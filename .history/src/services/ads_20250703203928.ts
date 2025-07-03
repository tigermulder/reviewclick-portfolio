import axiosInstance from "./axios"

// B2 광고 시스템 설정
const B2_API_KEY = "NmSmTuUa2HRFQDiDEfvvWCaZT5Oj7V9H"
const SPACE_CODE = "Ska1a8fo"

//** 광고 클릭 체크 및 랜딩 URL 생성 API */
export interface AdCheckRequest {
  adCode: string
  uid?: string
  advId?: string
}

export interface AdCheckResponse {
  statusCode: number
  message: string
  adStatus: number
  landingUrl: string
}

export const checkAdAndGetLandingUrl = async (
  data: AdCheckRequest
): Promise<AdCheckResponse> => {
  try {
    // 프록시 경유 URL 생성
    const params = new URLSearchParams({
      apikey: B2_API_KEY,
      uid: data.uid ?? "",
      advId: data.advId ?? "",
    })
    const url = `/api/proxy?path=b2/ads/${SPACE_CODE}/${data.adCode}/check&${params.toString()}`
    const response = await fetch(url)
    if (!response.ok) throw new Error("프록시 API 호출 실패")
    return await response.json()
  } catch (error) {
    console.error("Ad check API error:", error)
    throw error
  }
}

//** 광고 리스트 조회 API */
export interface AdListRequest {
  category?: string
}

export interface AdListResponse {
  statusCode: number
  ads: any[]
}

export const getAdList = async (
  data?: AdListRequest
): Promise<AdListResponse> => {
  try {
    const response = await axiosInstance.get<AdListResponse>(
      `/b2/ads/${SPACE_CODE}`,
      {
        params: {
          apikey: B2_API_KEY,
          category: data?.category,
        },
      }
    )
    return response.data
  } catch (error) {
    console.error("Ad list API error:", error)
    throw error
  }
} 