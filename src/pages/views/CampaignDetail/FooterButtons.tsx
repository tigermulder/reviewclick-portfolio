import styled from "styled-components"
import Button from "@/components/Button"

interface FooterButtonsProps {
  campaignDetail: any
  reviewStatus: string | null
  handleApply: () => void
  handleCancelOpen: () => void
}

function FooterButtons({
  campaignDetail,
  reviewStatus,
  handleApply,
  handleCancelOpen,
}: FooterButtonsProps) {
  const renderButton = () => {
    const campaignStatus = campaignDetail.status
    const quota = campaignDetail.quota
    const joins = campaignDetail.joins

    if (campaignStatus === "closed" || campaignStatus === "pause") {
      return <Button $variant="disable">캠페인 신청 불가</Button>
    }

    if (quota !== joins) {
      if (reviewStatus === null) {
        return (
          <Button onClick={handleApply} $variant="red">
            캠페인 신청하기
          </Button>
        )
      } else {
        switch (reviewStatus) {
          case "join":
            return (
              <Button onClick={handleCancelOpen} $variant="grey">
                캠페인 신청 취소하기
              </Button>
            )
          case "purchase":
          case "confirm":
          case "upload":
            return <Button $variant="disable">캠페인 참여중</Button>
          default:
            return <Button $variant="disable">캠페인 신청 불가</Button>
        }
      }
    } else {
      return <Button $variant="disable">캠페인 신청 불가</Button>
    }
  }

  return (
    <FooterContainer>
      {/* 찜하기 버튼 */}
      {/* <LikeButton
        categoryId={campaignDetail.categoryId}
        campaignId={campaignDetail.campaignId}
      /> */}
      {/* 캠페인 신청하기 버튼 */}
      {renderButton()}
    </FooterContainer>
  )
}

export default FooterButtons

const FooterContainer = styled.div`
  max-width: 768px;
  min-width: 375px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  position: fixed;
  bottom: 5.9rem;
  left: 0;
  width: 100%;
  background: #fff;
  z-index: 100;
  padding: 1.5rem;
`
