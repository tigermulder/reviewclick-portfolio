import { Link } from "react-router-dom"
import { RoutePath } from "@/types/route-path"
import Logo from "assets/revu_logo.svg?react"
import IcoAppBarHeart from "assets/ico-appbar-heart.svg?react"
import styled from "styled-components"

const AppBar = () => {
  return (
    <Header>
      {/* 로고 */}
      <LogoContainer aria-label="리뷰클릭 로고">
        <Link to={RoutePath.Home}>
          <Logo aria-hidden="true" />
        </Link>
      </LogoContainer>

      <Link to={RoutePath.MyCart} aria-label="캠페인 찜 장바구니로 이동">
        <HeartIcon aria-label="캠페인 찜 장바구니">
          <IcoAppBarHeart aria-hidden="true" />
          <HeartText>찜 목록</HeartText>
        </HeartIcon>
      </Link>
    </Header>
  )
}

export default AppBar

const Header = styled.header`
  position: fixed;
  max-width: 768px;
  min-width: 280px;
  top: 0;
  left: 0;
  z-index: 20;
  width: 100%;
  height: 6rem;
  padding: 1.2rem 1.6rem;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`

const LogoContainer = styled.h1`
  min-width: 8.5rem;
  color: var(--L600);

  a {
    display: block;
  }

  svg {
    width: 100%;
    height: auto;
  }
`

const HeartIcon = styled.div`
  width: 2.4rem;
  margin-left: 1.2rem;
  color: var(--N80);

  svg {
    fill: currentColor;
    width: 100%;
    height: auto;
  }
`

const HeartText = styled.div`
  margin-top: 0.2rem;
  text-align: center;
  color: var(--Silver);
  font-size: 0.8rem;
  word-wrap: break-word;
`
