import axiosInstance from "./axios"
import {
  NotificationListRequest,
  NotificationListResponse,
  NotificationItemRequest,
  NotificationItemResponse,
} from "types/api-types/notification-type"

//** Notification 리스트 요청 API */
export const getNotificationList = async (
  data: NotificationListRequest
): Promise<NotificationListResponse> => {
  const response = await axiosInstance.post<NotificationListResponse>(
    "/notification/list",
    data
  )
  console.log(response)
  return response.data
}

//** Notification 상세 내용 요청 API */
export const getNotificationItem = async (
  data: NotificationItemRequest
): Promise<NotificationItemResponse> => {
  const response = await axiosInstance.post<NotificationItemResponse>(
    "/notification/item",
    data
  )
  console.log(response)
  return response.data
}
