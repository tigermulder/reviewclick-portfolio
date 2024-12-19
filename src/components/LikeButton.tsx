import useLikeCampaign from "hooks/useLikeCampaign"
import useToast from "@/hooks/useToast"
import { LikeButtonProps } from "types/component-types/likebutton-type"
import IcoHeart from "assets/ico-main-heart.svg?react"
import IcoCampaignHeart from "assets/ico-campaign-detail-heart.svg?react"
import { useMatch } from "react-router-dom"
import styled from "styled-components"

const LikeButton = ({
  categoryId,
  campaignId,
  onLikeToggle,
  isLiked: isLikedProp,
  className,
}: LikeButtonProps & {
  onLikeToggle?: () => void
  isLiked?: boolean
  className?: string
}): JSX.Element => {
  const {
    isLiked: defaultIsLiked,
    likeCampaign,
    unlikeCampaign,
  } = useLikeCampaign(campaignId, categoryId)
  const { addToast } = useToast()

  const handleLike = (event: React.MouseEvent): void => {
    event.stopPropagation()

    if (onLikeToggle) {
      onLikeToggle() // 외부에서 찜하기 로직을 전달받았을 때 실행
    } else {
      if (defaultIsLiked()) {
        unlikeCampaign()
        addToast("찜한 목록에서 해제했어요", 3000, "like")
      } else {
        likeCampaign()
        addToast("찜한 목록에 추가했어요", 3000, "like")
      }
    }
  }

  const likedState = isLikedProp !== undefined ? isLikedProp : defaultIsLiked()

  const isCampaignPage = useMatch("/campaign/:campaignId")

  if (isCampaignPage) {
    return (
      <CampaignHeart
        onClick={handleLike}
        aria-label={likedState ? "좋아요 취소" : "좋아요"}
        $isLiked={likedState}
        className={className}
      >
        <StyledIcoCampaignHeart $isLiked={likedState} aria-hidden="true" />
        <HeartText>찜하기</HeartText>
      </CampaignHeart>
    )
  } else {
    return (
      <Button
        onClick={handleLike}
        aria-label={likedState ? "좋아요 취소" : "좋아요"}
        aria-pressed={likedState}
        className={className}
      >
        <StyledHeartIcon $isLiked={likedState} aria-hidden="true" />
      </Button>
    )
  }
}

export default LikeButton

const Button = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
`

const StyledHeartIcon = styled(IcoHeart)<{ $isLiked: boolean }>`
  width: 2.4rem;
  height: auto;
  color: ${({ $isLiked }) => ($isLiked ? "var(--L400)" : "var(--N40)")};
  transition: transform 0.1s ease-in-out;
`

const StyledIcoCampaignHeart = styled(IcoCampaignHeart)<{ $isLiked: boolean }>`
  width: 2.4rem;
  height: auto;
  color: ${({ $isLiked }) => ($isLiked ? "var(--L400)" : "white")};
`

const CampaignHeart = styled.div<{ $isLiked: boolean }>`
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  gap: 0.3rem;
  display: inline-flex;
  cursor: pointer;
`

const HeartText = styled.div`
  text-align: center;
  color: var(--L400);
  font-size: 0.7rem;
  font-weight: var(--font-medium);
`
