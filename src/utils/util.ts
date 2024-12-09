import { RemainingTime, currentRemainingTime } from "@/types/type"

export const categories = [
  { id: 1, name: "전체" },
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
  const pad = (num: number) => num.toString().padStart(2, "0")
  if (diff > millisecondsInADay) {
    // 남은 시간이 1일 이상인 경우
    const days = Math.ceil(diff / millisecondsInADay)
    const currTime = `(-${days}일)`
    return { currTime }
  } else {
    // 남은 시간이 1일 이하인 경우
    const hours = Math.floor(diff / millisecondsInAnHour)
    const minutes = Math.floor(
      (diff % millisecondsInAnHour) / millisecondsInAMinute
    )
    const seconds = Math.floor(
      (diff % millisecondsInAMinute) / millisecondsInASecond
    )
    const currTime = `(-${pad(hours)}:${pad(minutes)}:${pad(seconds)})`
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

//** 새소식 알림 부분 시간포맷 함수 */
export const formatTalkTime = (isoTimestamp: string): string => {
  // ISO 타임스탬프를 Date 객체로 파싱
  const date = new Date(isoTimestamp)

  // 로컬 시간의 시와 분을 가져옴
  let hours = date.getHours()
  const minutes = date.getMinutes()

  // 오전 또는 오후 결정
  const period = hours >= 12 ? "오후" : "오전"

  // 24시간 형식을 12시간 형식으로 변환
  hours = hours % 12
  hours = hours === 0 ? 12 : hours // 자정(0)과 정오(12)를 12로 조정

  // 분이 한 자리인 경우 앞에 0을 추가
  const paddedMinutes = minutes.toString().padStart(2, "0")

  // 최종 형식화된 문자열 결합
  return `${period} ${hours}:${paddedMinutes}`
}

//** 새소식 알림 부분 년월일포맷 함수 */
export const formatTalkDate = (isoTimestamp: string): string => {
  // ISO 타임스탬프를 Date 객체로 파싱
  const date = new Date(isoTimestamp)

  // 연, 월, 일 추출
  const year = date.getFullYear()
  const month = date.getMonth() + 1 // 월은 0부터 시작하므로 1을 더함
  const day = date.getDate()

  // "YYYY년 MM월 DD일" 형식으로 변환
  return `${year}년 ${month}월 ${day}일`
}

//** OCR필터링 알고리즘 */
function findRepeatedPattern(str: string): { unit: string; count: number } {
  const n = str.length

  for (let i = 1; i <= n; i++) {
    if (n % i === 0) {
      const unit = str.substring(0, i)
      const repeatCount = n / i
      if (unit.repeat(repeatCount) === str) {
        return { unit, count: repeatCount }
      }
    }
  }

  return { unit: str, count: 1 }
}

// 간단한 형용사 사전
const adjectiveList = [
  "예쁜",
  "아름다운",
  "큰",
  "작은",
  "좋은",
  "나쁜",
  "빠른",
  "느린",
  "높은",
  "낮은",
  "맛있는",
  "행복한",
  "즐거운",
  "우아한",
]

function filterOnlyAdjectives(words: string[]): string[] {
  return words.filter((word) => adjectiveList.includes(word))
}

export function ocrFilterWord(text: string, threshold: number): boolean {
  const flattening = text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-'_~()]/g, "")
    .replace(/\u200B|\u200C|\u200D|\uFEFF/g, "")

  // 공백으로 split하되, 공백이 없으면 전체 문자열이 하나의 "단어"로 인식
  let words = flattening.split(/\s+/).filter((word) => word.length > 0)

  // 형용사만 남김
  words = filterOnlyAdjectives(words)

  const wordHash: Record<string, number> = {}
  for (const word of words) {
    const { unit, count } = findRepeatedPattern(word)

    // 해당 단어(또는 문자열)가 반복 단위로 threshold 이상 반복된다면 true
    if (count >= threshold) {
      return true
    }

    // 반복 단위가 threshold 미만일 경우 누적하여 관리
    if (wordHash[unit] === undefined) {
      wordHash[unit] = count
    } else {
      wordHash[unit] += count
    }

    if (wordHash[unit] >= threshold) {
      return true
    }
  }

  return false
}
