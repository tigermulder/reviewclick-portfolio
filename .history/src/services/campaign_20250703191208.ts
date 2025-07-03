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

//** 신뢰할 수 있는 프록시 서비스를 이용한 API 호출 */
export const getCampaignListViaProxy = async (
  data: CampaignListRequest
): Promise<CampaignListResponse> => {
  const proxyConfigs = [
    {
      name: 'AllOrigins',
      url: 'https://api.allorigins.win/get?url=',
      parseResponse: (response: any) => JSON.parse(response.contents)
    },
    {
      name: 'CorsAnywhere',
      url: 'https://cors-anywhere.herokuapp.com/',
      parseResponse: (response: any) => response
    },
    {
      name: 'ThingProxy',
      url: 'https://thingproxy.freeboard.io/fetch/',
      parseResponse: (response: any) => response
    }
  ]
  
  const targetUrl = `https://dev-api.revuclick.io/b2/ads/${B2_CONFIG.spaceCode}?apikey=${B2_CONFIG.apiKey}&category=${data.category || ''}`
  
  for (const config of proxyConfigs) {
    try {
      console.log(`${config.name} 프록시 시도...`)
      const response = await fetch(config.url + encodeURIComponent(targetUrl))
      
      if (response.ok) {
        const rawData = await response.json()
        const result = config.parseResponse(rawData)
        console.log(`${config.name} 프록시 성공!`)
        return result
      }
    } catch (error) {
      console.warn(`${config.name} 프록시 실패:`, error)
      continue
    }
  }
  
  throw new Error('모든 프록시 서비스 실패')
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

//** 개발환경용 B2 API 호출 */
export const getCampaignListFromB2Dev = async (
  data: CampaignListRequest
): Promise<CampaignListResponse> => {
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
}

//** B2 API를 통한 캠페인 리스트 요청 */
export const getCampaignListFromB2 = async (
  data: CampaignListRequest
): Promise<CampaignListResponse> => {
  // 개발 환경에서는 프록시 사용
  if (!isProduction) {
    try {
      console.log('개발 환경 - Vite 프록시 사용')
      return await getCampaignListFromB2Dev(data)
    } catch (error) {
      console.error('개발 환경 B2 API 호출 실패:', error)
      throw error
    }
  }
  
  // 배포 환경에서는 외부 프록시 서비스 시도
  try {
    console.log('배포 환경 - 외부 프록시 서비스 사용')
    return await getCampaignListViaProxy(data)
  } catch (proxyError) {
    console.warn('프록시 서비스 실패:', proxyError)
    
    // 모든 방법 실패 시 Mock 데이터 사용
    console.log('모든 API 호출 실패 - Mock 데이터 사용')
    return mockCampaignList as CampaignListResponse
  }
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

//** 캠페인 리스트 요청 API - 환경별 최적화 */
export const getCampaignList = async (
  data: CampaignListRequest
): Promise<CampaignListResponse> => {
  console.log(`캠페인 리스트 요청 (환경: ${isProduction ? '배포' : '개발'})`)
  
  // 개발 환경에서는 B2 API 우선 시도
  if (!isProduction) {
    try {
      console.log('개발 환경 - B2 API 시도')
      return await getCampaignListFromB2(data)
    } catch (b2Error) {
      console.warn('B2 API 실패, 기존 API로 시도:', b2Error)
    }
  }
  
  // 배포 환경에서는 바로 기존 API 시도 (또는 Mock 데이터)
  if (isGitHubPages) {
    console.log('GitHub Pages 환경 - Mock 데이터 우선 사용')
    return mockCampaignList as CampaignListResponse
  }
  
  // 기존 API 시도
  try {
    console.log('기존 API 시도')
    const response = await axiosInstance.post<CampaignListResponse>(
      "/campaign/list",
      data
    )
    return response.data
  } catch (originalError) {
    console.warn('기존 API 실패:', originalError)
    
    // 배포 환경에서 기존 API 실패 시 B2 API 시도
    if (isProduction) {
      try {
        console.log('배포 환경 - B2 API 최후 시도')
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
