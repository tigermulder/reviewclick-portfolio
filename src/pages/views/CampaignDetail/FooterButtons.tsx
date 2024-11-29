import styled from "styled-components"
import Button from "@/components/Button"
import { FooterButtonsProps } from "@/types/component-types/footer-button"

function FooterButtons({
  campaignDetail,
  reviewStatus,
  handleCancelOpen,
  isScrolledToBottom,
  handleButtonClick,
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
          <Button onClick={handleButtonClick} $variant="red">
            {isScrolledToBottom ? "캠페인 신청하기" : "스크롤 내리기"}
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
      {/* 캠페인 신청하기 버튼 */}
      {renderButton()}
    </FooterContainer>
  )
}

export default FooterButtons

const FooterContainer = styled.div`
  max-width: 768px;
  min-width: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  position: fixed;
  bottom: 4.1rem;
  left: 0;
  width: 100%;
  background: #fff;
  z-index: 19;
  padding: 1.5rem 1.5rem 3rem;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.06);
`
