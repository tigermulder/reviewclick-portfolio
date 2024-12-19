import { useRecoilState, useRecoilValue } from "recoil"
import { campaignLikeState } from "@/store/mainpage-recoil"
import LikeButton from "components/LikeButton"
import dummyImage from "assets/dummy-image.png"
import { useNavigate } from "react-router-dom"
import useToast from "@/hooks/useToast"
import { filteredCampaignsSelector } from "@/store/dropdown-recoil"
import ReuseHeader from "@/components/ReuseHeader"
import SeoHelmet from "@/components/SeoHelmet"
import styled from "styled-components"

const CampaignCart = () => {
  const [likedCampaigns, setLikedCampaigns] = useRecoilState(campaignLikeState)
  const filteredCampaigns = useRecoilValue(filteredCampaignsSelector)
  const navigate = useNavigate()
  const { addToast } = useToast()

  //** 찜 해제 시 로컬 스토리지와 상태 업데이트 */
  const handleUnlike = (campaignId: number, categoryId: number) => {
    const updatedLikes = { ...likedCampaigns }
    updatedLikes[categoryId] = updatedLikes[categoryId].filter(
      (id: number) => id !== campaignId
    )
    if (updatedLikes[categoryId].length === 0) {
      delete updatedLikes[categoryId]
    }
    setLikedCampaigns(updatedLikes)
    addToast("찜한 목록에서 해제했어요.", 3000, "like")
  }

  return (
    <>
      <SeoHelmet
        title="리뷰클릭-Campaign Cart"
        description="리뷰클릭은 제품과 서비스 전반에 걸친 다양한 사용자 리뷰를 한곳에서 제공합니다. 믿을 수 있는 평가와 상세한 리뷰로 현명한 소비를 지원합니다."
      />
      <Container>
        <ReuseHeader title="찜 목록" onBack={() => navigate(-1)} />
        {/* 캠페인 리스트 */}
        <CampaignList>
          {filteredCampaigns.length > 0 ? (
            filteredCampaigns.map((campaign) => {
              // 남은 시간 계산
              const endTime = campaign.endAt
                ? new Date(campaign.endAt).getTime()
                : 0
              const now = Date.now()
              const diffInMs = endTime - now
              const diffInDays = diffInMs / (1000 * 60 * 60 * 24)
              let remainingTime
              if (diffInDays > 1) {
                remainingTime = `D-${Math.ceil(diffInDays)}일`
              } else if (diffInDays > 0) {
                const diffInHours = diffInMs / (1000 * 60 * 60)
                remainingTime = `T-${Math.ceil(diffInHours)}시간`
              } else {
                remainingTime = "캠페인 종료"
              }
              const isEnded = remainingTime === "캠페인 종료"

              return (
                <CampaignItem key={campaign.campaignId}>
                  <CampaignThumb>
                    <CampaignImage
                      src={campaign.thumbnailUrl || dummyImage}
                      alt={campaign.title}
                    />
                    <RemainingDays $isEnded={isEnded}>
                      {isEnded ? "캠페인 종료" : remainingTime}
                    </RemainingDays>
                  </CampaignThumb>
                  <CampaignInfo>
                    <h4>{campaign.price.toLocaleString()}P</h4>
                    <CampaignTitle>{campaign.title}</CampaignTitle>
                    <CampaignDescription>
                      신청 | <Join>{campaign.joins}</Join>/{campaign.quota}명
                    </CampaignDescription>
                    {/* 찜하기 버튼: 장바구니에서는 항상 찜된 상태 */}
                    <CustomLikeButton
                      categoryId={campaign.categoryId}
                      campaignId={campaign.campaignId}
                      onLikeToggle={() =>
                        handleUnlike(campaign.campaignId, campaign.categoryId)
                      }
                      isLiked={true}
                      className="cart-like-button"
                    />
                  </CampaignInfo>
                </CampaignItem>
              )
            })
          ) : (
            <NoCampaigns>찜한 캠페인이 없습니다.</NoCampaigns>
          )}
        </CampaignList>
      </Container>
    </>
  )
}

export default CampaignCart

const CustomLikeButton = styled(LikeButton)`
  position: absolute;
  bottom: 50%;
  transform: translateY(55%);
  right: 1.5rem;
`

const Container = styled.div`
  padding: 0 0 2rem;
`

const CampaignList = styled.ul`
  padding: 8.6rem 0 5rem;
  list-style: none;
`

const CampaignItem = styled.li`
  display: flex;
  padding: 1.4rem 0;
  border-radius: 10px;
  width: 100%;
`

const CampaignThumb = styled.div`
  position: relative;
  width: 8.1rem;
  height: 8.1rem;
  overflow: hidden;
  border-radius: 1rem;
  flex-shrink: 0;
`

const CampaignImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  object-fit: cover;
`

const RemainingDays = styled.span<{ $isEnded: boolean }>`
  position: absolute;
  bottom: 0.7rem;
  left: 0;
  padding: 0.2rem 0.6rem;
  border-radius: 0.2rem;
  font-size: var(--caption-size);
  background: ${({ $isEnded }) =>
    $isEnded ? "rgba(0,0,0,0.5)" : "var(--RevBlack)"};
  color: white;
`

const CampaignInfo = styled.div`
  position: relative;
  width: 82%;
  padding: 0 1.4rem;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
`

const CampaignTitle = styled.span`
  width: 87%;
  margin-top: 0.5rem;
  font-size: var(--font-body-size);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const CampaignDescription = styled.div`
  margin-top: 0.6rem;
  font-size: 1.2rem;
  color: var(--N200);
`

const Join = styled.span`
  font-weight: var(--font-medium);
  color: var(--RevBlack);
`

const NoCampaigns = styled.p`
  position: absolute;
  top: 46%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--N200);
`
