// Vercel 서버리스 함수 - B2 API 프록시
export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // OPTIONS 요청 처리 (CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    const { path, ...queryParams } = req.query

    // B2 API 설정
    const B2_BASE_URL = 'https://dev-api.revuclick.io'
    const API_KEY = 'NmSmTuUa2HRFQDiDEfvvWCaZT5Oj7V9H'
    const SPACE_CODE = 'Ska1a8fo'

    // URL 생성
    let targetUrl
    if (path && Array.isArray(path)) {
      // /api/proxy/b2/ads/check/campaignCode 형태
      const apiPath = path.join('/')
      targetUrl = `${B2_BASE_URL}/${apiPath}`
    } else {
      // 기본 경로
      targetUrl = `${B2_BASE_URL}/b2/ads/${SPACE_CODE}`
    }

    // 쿼리 파라미터 추가
    const urlParams = new URLSearchParams({
      apikey: API_KEY,
      ...queryParams
    })

    const finalUrl = `${targetUrl}`

    // B2 API 호출
    const response = await fetch(finalUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'RevuClick-Proxy/1.0'
      }
    })

    if (!response.ok) {
      throw new Error(`B2 API Error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // 성공 응답 (요청 URL도 같이 내려줌)
    res.status(200).json({
      ...data,                  // 기존 B2 API 응답
      debug_finalUrl: finalUrl  // 실제 요청한 URL 추가
    })

  } catch (error) {
    console.error('프록시 에러:', error)
    res.status(500).json({
      error: 'Proxy Error',
      message: error.message,
      timestamp: new Date().toISOString()
    })
  }
}
