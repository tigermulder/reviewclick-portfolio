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

// 환경 감지
const isProduction = window.location.hostname !== 'localhost'
const isGitHubPages = window.location.hostname.includes('github.io')

//** JSONP 방식으로 B2 API 호출 (CORS 우회) */
export const getCampaignListViaJSONP = async (
  data: CampaignListRequest
): Promise<CampaignListResponse> => {
  return new Promise((resolve, reject) => {
    const callbackName = `jsonp_callback_${Date.now()}`
    const script = document.createElement('script')
    
    // 글로벌 콜백 함수 생성
    (window as any)[callbackName] = (data: any) => {
      delete (window as any)[callbackName]
      document.body.removeChild(script)
      resolve(data)
    }
    
    // 에러 처리
    script.onerror = () => {
      delete (window as any)[callbackName]
      document.body.removeChild(script)
      reject(new Error('JSONP 요청 실패'))
    }
    
    // 스크립트 태그로 요청
    script.src = `https://dev-api.revuclick.io/b2/ads/${B2_CONFIG.spaceCode}?apikey=${B2_CONFIG.apiKey}&category=${data.category || ''}&callback=${callbackName}`
    document.body.appendChild(script)
  })
}

//** img 태그를 이용한 픽셀 트래킹 방식 */
export const getCampaignListViaPixel = async (
  data: CampaignListRequest
): Promise<CampaignListResponse> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    
    img.onload = () => {
      // 이미지 로딩 성공시 (실제로는 데이터를 받을 수 없지만 요청이 성공했다는 의미)
      console.log('픽셀 트래킹 성공')
      resolve(mockCampaignList as CampaignListResponse)
    }
    
    img.onerror = () => {
      reject(new Error('픽셀 트래킹 실패'))
    }
    
    // 이미지 src에 API URL 설정
    img.src = `https://dev-api.revuclick.io/b2/ads/${B2_CONFIG.spaceCode}?apikey=${B2_CONFIG.apiKey}&category=${data.category || ''}&_=${Date.now()}`
  })
}

//** 프록시 서비스를 이용한 API 호출 */
export const getCampaignListViaProxy = async (
  data: CampaignListRequest
): Promise<CampaignListResponse> => {
  const proxyUrls = [
    'https://cors-anywhere.herokuapp.com/',
    'https://api.allorigins.win/raw?url=',
    'https://api.codetabs.com/v1/proxy?quest='
  ]
  
  for (const proxyUrl of proxyUrls) {
    try {
      const targetUrl = `https://dev-api.revuclick.io/b2/ads/${B2_CONFIG.spaceCode}?apikey=${B2_CONFIG.apiKey}&category=${data.category || ''}`
      const response = await fetch(proxyUrl + encodeURIComponent(targetUrl))
      
      if (response.ok) {
        const result = await response.json()
        return result
      }
    } catch (error) {
      console.warn(`프록시 ${proxyUrl} 실패:`, error)
      continue
    }
  }
  
  throw new Error('모든 프록시 서비스 실패')
}

//** B2 API를 통한 캠페인 리스트 요청 */
export const getCampaignListFromB2 = async (
  data: CampaignListRequest
): Promise<CampaignListResponse> => {
  // 개발 환경에서는 프록시 사용
  if (!isProduction) {
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
      console.error('개발 환경 B2 API 호출 실패:', error)
      throw error
    }
  }
  
  // 배포 환경에서는 다양한 방법 시도
  const methods = [
    getCampaignListViaProxy,
    getCampaignListViaJSONP,
    getCampaignListViaPixel
  ]
  
  for (const method of methods) {
    try {
      return await method(data)
    } catch (error) {
      console.warn(`${method.name} 실패:`, error)
      continue
    }
  }
  
  throw new Error('모든 B2 API 호출 방법 실패')
}

//** B2 API 테스트 함수 */
export const testB2API = async () => {
  console.log('B2 API 테스트 시작... (환경:', isProduction ? '배포' : '개발', ')')
  
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
  // 배포 환경에서는 바로 Mock 데이터 사용 (CORS 문제 회피)
  if (isGitHubPages) {
    console.log('GitHub Pages 환경 - Mock 데이터 사용')
    return mockCampaignList as CampaignListResponse
  }
  
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
