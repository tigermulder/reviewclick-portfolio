import RevuClickLogo from "assets/revu_logo.svg?react"
import Introduce from "assets/prd-introduce.png"
import IntroduceTitle from "assets/prd-intriduce-title.png"
import Button from "@/components/Button"
import styled from "styled-components"

const RevuIntroducePage = () => {
  return (
    <IntroduceContainer>
      {/* 로고 */}
      <Logo aria-label="RevuClick Logo">
        <RevuClickLogo aria-hidden="true" />
      </Logo>

      <img
        src={IntroduceTitle}
        alt="캠페인 신청하고 리뷰만 남겨도 포인트가 쌓여요!"
      ></img>
      <p>
        간단한 계정 인증 후 다양한 캠페인에 참여하고, <br />
        최대 100% 리워드를 받아보세요.
      </p>
      <ButtonContainer>
        <Button $variant="red">리뷰참여하러 가기</Button>
      </ButtonContainer>
    </IntroduceContainer>
  )
}

export default RevuIntroducePage

const IntroduceContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: url("${Introduce}") no-repeat center / 100%;
  overflow: hidden;

  img {
    width: 24rem;
    margin-top: 3.6rem;
  }
  p {
    margin-top: 2rem;
    text-align: center;
    color: var(--N300);
  }
`

const Logo = styled.div`
  min-width: 8.5rem;
  margin-top: 4rem;
  color: var(--L600);
`

const ButtonContainer = styled.div`
  position: absolute;
  padding: 1.5rem;
  width: 100%;
  bottom: 0;
  left: 0;
`
