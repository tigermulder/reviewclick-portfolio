import { atom, selector } from "recoil"
import { campaignListState, campaignLikeState } from "./mainpage-recoil"
import { FilterOption } from "@/types/component-types/filter-dropdown-type"
import {
  cartOptions,
  contactOptions,
} from "@/types/component-types/dropdown-type"

// 찜하기 필터 상태 아톰
export const selectedFilterState = atom<FilterOption>({
  key: "selectedFilterState",
  default: cartOptions[0],
})

// 찜하기 필터링된 캠페인 셀렉터
export const filteredCampaignsSelector = selector({
  key: "filteredCampaignsSelector",
  get: ({ get }) => {
    const campaigns = get(campaignListState)
    const likedCampaigns = get(campaignLikeState)
    const selectedFilter = get(selectedFilterState)

    // 찜한 캠페인 ID 배열 생성
    const campaignIds = Object.values(likedCampaigns).flat()

    // 캠페인 데이터가 존재하지 않으면 빈 배열 반환
    if (!campaigns || campaigns.length === 0 || campaignIds.length === 0) {
      return []
    }

    // 찜한 캠페인 필터링
    let filtered = campaigns.filter((campaign: any) =>
      campaignIds.includes(campaign.campaignId)
    )

    // 필터링된 캠페인이 없으면 빈 배열 반환
    if (filtered.length === 0) {
      return []
    }

    // 선택된 필터에 따라 정렬
    switch (selectedFilter.label) {
      case "최신순":
        filtered.sort(
          (a: any, b: any) =>
            new Date(b.startAt).getTime() - new Date(a.startAt).getTime()
        )
        break
      case "신청자 많은순":
        filtered.sort((a: any, b: any) => b.joins - a.joins)
        break
      case "신청자 낮은순":
        filtered.sort((a: any, b: any) => a.joins - b.joins)
        break
      case "마감 임박순":
        filtered.sort(
          (a: any, b: any) =>
            new Date(a.endAt).getTime() - new Date(b.endAt).getTime()
        )
        break
      case "포인트 높은순":
        filtered.sort((a: any, b: any) => b.price - a.price)
        break
      case "포인트 낮은순":
        filtered.sort((a: any, b: any) => a.price - b.price)
        break
      default:
        break
    }

    return filtered
  },
})

// 문의사항 필터 상태 아톰
export const selectedContactFilterState = atom<FilterOption>({
  key: "selectedContactFilterState",
  default: contactOptions[0],
})
