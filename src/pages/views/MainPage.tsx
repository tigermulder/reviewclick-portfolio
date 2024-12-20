import { useEffect, useRef } from "react"
import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { useSetRecoilState, useRecoilValue } from "recoil"
import SeoHelmet from "@/components/SeoHelmet"
import {
  campaignListState,
  filteredAndSortedCampaignList,
} from "store/mainpage-recoil"
import { getCampaignList } from "services/campaign"
import BannerSlider from "components/Banner"
import LikeButton from "components/LikeButton"
import { FilterBar } from "components/FilterBar"
import dummyImage from "assets/dummy-image.png"
import useScrollToTop from "@/hooks/useScrollToTop"
import styled from "styled-components"
import { calculateRemainingTime } from "@/utils/util"

const MainPage = (): JSX.Element => {
  const setCampaignList = useSetRecoilState(campaignListState)
  const filteredCampaigns = useRecoilValue(filteredAndSortedCampaignList)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  //** 스크롤 0부터시작 */
  useScrollToTop()

  //** Fetch campaign list */
  const fetchCampaigns = async ({ pageParam = 1 }) => {
    // await new Promise((resolve) => setTimeout(resolve, 2000000))
    const requestData = {
      pageSize: 10,
      pageIndex: pageParam,
    }
    const response = await getCampaignList(requestData)
    return response
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
            <CampaignCard key={campaign.campaignId} $isEnded={isEnded}>
              <CampaignImage>
                <img src={thumbnailUrl} alt={campaign.title} />
                <RemainingDays $isEnded={isEnded}>
                  {isEnded ? "캠페인 종료" : remainingTime}
                </RemainingDays>
                {isEnded && <EndedOverlay />}
                {!isEnded && (
                  <CustomLikeButton
                    categoryId={campaign.categoryId}
                    campaignId={campaign.campaignId}
                    className="cart-like-button"
                  />
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

const CustomLikeButton = styled(LikeButton)`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
`
