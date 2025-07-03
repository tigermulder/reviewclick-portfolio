import { AppRoute } from "pages/AppRoute"
import { useLocation, useMatch, useParams } from "react-router-dom"
import AppBar from "components/AppBar"
import Navbar from "./components/Navbar"
import Footer from "components/Footer"
import ToastMassage from "components/ToastMassage"
import { RoutePath } from "./types/route-path"
import { logincheck } from "@/services/login"
import "./main.css"
import { useEffect } from "react"
import useToast from "./hooks/useToast"

function App() {
  const { campaignCode } = useParams()
  // const { addToast } = useToast()

  //** 로그인정보 */
  // useEffect(() => {
  //   const checkLoginStatus = async () => {
  //     try {
  //       const data = await logincheck()
  //       if (data.logined === 1) {
  //         // localStorage.setItem("email", data.email)
  //         // localStorage.setItem("userPhoneNumber", data.phone)
  //         // sessionStorage.setItem("authToken", data.token)
  //         // sessionStorage.setItem("spaceName", data.spaceName)
  //         // sessionStorage.setItem("penalty", data.penalty)
  //       }
  //     } catch (error) {
  //       console.error(error)
  //       addToast("로그인 체크 중 오류 발생", 3000, "Join")
  //     }
  //   }
  //   checkLoginStatus()
  // }, [])

  useEffect(() => {
    if (campaignCode) {
      sessionStorage.setItem("redirectPath", `/campaign/${campaignCode}`)
    }
  }, [campaignCode])
  const location = useLocation()
  const isCampaignDetail = useMatch("/campaign/:campaignId")
  const isReviewDetail = useMatch("/my_campaign/:reviewId")
  const isNoticeDetail = useMatch("/alert/notice/:noticeId")
  const isNotificationDetail = useMatch("/alert/notification/:notificationId")
  const isNotFound = location.pathname === RoutePath.NotFound

  const hideAppBar =
    location.pathname === RoutePath.Home ||
    location.pathname === RoutePath.MyCart ||
    location.pathname === RoutePath.Join ||
    location.pathname === RoutePath.JoinPersonalTerms ||
    location.pathname === RoutePath.JoinServiceTerms ||
    location.pathname === RoutePath.JoinVerify ||
    location.pathname === RoutePath.JoinCoupangVerify ||
    location.pathname === RoutePath.JoinPhoneVerify ||
    location.pathname === RoutePath.UserPointLog ||
    location.pathname === RoutePath.UserProfile ||
    location.pathname === RoutePath.MyCampaign ||
    location.pathname === RoutePath.UserServiceGuide ||
    location.pathname === RoutePath.UserEditProfile ||
    location.pathname === RoutePath.UserAccountSetting ||
    location.pathname === RoutePath.UserAccountDeletion ||
    location.pathname === RoutePath.Alert ||
    location.pathname === RoutePath.ContactAdd ||
    location.pathname === RoutePath.TermsOfService ||
    location.pathname === RoutePath.PrivacyPolicy ||
    location.pathname === RoutePath.Introduce ||
    isCampaignDetail ||
    isReviewDetail ||
    isNoticeDetail ||
    isNotificationDetail ||
    isNotFound
  const hideTapBar =
    location.pathname === RoutePath.Join ||
    location.pathname === RoutePath.JoinPersonalTerms ||
    location.pathname === RoutePath.JoinServiceTerms ||
    location.pathname === RoutePath.JoinVerify ||
    location.pathname === RoutePath.JoinCoupangVerify ||
    location.pathname === RoutePath.JoinPhoneVerify ||
    location.pathname === RoutePath.TermsOfService ||
    location.pathname === RoutePath.UserServiceGuide ||
    location.pathname === RoutePath.PrivacyPolicy ||
    location.pathname === RoutePath.UserEditProfile ||
    location.pathname === RoutePath.UserAccountSetting ||
    location.pathname === RoutePath.UserAccountDeletion ||
    location.pathname === RoutePath.ContactAdd ||
    location.pathname === RoutePath.UserPointLog ||
    location.pathname === RoutePath.Introduce ||
    isReviewDetail ||
    isNoticeDetail ||
    isNotificationDetail ||
    isNotFound
  const showFooter =
    (!isCampaignDetail &&
      location.pathname !== RoutePath.MyCampaign &&
      location.pathname !== RoutePath.Alert &&
      location.pathname !== RoutePath.UserPointLog &&
      location.pathname !== RoutePath.UserServiceGuide &&
      location.pathname !== RoutePath.Join &&
      location.pathname !== RoutePath.JoinVerify &&
      location.pathname !== RoutePath.JoinCoupangVerify &&
      location.pathname !== RoutePath.JoinPhoneVerify &&
      location.pathname !== RoutePath.ContactAdd &&
      location.pathname !== RoutePath.TermsOfService &&
      location.pathname !== RoutePath.PrivacyPolicy &&
      location.pathname !== RoutePath.UserEditProfile &&
      location.pathname !== RoutePath.JoinPersonalTerms &&
      location.pathname !== RoutePath.JoinServiceTerms &&
      !isNotificationDetail &&
      !isNoticeDetail &&
      !isReviewDetail) ||
    location.pathname === RoutePath.UserProfile ||
    location.pathname === RoutePath.Home

  return (
    <div className="App">
      {/* App Bar */}
      {!hideAppBar && <AppBar />}
      {/* 라우팅컴포넌트 */}
      <AppRoute />
      {/* 특정 경로에서만 푸터 렌더링 */}
      {showFooter && <Footer />}
      {/* Bottom Tap Bar */}
      {!hideTapBar && <Navbar />}
      {/* ToastMassage */}
      <ToastMassage />
    </div>
  )
}

export default App
