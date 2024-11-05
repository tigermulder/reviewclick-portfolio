import { lazy } from "react"
import { Route, Routes as ReactRouterRoutes } from "react-router-dom"
import { RoutePath } from "types/route-path"
import Layout from "./Layout"
import ResetPasswordPage from "./views/ResetPasswordPage"
import MyAccountDeletionPage from "./views/MyPageDetail/MyAccountDeletionPage"
import AlertHubPage from "./views/AlertHubPage"
import ContactSupport from "./views/AlertPageDetail/ContactSupport"
const LoginPage = lazy(() => import("./views/LoginPage"))
const JoinPage = lazy(() => import("./views/JoinPage"))
const MainPage = lazy(() => import("./views/MainPage"))
const CampaignDetailPage = lazy(() => import("./views/CampaignDetailPage"))
const CampaignCart = lazy(() => import("./views/CampaingnCart"))
const FindIdPage = lazy(() => import("./views/FindIdPage"))
const FindPasswordPage = lazy(() => import("./views/FindPasswordPage"))
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
const MySettingPage = lazy(() => import("./views/MyPageDetail/MySettingPage"))

export const AppRoute = () => {
  return (
    <ReactRouterRoutes>
      {/* Layout을 루트 경로로 지정하고, Outlet으로 자식 라우트를 렌더링 */}
      <Route element={<Layout />}>
        {/* main 페이지 */}
        <Route path={RoutePath.Home} element={<MainPage />} />
        {/* 캠페인상세 페이지 */}
        <Route path="/campaign/:campaignId" element={<CampaignDetailPage />} />
        {/* 로그인 페이지 */}
        <Route path={RoutePath.Login} element={<LoginPage />} />
        {/* 회원가입 페이지 */}
        <Route path={RoutePath.Join} element={<JoinPage />} />
        {/* 아이디찾기 페이지 */}
        <Route path={RoutePath.FindId} element={<FindIdPage />} />
        {/* 비밀번호찾기 페이지 */}
        <Route path={RoutePath.FindPassword} element={<FindPasswordPage />} />
        {/* 비밀번호리셋 페이지 */}
        <Route path={RoutePath.ResetPassword} element={<ResetPasswordPage />} />
        {/* 장바구니 페이지 */}
        <Route path={RoutePath.MyCart} element={<CampaignCart />} />
        {/* 나의 캠페인 페이지 */}
        <Route path={RoutePath.MyCampaign} element={<MyCampaignPage />} />
        {/* 나의 캠페인 detail 페이지 */}
        <Route
          path="/my_campaign/:reviewId"
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
        {/* 내 설정 */}
        <Route
          path={RoutePath.UserAccountSetting}
          element={<MySettingPage />}
        />
        {/* 회원탈퇴 */}
        <Route
          path={RoutePath.UserAccountDeletion}
          element={<MyAccountDeletionPage />}
        />
        {/* 알림허브페이지 */}
        <Route path={RoutePath.Alert} element={<AlertHubPage />} />
        {/* 문의등록하기 페이지 */}
        <Route path={RoutePath.ContactAdd} element={<ContactSupport />} />
        {/* 이용약관 */}
        <Route path={RoutePath.TermsOfService} element={<TermsOfService />} />
        {/* 개인정보처리방침 */}
        <Route path={RoutePath.PrivacyPolicy} element={<PrivacyPolicy />} />
      </Route>
    </ReactRouterRoutes>
  )
}
