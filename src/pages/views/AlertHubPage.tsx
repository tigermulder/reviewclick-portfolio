import ContentTab from "@/components/Tab"
import FaqButton from "@/components/FaqButton"
import SeoHelmet from "@/components/SeoHelmet"
import NewsContent from "./AlertPageDetail/NewsContent"
import Announcement from "./AlertPageDetail/Announcement"
import FaqContent from "./AlertPageDetail/FaqContent"
import { useRecoilState } from "recoil"
import { alertSelectedTabState } from "@/store/alerttap-recoil"
import { useNavigate } from "react-router-dom"
import ReuseHeader from "@/components/ReuseHeader"
import useScrollToTop from "@/hooks/useScrollToTop"
import styled from "styled-components"

const AlertHubPage = () => {
  const [selectedTab, setSelectedTab] = useRecoilState(alertSelectedTabState)
  const navigate = useNavigate()

  //** 스크롤 0부터시작 */
  useScrollToTop()
  //** 탭 설정 */
  const singleTab = [
    { label: "새소식", value: "news" },
    { label: "FAQ", value: "faq" },
    { label: "공지사항", value: "announcement" },
  ]
  const handleTabSelect = (tabValue: string) => {
    setSelectedTab(tabValue)
  }
  // ** 캠페인상세 이동핸들러 */
  const handleGoBack = () => {
    const redirectPath = sessionStorage.getItem("redirectPath")
    if (redirectPath) {
      navigate(redirectPath)
    } else {
      navigate(-1) // 이전 페이지로 돌아감
    }
  }

  return (
    <>
      <SeoHelmet
        title="리뷰클릭-AlertHub"
        description="리뷰클릭은 제품과 서비스 전반에 걸친 다양한 사용자 리뷰를 한곳에서 제공합니다. 믿을 수 있는 평가와 상세한 리뷰로 현명한 소비를 지원합니다."
      />
      {/* 알림 헤더 타이틀 */}
      <ReuseHeader title="알림" onBack={handleGoBack} />
      <ContentTab
        tabs={singleTab}
        selectedTab={selectedTab}
        onTabSelect={handleTabSelect}
      />

      {/* 선택된 탭에 따라 콘텐츠 렌더링 */}
      <TabContent>
        {selectedTab === "news" && <NewsContent />}
        {selectedTab === "faq" && <FaqContent />}
        {selectedTab === "announcement" && <Announcement />}
      </TabContent>
      <FaqButton />
    </>
  )
}

export default AlertHubPage

const TabContent = styled.div`
  padding-bottom: 16rem;
`
