import { Link } from "react-router-dom"
import { RoutePath } from "@/types/route-path"
import RevuClickLogo from "assets/revu_logo.svg?react"
import IcoSearch from "assets/ico-search.svg?react"
import IcoAppBarHeart from "assets/ico-appbar-heart.svg?react"
import styled from "styled-components"
import { authState } from "@/store/auth-recoil"
import { useRecoilValue } from "recoil"

const AppBar = () => {
  const { isLoggedIn } = useRecoilValue(authState)

  return (
    <Header className="app-bar">
      {/* 로고 */}
      <Logo>
        <Link to={RoutePath.Home}>
          <RevuClickLogo aria-label="RevuClick Logo" />
        </Link>
      </Logo>

      {/* 검색 바 */}
      <SearchForm $isLoggedIn={isLoggedIn}>
        <SearchInputWrapper>
          <SearchInput
            type="text"
            aria-label="검색"
            placeholder="검색어를 입력하세요."
          />
          <SearchIcon className="ico-search" aria-hidden="true">
            <IcoSearch aria-label="Search Bar" />
          </SearchIcon>
        </SearchInputWrapper>
      </SearchForm>

      {/* 로그인 여부에 따른 찜하기 아이콘 또는 회원가입 링크 */}
      {/* {isLoggedIn ? (
        <Link to={RoutePath.MyCart} aria-label="캠페인 찜 장바구니로 이동">
          <HeartIcon aria-label="캠페인 찜 장바구니">
            <IcoAppBarHeart />
            <HeartText>찜 목록</HeartText>
          </HeartIcon>
        </Link>
      ) : (
        <SignUpLink>
          <Link to={RoutePath.Login} aria-label="로그인 페이지로 이동">
            로그인
          </Link>
        </SignUpLink>
      )} */}
      <Link to={RoutePath.MyCart} aria-label="캠페인 찜 장바구니로 이동">
        <HeartIcon aria-label="캠페인 찜 장바구니">
          <IcoAppBarHeart />
          <HeartText>찜 목록</HeartText>
        </HeartIcon>
      </Link>
    </Header>
  )
}

export default AppBar

// 스타일 정의

const Header = styled.header`
  position: fixed;
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

const Logo = styled.div`
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

const SearchForm = styled.form<{ $isLoggedIn: boolean }>`
  flex-basis: 57%;
  height: 100%;
  margin-left: ${({ $isLoggedIn }) => ($isLoggedIn ? "3.4rem" : "2.4rem")};
  overflow: hidden;
`

const SearchInputWrapper = styled.div`
  position: relative;
  height: 100%;
`

const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  padding-left: 1.8rem;
  background: var(--N20);
  border-radius: 2.1rem;
  transition: 0.1s;
  border: 0.1rem solid var(--N20);

  &:focus {
    outline: none;
    border: 0.1rem solid var(--N600);

    ~ .ico-search {
      color: var(--N600);
    }
  }

  @media (max-width: 374px) {
    &::placeholder {
      color: transparent;
    }
  }
`

const SearchIcon = styled.div`
  position: absolute;
  width: 2.1rem;
  top: 50%;
  right: 1.1rem;
  transform: translateY(-50%);
  color: var(--N200);
  transition: color 0.1s ease;

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

const SignUpLink = styled.div`
  margin-left: 1.6rem;
  font-size: 1.3rem;
  color: var(--Silver);
  flex-shrink: 0;
  border-bottom: 1px solid var(--Silver);

  a {
    text-decoration: none;
    color: inherit;
  }
`

const HeartText = styled.div`
  margin-top: 0.2rem;
  text-align: center;
  color: var(--Silver);
  font-size: 0.8rem;
  word-wrap: break-word;
`
