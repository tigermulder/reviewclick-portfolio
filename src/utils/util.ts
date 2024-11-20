import { RemainingTime, currentRemainingTime } from "@/types/type"

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

  const date = new Date(dateString)

  if (isNaN(date.getTime())) {
    console.warn(`유효하지 않은 날짜 문자열: ${dateString}`)
    return ""
  }

  let formattedDate = date.toLocaleDateString("ko-KR", options)

  // 마지막 마침표 제거
  if (formattedDate.endsWith(".")) {
    formattedDate = formattedDate.slice(0, -1)
  }

  return formattedDate
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

// ** 이메일추출 함수 */
export const extractUsername = (email: string | null): string | null => {
  if (email === null) {
    return null
  }
  const atIndex = email.indexOf("@")
  if (atIndex === -1) {
    return email
  }
  return email.substring(0, atIndex)
}

//** 구매 전 타이머 함수 */
export const currentCalculateRemainingTime = (
  purchaseTimeout: string,
  joinAt: string,
  currentTime: Date
): currentRemainingTime => {
  const timeoutDate = new Date(purchaseTimeout)
  const joinDate = new Date(joinAt)

  if (timeoutDate < joinDate) {
    console.warn(
      `purchaseTimeout (${purchaseTimeout})이 joinAt (${joinAt})보다 이전입니다.`
    )
  }
  const diff = timeoutDate.getTime() - currentTime.getTime()

  if (isNaN(diff) || diff <= 0) {
    return { currTime: "" }
  }

  // 밀리초 단위 상수
  const millisecondsInADay = 1000 * 60 * 60 * 24
  const millisecondsInAnHour = 1000 * 60 * 60
  const millisecondsInAMinute = 1000 * 60
  const millisecondsInASecond = 1000

  // 숫자를 두 자리로 포맷팅하는 함수
  const pad = (num: number) => num.toString().padStart(2, "0")

  if (diff >= millisecondsInADay) {
    // 남은 시간이 24시간 이상인 경우
    const days = Math.floor(diff / millisecondsInADay)
    const remainingAfterDays = diff % millisecondsInADay

    const hours = Math.floor(remainingAfterDays / millisecondsInAnHour)
    const minutes = Math.floor(
      (remainingAfterDays % millisecondsInAnHour) / millisecondsInAMinute
    )
    const seconds = Math.floor(
      (remainingAfterDays % millisecondsInAMinute) / millisecondsInASecond
    )

    const currTime = `(-${days}일)`
    // (T-${pad(hours)}:${pad(minutes)}:${pad(seconds)})
    return { currTime }
  } else {
    // 남은 시간이 24시간 미만인 경우
    const hours = Math.floor(diff / millisecondsInAnHour)
    const minutes = Math.floor(
      (diff % millisecondsInAnHour) / millisecondsInAMinute
    )
    const seconds = Math.floor(
      (diff % millisecondsInAMinute) / millisecondsInASecond
    )
    const currTime = `(T-${pad(hours)}:${pad(minutes)}:${pad(seconds)})`
    return { currTime }
  }
}

// ** 괄호 부분 찾기 함수 */
type ParsedTitle = {
  status: string
  mainText: string
}

export function parseTitle(text: string | undefined): ParsedTitle {
  if (!text) {
    return { status: "", mainText: "" }
  }

  const match = text.match(/\[(.*?)\]/)
  const status = match ? match[0] : ""
  const mainText = text.replace(status, "").trim()

  return { status, mainText }
}

//** 시간포맷함수 */
export const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s < 10 ? `0${s}` : s}`
}
