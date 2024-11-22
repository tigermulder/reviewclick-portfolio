import { Outlet, useLocation, useMatch } from "react-router-dom"
import { ContentProps } from "@/types/route-path"
import { RoutePath } from "@/types/route-path"
import styled from "styled-components"

const Layout = () => {
  console.log("Layout 렌더링됨")
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
      >
        {/* 각 페이지별로 다른 콘텐츠를 보여주는 Outlet */}
        <Outlet />
      </Content>
      {/* 각 페이지별로 다른 콘텐츠를 보여주는 Outlet */}
      <Outlet />
    </>
  )
}

export default Layout

const Content = styled.main<ContentProps>``
