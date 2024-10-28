import ReuseHeader from "@/components/ReuseHeader"
import { useNavigate } from "react-router-dom"
import { RoutePath } from "@/types/route-path"
import styled from "styled-components"

const MyPointPage = () => {
  const navigate = useNavigate()
  return (
    <MyPointContainer>
      <ReuseHeader
        title="포인트 적립 내역"
        onBack={() => navigate(RoutePath.MyCampaign)}
      />
      <div></div>
    </MyPointContainer>
  )
}

export default MyPointPage

const MyPointContainer = styled.div`
  background-color: var(--n20-color);
  min-height: 100vh;
  padding-bottom: calc(6.7rem + 6.9rem);
`
