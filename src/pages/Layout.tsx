import { Outlet, useLocation, useMatch } from "react-router-dom"
import { ContentProps } from "@/types/route-path"
import { RoutePath } from "@/types/route-path"
import styled from "styled-components"

const Layout = () => {
  const location = useLocation() // 현재 경로
  const isCampaignDetail = !!useMatch("/campaign/:campaignId") // 캠페인 상세 경로
  const isReviewDetail = !!useMatch("/my_campaign/:reviewId") // MY캠페인 상세 경로
  const isNotificationDetail = !!useMatch("/alert/notification/:notificationId") // 새소식 상세 경로
  const isNoticeDetail = !!useMatch("/alert/notice/:noticeId") // 공지사항 상세 경로
  const isIntroducePage = location.pathname === RoutePath.Introduce // 소개페이지
  const isLoginPage = location.pathname === RoutePath.Login // 로그인 페이지
  const isJoinPage = location.pathname === RoutePath.Join // 인증 페이지 1-1
  const isJoinVerifyPage = location.pathname === RoutePath.JoinVerify // 인증 페이지 1-2
  const isFindIdPage = location.pathname === RoutePath.FindId // 아이디찾기 페이지
  const isFindPassWordPage = location.pathname === RoutePath.FindPassword // 아이디찾기 페이지
  const isMyCartPage = location.pathname === RoutePath.MyCart // 장바구니 페이지
  const isMyCampaignPage = location.pathname === RoutePath.MyCampaign // 나의 캠페인 페이지
  const isUserPointLogPage = location.pathname === RoutePath.UserPointLog // 나의 포인트내역 페이지
  const UserServiceGuidePage = location.pathname === RoutePath.UserServiceGuide // 서비스 이용가이드 페이지
  const TermsOfServicePage = location.pathname === RoutePath.TermsOfService // 이용약관 페이지
  const PrivacyPolicyPage = location.pathname === RoutePath.PrivacyPolicy // 개인정보처리방침 페이지
  const ContactAddPage = location.pathname === RoutePath.ContactAdd // 문의등록 페이지
  const UserAccountDeletionPage =
    location.pathname === RoutePath.UserAccountDeletion // 회원탈퇴 페이지
  const isNotFound = location.pathname === RoutePath.NotFound
  const isSpecialPage =
    isLoginPage ||
    isCampaignDetail ||
    isReviewDetail ||
    isMyCartPage ||
    isFindIdPage ||
    isJoinPage ||
    isJoinVerifyPage ||
    isFindPassWordPage

  return (
    <>
      <Content
        $isSpecialPage={isSpecialPage}
        $isCampaignDetail={isCampaignDetail}
        $isMyCampaignPage={isMyCampaignPage}
        $isUserPointLogPage={isUserPointLogPage}
        $UserServiceGuidePage={UserServiceGuidePage}
        $TermsOfServicePage={TermsOfServicePage}
        $PrivacyPolicyPage={PrivacyPolicyPage}
        $UserAccountDeletionPage={UserAccountDeletionPage}
        $ContactAddPage={ContactAddPage}
        $isNoticeDetail={isNoticeDetail}
        $isNotificationDetail={isNotificationDetail}
        $isIntroducePage={isIntroducePage}
        $isNotFound={isNotFound}
      >
        {/* 각 페이지별로 다른 콘텐츠를 보여주는 Outlet */}
        <Outlet />
      </Content>
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
    $TermsOfServicePage,
    $PrivacyPolicyPage,
    $UserAccountDeletionPage,
    $ContactAddPage,
    $isNoticeDetail,
    $isNotificationDetail,
    $isIntroducePage,
    $isNotFound,
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
    } else if ($TermsOfServicePage) {
      return `
        padding: 7rem 1.5rem 4rem;
        background-color: var(--whitewood);
      `
    } else if ($PrivacyPolicyPage) {
      return `
        padding: 7rem 1.5rem 4rem;
        background-color: var(--whitewood);
      `
    } else if ($UserAccountDeletionPage) {
      return `
        min-height: 100vh; 
        padding: 4.4rem 1.5rem 4rem;
        background-color: var(--n20-color);
      `
    } else if ($ContactAddPage || $isNoticeDetail || $isNotificationDetail) {
      return `
        min-height: 100vh; 
        padding: 7rem 1.5rem 4rem;
        background-color: var(--n20-color);
      `
    } else if ($isIntroducePage) {
      return `
        min-height: 100vh; 
        background-color: #212529;
      `
    } else if ($isNotFound) {
      return `
      margin: 0;
      padding: 0 1.5rem;
    `
    } else {
      return `
        margin: 60px auto 0;
        padding: 0 1.5rem;
      `
    }
  }}
`
