import SeoHelmet from "@/components/SeoHelmet"
import ReuseHeader from "@/components/ReuseHeader"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"

const CoupangVerificationPage = () => {
  const navigate = useNavigate()
  return (
    <>
      <SeoHelmet
        title="리뷰클릭-User Authentication"
        description="리뷰클릭은 제품과 서비스 전반에 걸친 다양한 사용자 리뷰를 한곳에서 제공합니다. 믿을 수 있는 평가와 상세한 리뷰로 현명한 소비를 지원합니다."
      />
      <VerificationContainer>
        <ReuseHeader
          title="계정인증"
          onBack={() => {
            navigate(-1)
          }}
        />
      </VerificationContainer>
    </>
  )
}

export default CoupangVerificationPage

const VerificationContainer = styled.div`
  padding: 5.2rem 0 0;
  height: 100vh;
`
