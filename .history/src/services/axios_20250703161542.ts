import axios, { AxiosInstance } from "axios"

// 환경에 따라 baseURL 분기
const baseURL =
  window.location.hostname === "localhost"
    ? "http://localhost:5173/"
    : "https://tigermulder.github.io/"

//** Axios 인스턴스생성 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
})

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("authToken")
    if (token) {
      const hasTokenInParams = config.params && config.params.token
      const hasTokenInData =
        config.data &&
        ((config.data instanceof FormData && config.data.has("token")) ||
          (typeof config.data === "object" && config.data.token))

      // 요청에 이미 토큰이 있는지 확인
      const hasTokenInRequest = hasTokenInParams || hasTokenInData

      if (!hasTokenInRequest) {
        // GET 요청일 경우 쿼리 파라미터에 추가
        if (config.method === "get") {
          config.params = config.params || {}
          config.params.token = token
        }
        // POST, PUT 등의 요청일 경우 요청 본문에 추가
        else if (config.method === "post" || config.method === "put") {
          if (config.data instanceof FormData) {
            config.data.append("token", token)
          } else {
            config.data = {
              ...config.data,
              token,
            }
          }
        }
      }
    }

    // 데이터가 FormData일 경우 headers 수정
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data"
    } else {
      config.headers["Content-Type"] = "application/json"
    }

    return config
  },
  (error) => Promise.reject(error)
)

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 회원가입/인증 관련 API는 자동 리다이렉트 제외
      const authRelatedPaths = [
        '/join/email/sendcode',
        '/join/email/verifycode', 
        '/join/phone/sendcode',
        '/join/phone/verifycode',
        '/join',
        '/login/check'
      ]
      
      const requestUrl = error.config?.url || ''
      const isAuthRelatedAPI = authRelatedPaths.some(path => requestUrl.includes(path))
      
      if (!isAuthRelatedAPI) {
        // 401 에러 시 토큰 제거
        sessionStorage.removeItem("authToken")
        
        // 현재 경로를 저장해서 로그인 후 다시 돌아올 수 있도록
        const currentPath = window.location.pathname
        sessionStorage.setItem("redirectPath", currentPath)
        
        // 로그인 페이지로 리다이렉트 (window.location 사용)
        window.location.href = "/join"
      }
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
