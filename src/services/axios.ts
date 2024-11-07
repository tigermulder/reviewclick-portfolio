import axios, { AxiosInstance } from "axios"

//** 개발환경용 */
const baseURL = import.meta.env.VITE_BASE_URL
// ** 운영배포용 꼭 baseURL수정해서 올려주세요 */
const API = import.meta.env.VITE_SERVER_URL

//** Axios 인스턴스생성 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API,
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

export default axiosInstance
