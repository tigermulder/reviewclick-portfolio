import { Outlet, useLocation, useMatch } from "react-router-dom"
import { ContentProps } from "@/types/route-path"
import { RoutePath } from "@/types/route-path"
import ErrorBoundary from "components/ErrorBoundary"
import styled from "styled-components"

const Layout = () => {
  const location = useLocation() // 현재 경로
  const isCampaignDetail = !!useMatch("/campaign/:campaignId") // 캠페인 상세 경로
  const isReviewDetail = !!useMatch("/my_campaign/:reviewId") // MY캠페인 상세 경로
  const isLoginPage = location.pathname === RoutePath.Login // 로그인 페이지
  const isJoinPage = location.pathname === RoutePath.Join // 회원가입 페이지
  const isFindIdPage = location.pathname === RoutePath.FindId // 아이디찾기 페이지
  const isFindPassWordPage = location.pathname === RoutePath.FindPassword // 아이디찾기 페이지
  const isMyCartPage = location.pathname === RoutePath.MyCart // 장바구니 페이지
  const isMyCampaignPage = location.pathname === RoutePath.MyCampaign // 나의 캠페인 페이지
  const isUserPointLogPage = location.pathname === RoutePath.UserPointLog // 나의 포인트내역 페이지
  const UserServiceGuidePage = location.pathname === RoutePath.UserServiceGuide // 서비스 이용가이드 페이지
  const isSpecialPage =
    isLoginPage ||
    isCampaignDetail ||
    isReviewDetail ||
    isMyCartPage ||
    isFindIdPage ||
    isJoinPage ||
    isFindPassWordPage

  return (
    <>
      {/* 에러 바운더리 */}
      <ErrorBoundary>
        <Content
          $isSpecialPage={isSpecialPage}
          $isCampaignDetail={isCampaignDetail}
          $isMyCampaignPage={isMyCampaignPage}
          $isUserPointLogPage={isUserPointLogPage}
          $UserServiceGuidePage={UserServiceGuidePage}
        >
          {/* 각 페이지별로 다른 콘텐츠를 보여주는 Outlet */}
          <Outlet />
        </Content>
      </ErrorBoundary>
    </>
  )
}

export default Layout

const Content = styled.main<ContentProps>`
  width: 100%;

  ${({
    $isMyCampaignPage,
    $isSpecialPage,
    $isCampaignDetail,
    $isUserPointLogPage,
    $UserServiceGuidePage,
  }) => {
    if ($isMyCampaignPage) {
      return `
        min-height: 100vh; 
        margin: 11.8rem auto 0;
        padding: 2.4rem 1.5rem 8rem;
        background: var(--whitewood);
      `
    } else if ($isSpecialPage) {
      if ($isCampaignDetail) {
        return `
          min-height: 100vh; 
          margin: 0;
        `
      } else {
        return `
          min-height: 100vh; 
          margin: 0;
          padding: 0 1.5rem;
        `
      }
    } else if ($isUserPointLogPage) {
      return `
        background-color: var(--n20-color);
        min-height: 100vh; 
        margin: 0;
        padding: 0 1.5rem;
      `
    } else if ($UserServiceGuidePage) {
      return `
        padding: 4.4rem 0 0;
        background-color: var(--n80-color);
      `
    } else {
      return `
        margin: 60px auto 0;
        padding: 0 1.5rem;
      `
    }
  }}
`
