import styled, { keyframes } from "styled-components"

const GlobalLoading = () => {
  return (
    <LoadingContainer>
      <Spinner />
    </LoadingContainer>
  )
}

export default GlobalLoading

const LoadingContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`

// 로딩 스피너 애니메이션
const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

// 스피너 스타일
const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 6px solid #f3f3f3;
  border-top: 6px solid var(--revu-color);
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`
