import { useQuery } from "@tanstack/react-query"
import { keepSessionAlive } from "services/login"
import { HangResponse } from "types/api-types/hang-type"

export const useUserStatus = () => {
  const queryFn = () => {
    const token = sessionStorage.getItem("authToken")
    if (!token) {
      return Promise.reject(new Error("토큰이 없습니다."))
    }
    return keepSessionAlive()
  }

  const { isLoading, isError, error } = useQuery<HangResponse>({
    queryKey: ["userStatus"], // 쿼리 키 설정
    queryFn,
    refetchInterval: 10 * 60 * 1000, // 10분마다 자동 호출
    refetchOnWindowFocus: false, // 창 포커스 시 리패칭 하지 않음
    enabled: !!sessionStorage.getItem("authToken"), // 토큰이 있을 때만 활성화
  })

  // 이 훅은 세션 유지 작업만 처리하며, 로딩 및 에러 상태만 반환
  return {
    isLoading,
    isError,
    error,
  }
}
