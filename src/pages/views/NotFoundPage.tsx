import Error404Image from "assets/404error.png"
import Button from "@/components/Button"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"

const NotFoundPage = () => {
  const navigate = useNavigate()
  console.log("NotFoundPage 렌더링됨")
  return (
    <ErrorContainer>
      <img src={Error404Image} alt="에러 이미지" />
      <ErrorTitle>페이지를 찾을 수 없어요</ErrorTitle>
      <ErrorMessage>
        입력한 주소가 정확한 지 <br />
        다시 한 번 확인해주세요.
      </ErrorMessage>
      <ButtonContainer>
        <Button onClick={() => navigate(-1)} $variant="pink">
          돌아가기
        </Button>
      </ButtonContainer>
    </ErrorContainer>
  )
}

export default NotFoundPage

// 스타일드 컴포넌트
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

const ErrorTitle = styled.h1`
  font-size: var(--font-h2-size);
  font-weight: var(--font-h2-weight);
  letter-spacing: var(--font-h2-letter-spacing);
`

const ErrorMessage = styled.p`
  margin: 0.8rem 0 4rem;
  text-align: center;
  font-size: var(--font-bodyM-size);
  font-weight: var(--font-bodyM-weight);
  line-height: var(--font-bodyM-line-height);
  letter-spacing: var(--font-bodyM-letter-spacing);
  color: var(--n200-color);
`

const ButtonContainer = styled.div`
  width: 50%;
`
