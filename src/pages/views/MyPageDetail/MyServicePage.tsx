import { useState } from "react"
import ReuseHeader from "@/components/ReuseHeader"
import { RoutePath } from "@/types/route-path"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import guideImg from "assets/guide-top.png"
import guideTab01 from "assets/guide-tab-01.png"
import guideTab02 from "assets/guide-tab-02.png"

const MypageServicePage = () => {
  const navigate = useNavigate()

  // 활성화된 탭 상태
  const [activeTab, setActiveTab] = useState<string>("tab01")

  // 탭 클릭 핸들러
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)
  }

  return (
    <>
      <ReuseHeader
        title="서비스 이용가이드"
        onBack={() => navigate(RoutePath.UserProfile, { replace: true })}
      />
      <GuideTop>
        <GuideImage src={guideImg} alt="서비스 이용가이드" />
        {/* 탭메뉴 */}
        <TabList>
          <TabItem
            className={activeTab === "tab01" ? "on" : ""}
            onClick={() => handleTabClick("tab01")}
          >
            상품구매
          </TabItem>
          <TabItem
            className={activeTab === "tab02" ? "on" : ""}
            onClick={() => handleTabClick("tab02")}
          >
            리뷰작성 및 등록
          </TabItem>
        </TabList>
      </GuideTop>

      <GuideWrap>
        {/* 메인 컨텐츠 */}
        <TabContent
          id="tab01"
          className={activeTab === "tab01" ? "on" : "tabcont"}
        >
          <div>
            <img src={guideTab01} alt="상품구매 가이드" />
          </div>
        </TabContent>
        <TabContent
          id="tab02"
          className={activeTab === "tab02" ? "on" : "tabcont"}
        >
          <div>
            <img src={guideTab02} alt="리뷰작성 및 등록 가이드" />
          </div>
        </TabContent>
      </GuideWrap>
    </>
  )
}

export default MypageServicePage

const GuideImage = styled.img`
  width: 100%;
  height: auto;
`

const GuideTop = styled.div`
  position: relative;
`

const GuideWrap = styled.div`
  position: relative;
`

const TabList = styled.ul`
  width: 100%;
  padding: 0 3.3rem;
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-around;
  list-style: none;
`

const TabItem = styled.li`
  width: 50%;
  padding: 1.1rem;
  cursor: pointer;
  text-align: center;
  background-color: #fff;
  border-radius: 2.2rem 2.2rem 0 0;
  font-weight: var(--font-weight-medium);
  color: var(--silver);

  &.on {
    background-color: var(--whitesmoke);
    color: var(--primary-color);
  }
`

const TabContent = styled.div`
  display: none;

  &.on {
    display: block;
  }
`
