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
    // path만 분리, 나머지는 쿼리 파라미터로
    const { path, ...queryParams } = req.query
    const B2_BASE_URL = 'https://dev-api.revuclick.io'
    let apiPath = ''
    if (Array.isArray(path)) {
      apiPath = path.join('/')
    } else if (typeof path === 'string') {
      apiPath = path
    } else {
      return res.status(400).json({ error: 'path 쿼리 파라미터가 필요합니다.' })
    }

    // 실제 B2 API URL 조립
    const targetUrl = `${B2_BASE_URL}/${apiPath}`
    const urlParams = new URLSearchParams(queryParams)
    const finalUrl = `${targetUrl}?${urlParams.toString()}`

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