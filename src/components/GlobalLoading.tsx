import styled, { keyframes } from "styled-components"

const GlobalLoading = () => {
  return (
    <LoadingContainer>
      <Spinner>
        <Dot />
        <Dot />
        <Dot />
        <Dot />
        <Dot />
        <Dot />
        <Dot />
        <Dot />
      </Spinner>
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

const fade = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`

const Spinner = styled.div`
  position: relative;
  width: 0.5rem;
  height: 0.5rem;
`

const Dot = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  width: 0.4rem;
  height: 1.4rem;
  background-color: var(--prim-L100);
  border-radius: 0.3rem;
  transform-origin: center 2.2rem;
  animation: ${fade} 1s linear infinite;

  &:nth-child(1) {
    transform: rotate(0deg);
    animation-delay: 0s;
  }
  &:nth-child(2) {
    transform: rotate(45deg);
    animation-delay: -0.875s;
  }
  &:nth-child(3) {
    transform: rotate(90deg);
    animation-delay: -0.75s;
  }
  &:nth-child(4) {
    transform: rotate(135deg);
    animation-delay: -0.625s;
  }
  &:nth-child(5) {
    transform: rotate(180deg);
    animation-delay: -0.5s;
  }
  &:nth-child(6) {
    transform: rotate(225deg);
    animation-delay: -0.375s;
  }
  &:nth-child(7) {
    transform: rotate(270deg);
    animation-delay: -0.25s;
  }
  &:nth-child(8) {
    transform: rotate(315deg);
    animation-delay: -0.125s;
  }
`
