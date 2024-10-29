import { AppRoute } from "pages/AppRoute"
import { useLocation, useMatch } from "react-router-dom"
import AppBar from "components/AppBar"
import BottomTapBar from "components/BottomTapBar"
import Footer from "components/Footer"
import ToastMassage from "components/ToastMassage"
import GlobalCategoryMenu from "components/GlobalCategoryMenu"
import { RoutePath } from "./types/route-path"
import { useUserStatus } from "./hooks/useUserStatus"
import "./global.css"
import { useSetRecoilState } from "recoil"
import { adDataState } from "./store/adData-recoil"
import { useEffect } from "react"

function App() {
  useUserStatus() // 세션유지
  const location = useLocation();
  const setAdData = useSetRecoilState(adDataState)
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    setAdData({
        uid: urlParams.get('uid') || "",
        cid: urlParams.get('cid') || "",
        adid: urlParams.get('adid') || "",
    });
  }, [location.search, setAdData]);
  const isCampaignDetail = useMatch("/campaign/:campaignId")
  const isReviewDetail = useMatch("/my_campaign/:reviewId")

  const hideAppBar =
    location.pathname === RoutePath.Login ||
    location.pathname === RoutePath.MyCart ||
    location.pathname === RoutePath.Join ||
    location.pathname === RoutePath.FindId ||
    location.pathname === RoutePath.FindPassword ||
    location.pathname === RoutePath.UserPointLog ||
    location.pathname === RoutePath.UserProfile ||
    location.pathname === RoutePath.MyCampaign ||
    location.pathname === RoutePath.UserServiceGuide ||
    isCampaignDetail ||
    isReviewDetail
  const hideTapBar =
    location.pathname === RoutePath.Login ||
    location.pathname === RoutePath.Join ||
    location.pathname === RoutePath.FindId ||
    location.pathname === RoutePath.FindPassword ||
    isCampaignDetail ||
    isReviewDetail
  const showFooter = location.pathname === RoutePath.Home && !isCampaignDetail

  return (
    <div className="App">
      {/* App Bar */}
      {!hideAppBar && <AppBar />}
      {/* 라우팅컴포넌트 */}
      <AppRoute />
      {/* 특정 경로에서만 푸터 렌더링 */}
      {showFooter && <Footer />}
      {/* GlobalCategoryMenu는 항상 렌더링되어야 함 */}
      <GlobalCategoryMenu />
      {/* Bottom Tap Bar */}
      {!hideTapBar && <BottomTapBar />}
      {/* ToastMassage */}
      <ToastMassage />
    </div>
  )
}

export default App
