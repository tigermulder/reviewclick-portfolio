import Error404Image from "assets/404error.png"
import Button from "@/components/Button"
import { useNavigate } from "react-router-dom"
import SeoHelmet from "@/components/SeoHelmet"
import styled from "styled-components"

const NotFoundPage = () => {
  const navigate = useNavigate()

  const handleGoBack = () => {
    const redirectPath = sessionStorage.getItem("redirectPath")
    if (redirectPath) {
      navigate(redirectPath)
    } else {
      navigate(-1) // 이전 페이지로 돌아감
    }
  }

  return (
    <>
      <SeoHelmet
        title="리뷰클릭-NotFoundPage"
        description="리뷰클릭은 제품과 서비스 전반에 걸친 다양한 사용자 리뷰를 한곳에서 제공합니다. 믿을 수 있는 평가와 상세한 리뷰로 현명한 소비를 지원합니다."
      />
      <ErrorContainer>
        <img src={Error404Image} alt="에러 이미지" />
        <h2>페이지를 찾을 수 없어요</h2>
        <ErrorMessage>
          입력한 주소가 정확한 지 <br />
          다시 한 번 확인해주세요.
        </ErrorMessage>
        <ButtonContainer>
          <Button onClick={handleGoBack} $variant="pink">
            돌아가기
          </Button>
        </ButtonContainer>
      </ErrorContainer>
    </>
  )
}

export default NotFoundPage

const ErrorContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 1.5rem;
  text-align: center;
  img {
    width: 9rem;
    height: auto;
    margin-bottom: 2.9rem;
  }
`

const ErrorMessage = styled.p`
  margin: 0.8rem 0 4rem;
  text-align: center;
  font-size: var(--font-body-size);
  color: var(--N200);
`

const ButtonContainer = styled.div`
  width: 50%;
`
