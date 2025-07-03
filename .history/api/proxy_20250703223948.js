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
    
    // 맞는거 /b2/ads/Ska1a8fo/auegyPCF/check?apikey=
    // 틀린거 b2/ads/Ska1a8fo/g77X4iJi/check
    
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
    
    const finalUrl = `${targetUrl}?${urlParams.toString()}`
    
    console.log('프록시 요청:', finalUrl)
    
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
    
    // 성공 응답
    res.status(200).json(data)
    
  } catch (error) {
    console.error('프록시 에러:', error)
    res.status(500).json({
      error: 'Proxy Error',
      message: error.message,
      timestamp: new Date().toISOString()
    })
  }
} 