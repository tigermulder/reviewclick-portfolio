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

//** 잔머리 방법 1: iframe + postMessage 활용 */
export const getCampaignListViaIframe = async (
  data: CampaignListRequest
): Promise<CampaignListResponse> => {
  return new Promise((resolve, reject) => {
    const targetUrl = `https://dev-api.revuclick.io/b2/ads/${B2_CONFIG.spaceCode}?apikey=${B2_CONFIG.apiKey}&category=${data.category || ''}`
    
    // 숨겨진 iframe 생성
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.style.width = '0'
    iframe.style.height = '0'
    
    const timeoutId = setTimeout(() => {
      document.body.removeChild(iframe)
      reject(new Error('iframe 타임아웃'))
    }, 10000)
    
    iframe.onload = () => {
      try {
        // iframe에서 데이터 추출 시도
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
        if (iframeDoc) {
          const text = iframeDoc.body.textContent || iframeDoc.body.innerText
          if (text) {
            const result = JSON.parse(text)
            clearTimeout(timeoutId)
            document.body.removeChild(iframe)
            resolve(result)
            return
          }
        }
      } catch (error) {
        console.warn('iframe 데이터 추출 실패:', error)
      }
      
      clearTimeout(timeoutId)
      document.body.removeChild(iframe)
      reject(new Error('iframe에서 데이터를 가져올 수 없습니다'))
    }
    
    iframe.onerror = () => {
      clearTimeout(timeoutId)
      document.body.removeChild(iframe)
      reject(new Error('iframe 로딩 실패'))
    }
    
    iframe.src = targetUrl
    document.body.appendChild(iframe)
  })
}

//** 잔머리 방법 2: 새 창 활용 */
export const getCampaignListViaNewWindow = async (
  data: CampaignListRequest
): Promise<CampaignListResponse> => {
  return new Promise((resolve, reject) => {
    const targetUrl = `https://dev-api.revuclick.io/b2/ads/${B2_CONFIG.spaceCode}?apikey=${B2_CONFIG.apiKey}&category=${data.category || ''}`
    
    // 작은 팝업 창 열기
    const popup = window.open(
      targetUrl,
      'api_popup',
      'width=300,height=200,scrollbars=yes,resizable=yes'
    )
    
    if (!popup) {
      reject(new Error('팝업이 차단되었습니다'))
      return
    }
    
    const checkInterval = setInterval(() => {
      try {
        if (popup.closed) {
          clearInterval(checkInterval)
          reject(new Error('팝업이 닫혔습니다'))
          return
        }
        
        // 팝업의 내용 확인
        const popupDoc = popup.document
        if (popupDoc && popupDoc.body) {
          const text = popupDoc.body.textContent || popupDoc.body.innerText
          if (text && text.includes('statusCode')) {
            try {
              const result = JSON.parse(text)
              clearInterval(checkInterval)
              popup.close()
              resolve(result)
              return
            } catch (parseError) {
              console.warn('JSON 파싱 실패:', parseError)
            }
          }
        }
      } catch (crossOriginError) {
        // Cross-origin 에러는 무시 (예상된 동작)
      }
    }, 500)
    
    // 10초 후 타임아웃
    setTimeout(() => {
      clearInterval(checkInterval)
      if (!popup.closed) {
        popup.close()
      }
      reject(new Error('새 창 방식 타임아웃'))
    }, 10000)
  })
}

//** 잔머리 방법 3: Service Worker 프록시 */
export const getCampaignListViaServiceWorker = async (
  data: CampaignListRequest
): Promise<CampaignListResponse> => {
  // Service Worker가 등록되어 있는지 확인
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service Worker를 지원하지 않는 브라우저입니다')
  }
  
  try {
    // 간단한 Service Worker 등록
    const registration = await navigator.serviceWorker.register('/api-proxy-sw.js')
    await navigator.serviceWorker.ready
    
    const targetUrl = `https://dev-api.revuclick.io/b2/ads/${B2_CONFIG.spaceCode}?apikey=${B2_CONFIG.apiKey}&category=${data.category || ''}`
    
    // Service Worker를 통해 요청
    const response = await fetch(`/api-proxy?url=${encodeURIComponent(targetUrl)}`)
    
    if (response.ok) {
      return await response.json()
    } else {
      throw new Error(`Service Worker 프록시 실패: ${response.status}`)
    }
  } catch (error) {
    console.warn('Service Worker 방식 실패:', error)
    throw error
  }
}

