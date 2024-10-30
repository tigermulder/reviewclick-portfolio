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

// 요청 인터셉터: 요청 시 파라미터에 토큰 포함 및 headers 수정
axiosInstance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("authToken")
    if (token) {
      // GET 요청일 경우 쿼리 파라미터에 추가
      if (config.method === "get" && config.params) {
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

    // 데이터가 FormData일 경우 headers 수정
    if (config.data instanceof FormData) {
      // 'Content-Type' 헤더를 삭제하여 브라우저가 자동으로 설정하게 함
      config.headers["Content-Type"] = "multipart/form-data"
    } else {
      // JSON 데이터를 보낼 경우 'Content-Type'을 'application/json'으로 설정
      config.headers["Content-Type"] = "application/json"
    }

    return config
  },
  (error) => Promise.reject(error)
)

export default axiosInstance
