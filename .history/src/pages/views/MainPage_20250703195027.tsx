import { useEffect, useRef } from "react"
import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { useSetRecoilState, useRecoilValue } from "recoil"
import { useNavigate } from "react-router-dom"
import SeoHelmet from "@/components/SeoHelmet"
import {
  campaignListState,
  filteredAndSortedCampaignList,
} from "store/mainpage-recoil"
import { getCampaignList } from "services/campaign"
import { checkAdAndGetLandingUrl } from "services/ads"
import BannerSlider from "components/Banner"
import LikeButton from "components/LikeButton"
import { FilterBar } from "components/FilterBar"
import dummyImage from "assets/dummy-image.png"
import useScrollToTop from "@/hooks/useScrollToTop"
import useToast from "@/hooks/useToast"
import styled from "styled-components"
import { calculateRemainingTime } from "@/utils/util"
import mockCampaignList from "services/mock-campaign-list"

const MainPage = (): JSX.Element => {
  const setCampaignList = useSetRecoilState(campaignListState)
  const filteredCampaigns = useRecoilValue(filteredAndSortedCampaignList)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()
  const { addToast } = useToast()

  //** 스크롤 0부터시작 */
  useScrollToTop()

  //** 랜덤 UID 생성 함수 */
  const generateRandomUid = () => {
    const randomString = Math.random().toString(36).substring(2, 12)
    const randomNumber = Math.floor(Math.random() * 9999) + 1
    return `${randomString}${randomNumber}`
  }

  //** 랜덤 AdvId 생성 함수 */
  const generateRandomAdvId = () => {
    return Math.floor(Math.random() * 999) + 1
  }

  //** 캠페인 클릭 시 B2 API 호출 */
  const handleCampaignClick = async (
    campaignCode: string,
    isEnded: boolean
  ) => {
    if (isEnded) {
      return
    }

    try {
      // 랜덤 uid, advId 생성
      const randomUid = generateRandomUid()
      const randomAdvId = generateRandomAdvId()

      // B2 광고 API 호출 (campaignCode를 adCode로 사용)
      const adCheckData = {
        adCode: campaignCode, // campaignCode를 adCode로 사용
        uid: randomUid, // 랜덤 생성된 uid
        advId: randomAdvId.toString(), // 랜덤 생성된 advId
      }

      console.log("B2 API 호출 데이터:", adCheckData)
      const response = await checkAdAndGetLandingUrl(adCheckData)

      if (response.statusCode === 0 && response.landingUrl) {
        // landingUrl로 현재 창에서 이동
        window.location.href = response.landingUrl
        console.log("B2 추적 URL로 이동:", response.landingUrl)
      } else {
        console.warn("B2 API 응답 오류:", response.message)
        addToast("링크를 생성하는데 문제가 발생했습니다.", 2000, "campaign")
      }
    } catch (error) {
      console.error("B2 API 호출 실패:", error)
      addToast("링크를 생성하는데 문제가 발생했습니다.", 2000, "campaign")
    }
  }

  //** Fetch campaign list */
  const fetchCampaigns = async () => {
    // 무조건 mock 데이터만 반환
    return mockCampaignList
  }

  //* 콘솔
  // useEffect(() => {
  //   console.log(
  //     ocrFilterWord("안녕하세요 안녕하세요 누가 안녕하세요 내가 안녕하세요", 3)
  //   )
  // }, [])

  //** 리액트쿼리 */
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: ["campaigns"],
      queryFn: fetchCampaigns,
      getNextPageParam: (lastPage) => {
        if (lastPage.pageIndex < lastPage.totalPages) {
          return lastPage.pageIndex + 1
        }
        return undefined
      },
      initialPageParam: 1,
      refetchInterval: 10 * 60 * 1000,
      staleTime: 10 * 60 * 1000,
      gcTime: 11 * 60 * 1000,
      refetchOnMount: false,
    })

  //** 캠페인 데이터를 Recoil 상태로 업데이트 */
  useEffect(() => {
    if (data?.pages) {
      const allCampaigns = data.pages.flatMap((page) => page.list)
      setCampaignList(allCampaigns)
    }
  }, [data, setCampaignList])

  //** 무한 스크롤을 위한 Intersection Observer */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // 관찰 대상이 보이고 있고 다음 페이지가 있을 경우
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 1.0 }
    )
    const currentElement = loadMoreRef.current
    if (currentElement) {
      observer.observe(currentElement)
    }
    return () => {
      if (currentElement) {
        observer.unobserve(currentElement)
      }
    }
  }, [fetchNextPage, hasNextPage])

  return (
    <>
      <SeoHelmet
        title="리뷰클릭-Main"
        description="리뷰클릭은 제품과 서비스 전반에 걸친 다양한 사용자 리뷰를 한곳에서 제공합니다. 믿을 수 있는 평가와 상세한 리뷰로 현명한 소비를 지원합니다."
      />
      <BannerSlider />
      {/* 필터칩 */}
      <FilterBar />
      <CampaignList>
        {filteredCampaigns?.map((campaign) => {
          const endTime = campaign.endAt
          const { remainingTime, isEnded } = calculateRemainingTime(endTime)
          const thumbnailUrl = campaign.thumbnailUrl || dummyImage
          return (
            <CampaignCard
              key={campaign.campaignId}
              $isEnded={isEnded}
              onClick={() =>
                handleCampaignClick(campaign.campaignCode, isEnded)
              }
            >
              <CampaignImage>
                <img src={thumbnailUrl} alt={campaign.title} />
                <RemainingDays $isEnded={isEnded}>
                  {isEnded ? "캠페인 종료" : remainingTime}
                </RemainingDays>
                {isEnded && <EndedOverlay />}
                {!isEnded && (
                  <LikeButtonWrapper
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  >
                    <CustomLikeButton
                      categoryId={campaign.categoryId}
                      campaignId={campaign.campaignId}
                      className="cart-like-button"
                    />
                  </LikeButtonWrapper>
                )}
              </CampaignImage>
              <CampaignCardInfo>
                <Title>{campaign.title}</Title>
                <Participants>
                  신청 | <em>{campaign.joins}</em>/{campaign.quota}명
                </Participants>
              </CampaignCardInfo>
            </CampaignCard>
          )
        })}
      </CampaignList>
      <div ref={loadMoreRef}>{isFetchingNextPage ? <p>더보기</p> : null}</div>
    </>
  )
}

