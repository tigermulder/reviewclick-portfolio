import SinglePageHeader from "@/components/SinglePageHeader"
import ContentTab from "@/components/Tab"
import useScrollToTop from "@/hooks/useScrollToTop"
import FaqButton from "@/components/FaqButton"
import NewsContent from "./AlertPageDetail/NewsContent"
import FaqContent from "./AlertPageDetail/FaqContent"
import { useRecoilState } from "recoil"
import { alertSelectedTabState } from "@/store/alerttap-recoil"

const AlertHubPage = () => {
  const [selectedTab, setSelectedTab] = useRecoilState(alertSelectedTabState)
  //** 탭 설정 */
  const singleTab = [
    { label: "새소식", value: "news" },
    { label: "공지사항/FAQ", value: "faq" },
  ]
  const handleTabSelect = (tabValue: string) => {
    setSelectedTab(tabValue)
  }
  //** 스크롤 0부터시작 */
  useScrollToTop()
  return (
    <>
      {/* 알림 헤더 타이틀 */}
      <SinglePageHeader title="알림" />
      <ContentTab
        tabs={singleTab}
        selectedTab={selectedTab}
        onTabSelect={handleTabSelect}
      />

      {/* 선택된 탭에 따라 콘텐츠 렌더링 */}
      <div>
        {selectedTab === "news" && <NewsContent />}
        {selectedTab === "faq" && <FaqContent />}
      </div>
      <FaqButton />
    </>
  )
}

export default AlertHubPage
