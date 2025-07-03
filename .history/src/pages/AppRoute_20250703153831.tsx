import { lazy } from "react"
import { Route, Routes as ReviewClickRoutes, Navigate } from "react-router-dom"
import { RoutePath } from "types/route-path"
import { HelmetProvider } from "react-helmet-async"
import Layout from "./Layout"
const JoinPage = lazy(() => import("./views/AgreementPage"))
const PersonalTerms = lazy(
  () => import("./views/AgreeToTermsAndCondition/PersonalTerms")
)
const ServiceTerms = lazy(
  () => import("./views/AgreeToTermsAndCondition/ServiceTerms")
)
const JoinVerifyPage = lazy(() => import("./views/AccountVerificationPage"))
const CoupangVerificationPage = lazy(
  () => import("./views/CoupangVerificationPage")
)
const PhoneVerificationPage = lazy(
  () => import("./views/PhoneVerificationPage")
)
const MainPage = lazy(() => import("./views/MainPage"))
const CampaignDetailPage = lazy(() => import("./views/CampaignDetailLayout"))
const CampaignCart = lazy(() => import("./views/CampaignCart"))
const MyCampaignPage = lazy(() => import("./views/MyCampaignPage"))
const MyCampaignDetailLayout = lazy(
  () => import("./views/MyCampaignDetailLayout")
)
const MyPage = lazy(() => import("./views/MyPage"))
const MyPointPage = lazy(() => import("./views/MyPageDetail/MyPointPage"))
const MyServiceGuidePage = lazy(
  () => import("./views/MyPageDetail/MyServicePage")
)
const TermsOfService = lazy(() => import("./views/TermsOfService"))
const PrivacyPolicy = lazy(() => import("./views/PrivacyPolicy"))
const MyEditProfilePage = lazy(
  () => import("./views/MyPageDetail/MyEditProfilePage")
)
const AlertHubPage = lazy(() => import("./views/AlertHubPage"))
const ContactSupport = lazy(
  () => import("./views/AlertPageDetail/ContactSupport")
)
const NotificationDetail = lazy(
  () => import("./views/AlertPageDetail/NotificationDetail")
)
const NoticeDetail = lazy(() => import("./views/AlertPageDetail/NoticeDetail"))
// const RevuIntroducePage = lazy(() => import("./views/RevuIntroducePage"))
const NotFoundPage = lazy(() => import("./views/NotFoundPage"))

export const AppRoute = () => {
  return (
    <HelmetProvider>
      <ReviewClickRoutes>
        {/* Layout을 루트 경로로 지정하고, Outlet으로 자식 라우트를 렌더링 */}
        <Route path="/" element={<Layout />}>
          {/* Introduce 페이지 */}
          {/* <Route path={RoutePath.Introduce} element={<RevuIntroducePage />} /> */}
          {/* main 페이지 */}
          <Route index element={<MainPage />} />
          <Route path={RoutePath.Home} element={<MainPage />} />
          {/* 캠페인상세 페이지 */}
          <Route
            path="campaign/:campaignCode"
            element={<CampaignDetailPage />}
          />
          {/* 인증 페이지 1-1 */}
          <Route path={RoutePath.Join} element={<JoinPage />} />
          {/* 이용약관 */}
          <Route
            path={RoutePath.JoinPersonalTerms}
            element={<PersonalTerms />}
          />
          {/* 개인정보보호 */}
          <Route path={RoutePath.JoinServiceTerms} element={<ServiceTerms />} />
          {/* 인증 페이지 1-2(네이버) */}
          <Route path={RoutePath.JoinVerify} element={<JoinVerifyPage />} />
          {/* 인증 페이지 1-2(쿠팡) */}
          <Route
            path={RoutePath.JoinCoupangVerify}
            element={<CoupangVerificationPage />}
          />
          {/* 인증 페이지 1-3 */}
          <Route
            path={RoutePath.JoinPhoneVerify}
            element={<PhoneVerificationPage />}
          />
          {/* 장바구니 페이지 */}
          <Route path={RoutePath.MyCart} element={<CampaignCart />} />
          {/* 나의 캠페인 페이지 */}
          <Route path={RoutePath.MyCampaign} element={<MyCampaignPage />} />
          {/* 나의 캠페인 detail 페이지 */}
          <Route
            path="my_campaign/:reviewId"
            element={<MyCampaignDetailLayout />}
          />
          {/* 내 정보 */}
          <Route path={RoutePath.UserProfile} element={<MyPage />} />
          {/* 내 정보 포인트 내역 */}
          <Route path={RoutePath.UserPointLog} element={<MyPointPage />} />
          {/* 내 정보 서비스 이용가이드 */}
          <Route
            path={RoutePath.UserServiceGuide}
            element={<MyServiceGuidePage />}
          />
          {/* 내 정보 수정 */}
          <Route
            path={RoutePath.UserEditProfile}
            element={<MyEditProfilePage />}
          />
          {/* 알림허브페이지 */}
          <Route path={RoutePath.Alert} element={<AlertHubPage />} />
          {/* 알림새소식 detail 페이지 */}
          <Route
            path="alert/notification/:notificationId"
            element={<NotificationDetail />}
          />
          {/* 알림공지사항 detail 페이지 */}
          <Route path="alert/notice/:noticeId" element={<NoticeDetail />} />
          {/* 문의등록하기 페이지 */}
          <Route path={RoutePath.ContactAdd} element={<ContactSupport />} />
          {/* 이용약관 */}
          <Route path={RoutePath.TermsOfService} element={<TermsOfService />} />
          {/* 개인정보처리방침 */}
          <Route path={RoutePath.PrivacyPolicy} element={<PrivacyPolicy />} />
          {/* NotFoundPage를 /404 경로에 매핑 */}
          <Route path="/404" element={<NotFoundPage />} />
          {/* 모든 예외 경로를 /404로 리디렉션 */}
          {/* <Route path="*" element={<Navigate to="/404" replace />} /> */}
        </Route>
      </ReviewClickRoutes>
    </HelmetProvider>
  )
}
