export const chips = [
  "전체",
  "상품구매",
  "리뷰검수",
  "리뷰등록",
  "지급대기",
  "지급완료",
  "미션중단",
] as const

export type ChipType = (typeof chips)[number]
