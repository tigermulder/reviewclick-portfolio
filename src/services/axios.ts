import { RoutePath } from "@/types/route-path"
import axios, { AxiosInstance } from "axios"

//** 개발환경용 */
const baseURL = import.meta.env.VITE_BASE_URL
// ** 운영배포용 꼭 baseURL수정해서 올려주세요 */
const API = import.meta.env.VITE_SERVER_URL

//** Axios 인스턴스생성 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

// 요청 인터셉터: 요청 시 파라미터에 토큰 포함
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken")
    if (token) {
      // GET 요청일 경우 쿼리 파라미터에 추가
      if (config.method === "get" && config.params) {
        config.params.token = token
      }
      // POST, PUT 등의 요청일 경우 요청 본문에 추가
      else if (config.method === "post" || config.method === "put") {
        config.data = {
          ...config.data,
          token,
        }
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)
export default axiosInstance
