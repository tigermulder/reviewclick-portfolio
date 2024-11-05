import { useState } from "react"
import SinglePageHeader from "@/components/SinglePageHeader"
import ContentTab from "@/components/Tab"
import useScrollToTop from "@/hooks/useScrollToTop"
import styled from "styled-components"

const AlertHubPage = () => {
  const [selectedTab, setSelectedTab] = useState("news") // 기본선택
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
    </>
  )
}

export default AlertHubPage