export default MainPage

const CampaignList = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.4rem;
  list-style-type: none;
  padding: 1.6rem 0 6.4rem;
  width: 100%;
`

interface CampaignCardProps {
  $isEnded: boolean
}
const CampaignCard = styled.li.attrs<CampaignCardProps>((props) => ({
  "aria-disabled": props.$isEnded,
  "data-is-ended": props.$isEnded,
}))<CampaignCardProps>`
  position: relative;
  width: 100%;
  overflow: hidden;
  background-color: white;
  cursor: pointer;
`

const CampaignImage = styled.div`
  position: relative;
  border-radius: 0.4rem;
  overflow: hidden;
  background-color: white;
  img {
    width: 100%;
    height: 17.8rem;
    object-fit: cover;
  }

  @media (max-width: 374px) {
    & img {
      height: 13.8rem;
    }
  }
`

interface RemainingDaysProps {
  $isEnded: boolean
}
const RemainingDays = styled.span.attrs<RemainingDaysProps>((props) => ({
  "aria-label": props.$isEnded ? "캠페인이 종료되었습니다" : "캠페인 남은 일수",
  "data-is-ended": props.$isEnded,
}))<RemainingDaysProps>`
  position: absolute;
  top: ${({ $isEnded }) => ($isEnded ? "50%" : "1rem")};
  left: ${({ $isEnded }) => ($isEnded ? "50%" : "1rem")};
  transform: ${({ $isEnded }) => ($isEnded ? "translate(-50%, -50%)" : "none")};
  background-color: black;
  color: white;
  padding: 0.5rem 0.6rem;
  border-radius: 0.2rem;
  font-size: var(--font-body-size);
  font-weight: var(--font-bold);
  z-index: 2;
`

const EndedOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1;
  pointer-events: none;
`

const CampaignCardInfo = styled.div`
  padding: 1.2rem 0;
`

const Title = styled.p`
  font-size: 1.3rem;
  margin: 0.4rem 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`

const Participants = styled.p`
  margin: 1rem 0 0.8rem;
  font-size: 1.2rem;
  color: var(--N200);
  em {
    color: var(--RevBlack);
    font-weight: var(--font-medium);
  }
`

const LikeButtonWrapper = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  z-index: 10;
`

const CustomLikeButton = styled(LikeButton)`
  /* 기존 스타일은 wrapper로 이동 */
`