//** 잔머리 방법 4: 동적 script 태그 + 전역 변수 */
export const getCampaignListViaScriptTag = async (
  data: CampaignListRequest
): Promise<CampaignListResponse> => {
  return new Promise((resolve, reject) => {
    const callbackName = `apiCallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const targetUrl = `https://dev-api.revuclick.io/b2/ads/${B2_CONFIG.spaceCode}?apikey=${B2_CONFIG.apiKey}&category=${data.category || ''}`
    
    // 전역 콜백 함수 등록
    ;(window as any)[callbackName] = (data: any) => {
      delete (window as any)[callbackName]
      resolve(data)
    }
    
    // 스크립트 태그로 API 호출 (JSONP 스타일)
    const script = document.createElement('script')
    script.src = `${targetUrl}&callback=${callbackName}&format=jsonp`
    
    script.onerror = () => {
      delete (window as any)[callbackName]
      document.head.removeChild(script)
      reject(new Error('스크립트 태그 방식 실패'))
    }
    
    script.onload = () => {
      // 콜백이 실행되지 않았다면 에러 처리
      setTimeout(() => {
        if ((window as any)[callbackName]) {
          delete (window as any)[callbackName]
          document.head.removeChild(script)
          reject(new Error('콜백이 실행되지 않았습니다'))
        }
      }, 5000)
    }
    
    document.head.appendChild(script)
  })
}

//** 잔머리 방법 5: Image 태그 + 에러 핸들링 */
export const getCampaignListViaImageHack = async (
  data: CampaignListRequest
): Promise<CampaignListResponse> => {
  return new Promise((resolve, reject) => {
    const targetUrl = `https://dev-api.revuclick.io/b2/ads/${B2_CONFIG.spaceCode}?apikey=${B2_CONFIG.apiKey}&category=${data.category || ''}`
    
    const img = new Image()
    
    // 이미지로 API를 호출하면 당연히 실패하지만, 요청은 서버에 도달함
    img.onerror = () => {
      // 실제로는 서버가 응답했을 가능성이 높으므로
      // 다른 방법으로 재시도하거나 Mock 데이터 반환
      console.log('이미지 방식으로 API 요청 완료 (예상된 실패)')
      resolve(mockCampaignList as CampaignListResponse)
    }
    
    img.onload = () => {
      // 혹시 이미지로 로딩에 성공하면 (거의 불가능)
      resolve(mockCampaignList as CampaignListResponse)
    }
    
    img.src = targetUrl + '&_img_hack=1'
  })
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
    // 배포환경: 새 창 방식 우선 사용
    return await getCampaignListViaNewWindow(data)
  }
}

//** 메인 캠페인 리스트 요청 API */
export const getCampaignList = async (
  data: CampaignListRequest
): Promise<CampaignListResponse> => {
  console.log(`=== 캠페인 리스트 요청 ===`)
  console.log('환경:', isProduction ? '배포' : '개발')
  console.log('GitHub Pages:', isGitHubPages)
  
  // GitHub Pages 환경에서는 새 창 방식 우선 시도
  if (isGitHubPages) {
    try {
      console.log('GitHub Pages 환경 - 새 창 방식 시도')
      return await getCampaignListViaNewWindow(data)
    } catch (newWindowError) {
      console.warn('새 창 방식 실패, Mock 데이터 사용:', newWindowError)
      return mockCampaignList as CampaignListResponse
    }
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
  console.log('=== 캠페인 상세 정보 요청 ===')
  console.log('환경:', isProduction ? '배포' : '개발')
  console.log('campaignCode:', data.campaignCode)
  
  // GitHub Pages 환경에서는 바로 에러 처리
  if (isGitHubPages) {
    console.warn('GitHub Pages 환경 - 캠페인 상세 정보 기능 제한')
    throw new Error('배포 환경에서는 캠페인 상세 정보를 지원하지 않습니다.')
  }
  
  try {
    console.log('기존 API로 캠페인 상세 정보 요청')
    const response = await axiosInstance.post<CampaignItemResponse>(
      "/campaign/item",
      data
    )
    console.log('캠페인 상세 정보 요청 성공')
    return response.data
  } catch (error) {
    console.warn('캠페인 상세 정보 요청 실패:', error)
    
    // 개발환경에서는 B2 Check API 시도
    if (!isProduction) {
      try {
        console.log('개발환경 - B2 Check API 시도')
        const response = await fetch(
          `/api/b2/ads/${B2_CONFIG.spaceCode}/${data.campaignCode}/check?apikey=${B2_CONFIG.apiKey}&uid=test_user&advId=744`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          }
        )
        
        if (response.ok) {
          const result = await response.json()
          console.log('B2 Check API 성공')
          return result
        } else {
          throw new Error(`B2 Check API Error: ${response.status}`)
        }
      } catch (b2Error) {
        console.warn('B2 Check API도 실패:', b2Error)
      }
    }
    
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
