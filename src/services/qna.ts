import axiosInstance from "./axios"
import {
  QnaListRequest,
  QnaListResponse,
  QnaItemRequest,
  QnaItemResponse,
  QnaAddRequest,
  QnaAddResponse,
} from "types/api-types/qna-type"

//** QnA 리스트 요청 API */
export const getQnaList = async (
  data: QnaListRequest
): Promise<QnaListResponse> => {
  const response = await axiosInstance.post<QnaListResponse>("/qna/list", data)
  return response.data
}

//** QnA 상세 내용 요청 API */
export const getQnaItem = async (
  data: QnaItemRequest
): Promise<QnaItemResponse> => {
  const response = await axiosInstance.post<QnaItemResponse>("/qna/item", data)
  return response.data
}

//** QnA 추가 API */
export const addQna = async (data: FormData): Promise<QnaAddResponse> => {
  const response = await axiosInstance.post<QnaAddResponse>("/qna/add", data)
  return response.data
}
