import { FilterOption } from "@/types/component-types/filter-dropdown-type"
export const cartOptions: FilterOption[] = [
  { id: 1, label: "최신순" },
  { id: 2, label: "신청자 많은순" },
  { id: 3, label: "신청자 낮은순" },
  { id: 4, label: "마감 임박순" },
  { id: 5, label: "포인트 높은순" },
  { id: 6, label: "포인트 낮은순" },
]

export const contactOptions: FilterOption[] = [
  { id: 1, label: "포인트 관련 문의" },
  { id: 2, label: "캠페인 관련 문의" },
  { id: 3, label: "회원 정보 수정 문의" },
  { id: 4, label: "회원 탈퇴 문의" },
  { id: 5, label: "기타 문의" },
]
