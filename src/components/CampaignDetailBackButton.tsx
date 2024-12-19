import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import IconBack from "assets/ico-campaign-detail-back.svg?react"

const CampaignDetailBackButton = () => {
  const navigate = useNavigate()

  const handleBackClick = () => {
    navigate(-1) // 이전 페이지로 이동
  }

  return (
    <StyledBackButton onClick={handleBackClick}>
      <IconBack aria-hidden="true" />
    </StyledBackButton>
  )
}

export default CampaignDetailBackButton

const StyledBackButton = styled.button`
  position: fixed;
  top: 15px;
  left: 15px;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  opacity: 0.7;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
  z-index: 999;
`
