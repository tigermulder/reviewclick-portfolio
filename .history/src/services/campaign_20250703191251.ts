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

//** 개발환경용 B2 API 호출 (Vite 프록시 사용) */
export const getCampaignListFromB2Dev = async (
  data: CampaignListRequest
): Promise<CampaignListResponse> => {
  console.log('개발환경 - B2 API 호출 (Vite 프록시)')
  
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
    throw new Error(`B2 API Error: ${response.status} ${response.statusText}`)
  }
  
  const result = await response.json()
  return result
}

//** 배포환경용 외부 프록시 서비스 호출 */
export const getCampaignListViaProxy = async (
  data: CampaignListRequest
): Promise<CampaignListResponse> => {
  console.log('배포환경 - 외부 프록시 서비스 시도')
  
  // AllOrigins 프록시 서비스 사용 (가장 안정적)
  const targetUrl = `https://dev-api.revuclick.io/b2/ads/${B2_CONFIG.spaceCode}?apikey=${B2_CONFIG.apiKey}&category=${data.category || ''}`
  
  try {
    const response = await fetch(
      `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
    
    if (!response.ok) {
      throw new Error(`프록시 서비스 오류: ${response.status}`)
    }
    
    const proxyData = await response.json()
    
    if (proxyData.contents) {
      const result = JSON.parse(proxyData.contents)
      console.log('외부 프록시 서비스 성공!')
      return result
    } else {
      throw new Error('프록시 응답 데이터가 없습니다')
    }
  } catch (error) {
    console.warn('외부 프록시 서비스 실패:', error)
    throw error
  }
}

//** Serverless Functions를 이용한 API 호출 (Vercel/Netlify) */
export const getCampaignListViaServerless = async (
  data: CampaignListRequest
): Promise<CampaignListResponse> => {
  // 여러 serverless 엔드포인트 시도
  const endpoints = [
    'https://api.jsonbin.io/v3/req',
    'https://httpbin.org/get',
    'https://jsonplaceholder.typicode.com/posts' // 테스트용
  ]
  
  // 실제 구현에서는 개인 serverless 함수 URL을 사용
  const targetUrl = `https://dev-api.revuclick.io/b2/ads/${B2_CONFIG.spaceCode}?apikey=${B2_CONFIG.apiKey}&category=${data.category || ''}`
  
  try {
    // 실제로는 서버리스 함수에서 프록시 처리
    console.log('서버리스 함수 호출 시도...')
    // 이 부분은 실제 서버리스 함수가 배포되어야 작동
    throw new Error('서버리스 함수 미구현')
  } catch (error) {
    console.warn('서버리스 함수 실패:', error)
    throw error
  }
}

//** B2 API 테스트 함수 */
export const testB2API = async () => {
  console.log('=== B2 API 테스트 시작 ===')
  console.log('현재 환경:', {
    hostname: window.location.hostname,
    isProduction,
    isGitHubPages
  })
  
  try {
    const result = await getCampaignListFromB2({ category: '1' })
    console.log('B2 API 테스트 성공:', result)
    return result
  } catch (error) {
    console.error('B2 API 테스트 실패:', error)
    return null
  }
}

//** 환경별 B2 API 호출 */
export const getCampaignListFromB2 = async (
  data: CampaignListRequest
): Promise<CampaignListResponse> => {
  if (!isProduction) {
    // 개발환경: Vite 프록시 사용
    return await getCampaignListFromB2Dev(data)
  } else {
    // 배포환경: 외부 프록시 서비스 사용
    return await getCampaignListViaProxy(data)
  }
}

//** 메인 캠페인 리스트 요청 API */
export const getCampaignList = async (
  data: CampaignListRequest
): Promise<CampaignListResponse> => {
  console.log(`=== 캠페인 리스트 요청 ===`)
  console.log('환경:', isProduction ? '배포' : '개발')
  console.log('GitHub Pages:', isGitHubPages)
  
  // GitHub Pages 환경에서는 Mock 데이터 우선 사용
  if (isGitHubPages) {
    console.log('GitHub Pages 환경 - Mock 데이터 사용')
    return mockCampaignList as CampaignListResponse
  }
  
  // 개발환경에서는 B2 API 우선 시도
  if (!isProduction) {
    try {
      console.log('개발환경 - B2 API 시도')
      return await getCampaignListFromB2(data)
    } catch (b2Error) {
      console.warn('B2 API 실패, 기존 API로 시도:', b2Error)
    }
  }
  
  // 기존 API 시도
  try {
    console.log('기존 API 시도')
    const response = await axiosInstance.post<CampaignListResponse>(
      "/campaign/list",
      data
    )
    console.log('기존 API 성공!')
    return response.data
  } catch (originalError) {
    console.warn('기존 API 실패:', originalError)
    
    // 배포환경에서 기존 API 실패 시 B2 API 시도
    if (isProduction && !isGitHubPages) {
      try {
        console.log('배포환경 - B2 API 최후 시도')
        return await getCampaignListFromB2(data)
      } catch (b2Error) {
        console.warn('B2 API도 실패:', b2Error)
      }
    }
    
    // 최후 수단: Mock 데이터 사용
    console.log('최후 수단 - Mock 데이터 사용')
    return mockCampaignList as CampaignListResponse
  }
}

//** 캠페인 상세 정보 요청 API */
export const getCampaignItem = async (
  data: CampaignItemRequest
): Promise<CampaignItemResponse> => {
  try {
    const response = await axiosInstance.post<CampaignItemResponse>(
      "/campaign/item",
      data
    )
    return response.data
  } catch (error) {
    console.warn('캠페인 상세 정보 요청 실패:', error)
    throw error
  }
}

//** 환경 정보 확인 함수 */
export const checkEnvironment = () => {
  return {
    hostname: window.location.hostname,
    href: window.location.href,
    isProduction,
    isGitHubPages,
    userAgent: navigator.userAgent
  }
}
