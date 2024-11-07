import { FilterOption } from "@/types/component-types/filter-dropdown-type"
export const cartOptions: FilterOption[] = [
  { id: 1, label: "최신순", value: "new" },
  { id: 2, label: "신청자 많은순", value: "new" },
  { id: 3, label: "신청자 낮은순", value: "new" },
  { id: 4, label: "마감 임박순", value: "new" },
  { id: 5, label: "포인트 높은순", value: "new" },
  { id: 6, label: "포인트 낮은순", value: "new" },
]

export const contactOptions: FilterOption[] = [
  { id: 1, label: "포인트 관련 문의", value: "point" },
  { id: 2, label: "캠페인 관련 문의", value: "campaign" },
  { id: 3, label: "회원 정보 수정 문의", value: "user_info" },
  { id: 4, label: "회원 탈퇴 문의", value: "user_exit" },
  { id: 5, label: "기타 문의", value: "etc" },
]
