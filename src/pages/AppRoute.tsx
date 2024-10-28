import { lazy } from "react"
import { Route, Routes as ReactRouterRoutes } from "react-router-dom"
import { RoutePath } from "types/route-path"
import Layout from "./Layout"
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
        {/* 장바구니 페이지 */}
        <Route path={RoutePath.MyCart} element={<CampaignCart />} />
        {/* 나의 캠페인 페이지 */}
        <Route path={RoutePath.MyCampaign} element={<MyCampaignPage />} />
        {/* 나의 캠페인 페이지 */}
        <Route
          path="/my_campaign/:reviewId"
          element={<MyCampaignDetailLayout />}
        />
      </Route>
    </ReactRouterRoutes>
  )
}
