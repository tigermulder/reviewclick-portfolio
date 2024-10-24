import { RemainingTime } from "@/types/type"

export const categories = [
  { id: 1, name: "전체" }, // '전체'는 특별하게 처리
  { id: 2, name: "패션" },
  { id: 3, name: "뷰티" },
  { id: 4, name: "가구" },
  { id: 5, name: "출산/육아" },
  { id: 6, name: "식품" },
  { id: 7, name: "생활용품" },
  { id: 8, name: "반려동물" },
  { id: 9, name: "디지털" },
  { id: 10, name: "스포츠" },
  { id: 11, name: "여행" },
  { id: 12, name: "문화" },
  { id: 13, name: "기타" },
]

//** 이메일 유효성 검사 함수 */
export const checkEmail = (emailId: string): string | false => {
  const email = `${emailId}@naver.com`
  const regex = /^[a-zA-Z0-9._%+-]+@naver\.com$/
  if (regex.test(email)) {
    return email
  }
  return false
}

//** 비밀번호 유효성 검사 함수 */
export const checkPassword = (password: string): string | false => {
  const regex = /^[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{8,16}$/
  if (regex.test(password)) {
    return password
  }
  return false
}

// ** 날짜 포맷팅 함수 */
export const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }
  return new Date(dateString).toLocaleDateString("ko-KR", options)
}

// ** 회원가입 유효성 검사 함수 */
export const validateEmail = (id: string) => {
  const email = `${id}@naver.com`
  const regex = /^[a-zA-Z0-9._%+-]+@naver\.com$/
  return regex.test(email)
}
export const validateName = (name: string) => {
  const regex = /^[가-힣]{2,}$/
  return regex.test(name)
}
export const validatePassword = (password: string) => {
  const regex = /^[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{8,16}$/
  return regex.test(password)
}
export const validatePhone = (phone: string) => {
  const regex = /^010\d{8}$/
  return regex.test(phone)
}

//** User ID 찾기 함수 */
export const checkName = (name: string): boolean => {
  return name.trim().length > 0
}

//** 적립률 계산 */
export const disCountRate = (reward: number, price: number) => {
  const result = (reward / price) * 100
  return result.toFixed(0)
}

//** 남은일자 계산 */
export const calculateRemainingTime = (
  endAt: string | Date | undefined
): RemainingTime => {
  if (!endAt) {
    return {
      remainingTime: "종료",
      isEnded: true,
    }
  }

  const endTime = new Date(endAt).getTime()
  const now = Date.now()
  const diffInMs = endTime - now
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24)

  let remainingTime: string

  if (diffInDays > 1) {
    remainingTime = `D-${Math.ceil(diffInDays)}일`
  } else if (diffInDays > 0) {
    const diffInHours = diffInMs / (1000 * 60 * 60)
    remainingTime = `T-${Math.ceil(diffInHours)}시간`
  } else {
    remainingTime = "종료"
  }

  const isEnded = remainingTime === "종료"

  return { remainingTime, isEnded }
}
