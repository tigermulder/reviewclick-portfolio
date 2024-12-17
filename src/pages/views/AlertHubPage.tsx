import SinglePageHeader from "@/components/SinglePageHeader"
import ContentTab from "@/components/Tab"
import FaqButton from "@/components/FaqButton"
import NewsContent from "./AlertPageDetail/NewsContent"
import Announcement from "./AlertPageDetail/Announcement"
import FaqContent from "./AlertPageDetail/FaqContent"
import { useRecoilState } from "recoil"
import { alertSelectedTabState } from "@/store/alerttap-recoil"
import styled from "styled-components"

const AlertHubPage = () => {
  const [selectedTab, setSelectedTab] = useRecoilState(alertSelectedTabState)
  //** 탭 설정 */
  const singleTab = [
    { label: "새소식", value: "news" },
    { label: "FAQ", value: "faq" },
    { label: "공지사항", value: "announcement" },
  ]
  const handleTabSelect = (tabValue: string) => {
    setSelectedTab(tabValue)
  }

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
