import { useState } from "react"
import ReuseHeader from "@/components/ReuseHeader"
import SeoHelmet from "@/components/SeoHelmet"
import { RoutePath } from "@/types/route-path"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import guideTop from "assets/guide-top.png"
import guideTopBg from "assets/guide-top-bg.png"
import guideTab01_01 from "assets/guide01-step01.png"
import guideTab01_02 from "assets/guide01-step02.png"
import guideTab01_03 from "assets/guide01-step03.png"
import guideTab01_04 from "assets/guide01-step04.png"
import guideTab01_05 from "assets/guide01-step05.png"
import guideTab02_01 from "assets/guide02-step01.png"
import guideTab02_02 from "assets/guide02-step02.png"
import guideTab02_03 from "assets/guide02-step03.png"
import guideTab02_04 from "assets/guide02-step04.png"

const MyServicePage = () => {
  const navigate = useNavigate()

  // 활성화된 탭 상태
  const [activeTab, setActiveTab] = useState<string>("tab01")

  // 탭 클릭 핸들러
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)
  }

  return (
    <>
      <SeoHelmet
        title="리뷰클릭-MyServiceGuide"
        description="리뷰클릭은 제품과 서비스 전반에 걸친 다양한 사용자 리뷰를 한곳에서 제공합니다. 믿을 수 있는 평가와 상세한 리뷰로 현명한 소비를 지원합니다."
      />
      <ReuseHeader
        title="서비스 이용가이드"
        onBack={() => navigate(RoutePath.UserProfile, { replace: true })}
      />
      <GuideTop>
        <GuideImage src={guideTop} alt="서비스 이용가이드" />
      </GuideTop>

      <GuideWrap>
        <GuideCont>
          {/* 탭메뉴 */}
          <TabBg>
            <p>꼭 읽어보세요!</p>
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
          </TabBg>

          {/* 메인 컨텐츠 */}
          <TabContent
            id="tab01"
            className={activeTab === "tab01" ? "on" : "tabcont"}
          >
            <StepCont>
              <h4>STEP1. 캠페인 신청</h4>
              <p>
                캠페인 신청 후 <span>1시간 이내</span>
                <br /> 구매 및 영수증인증을 완료해주셔야 합니다.
              </p>
              <ImgBox src={guideTab01_01} alt="STEP1. 캠페인 신청" />
            </StepCont>
            <StepCont>
              <h4>STEP2. 상품 구매</h4>
              <p>
                &#91;나의 캠페인&#93; &gt; '상품 구매' &gt; '구매하러 가기'
                <br />
                <em>
                  ※ 반드시 리뷰클릭에서 제공하는 상품 URL로 접속 후 선구매를
                  진행해주세요.
                </em>
              </p>
              <ImgBox src={guideTab01_02} alt="STEP2. 상품 구매" />
            </StepCont>
            <StepCont>
              <h4>STEP3. 상품 결제내역 확인</h4>
              <p>
                &#91;네이버 앱/웹&#93; &gt; 'pay' 아이콘 &gt; 하단 '결제' 아이콘
                &gt; 결제한 상품의 '주문상세' 혹은 '결제상세' 클릭
              </p>
              <ImgBox src={guideTab01_03} alt="STEP3. 상품 결제내역 확인" />
            </StepCont>
            <StepCont>
              <h4>STEP4. 구매영수증 캡쳐</h4>
              <p>'영수증' &gt; '구매영수증' &gt; 구매영수증 캡쳐</p>
              <ImgBox src={guideTab01_04} alt="STEP4. 구매영수증 캡쳐" />
              <p>
                <em>※ 샘플 영수증과 동일하게 이미지 캡쳐</em>
              </p>
            </StepCont>
            <StepCont>
              <h4>STEP5. 구매영수증 업로드</h4>
              <p>&#91;나의 캠페인&#93; &gt; '상품구매' &gt; '이미지 업로드'</p>
              <ImgBox src={guideTab01_05} alt="STEP5. 구매영수증 업로드" />
            </StepCont>
          </TabContent>
          <TabContent
            id="tab02"
            className={activeTab === "tab02" ? "on" : "tabcont"}
          >
            <StepCont>
              <h4>STEP1. 리뷰 작성</h4>
              <p>
                &#91;나의 캠페인&#93; &gt; '리뷰검수' <br />
                <em>
                  ※ 리뷰 등록 시 첫 줄에 &#91;포인트적립&#93; 문구를
                  입력해주세요.
                </em>
              </p>
              <Desc>
                긍정적인 경험을 바탕으로 작성해주세요.(100~180자 이내)
              </Desc>
              <ImgBox src={guideTab02_01} alt="STEP1. 리뷰 작성" />
            </StepCont>
            <StepCont>
              <h4>STEP2. 리뷰 AI 검수</h4>
              <p>
                1. 긍정인 경우: 리뷰 검수 완료 <br />
                2. 부정/중립인 경우: 리뷰 재수정 진행
              </p>
              <ImgBox src={guideTab02_02} alt="STEP2. 리뷰 AI 검수" />
            </StepCont>
            <StepCont>
              <h4>STEP3. 리뷰 등록 후 캡쳐</h4>
              <p>
                [나의 캠페인] &gt; '리뷰등록' &gt; '등록하러가기(자동복사)' &gt;
                '리뷰쓰기' &gt; 검수완료 된 내용 붙여넣기
              </p>
              <ImgBox src={guideTab02_03} alt="STEP3. 리뷰 등록 후 캡쳐" />
              <p>
                <em>
                  ※ 네이버 리뷰 상세 페이지 &gt; 리뷰 탭 &gt; 최신순 정렬 등록한
                  리뷰 캡쳐
                </em>
              </p>
            </StepCont>
            <StepCont>
              <h4>STEP4. 리뷰 캡쳐본 업로드</h4>
              <p>
                [나의 캠페인] &gt; '리뷰등록' &gt; '이미지 업로드'
                <br />
                <em>
                  ※ 적립된 포인트는 '마이페이지' &gt; '포인트 적립내역' 에서
                  확인할 수 있습니다.
                </em>
              </p>
              <ImgBox src={guideTab02_04} alt="STEP4. 리뷰 캡쳐본 업로드" />
            </StepCont>
          </TabContent>
        </GuideCont>
      </GuideWrap>
    </>
  )
}

export default MyServicePage

const GuideImage = styled.img`
  width: 100%;
  height: auto;
`

const GuideTop = styled.div`
  position: relative;
`

const GuideWrap = styled.div`
  position: relative;
  padding: 1.6rem 1.6rem 4rem;
  top: -8rem;
`

const GuideCont = styled.div`
  position: relative;
  z-index: 1;
  padding: 1.6rem 1.6rem 4.6rem;
  background-color: white;
  border-radius: 1.2rem;
`

const TabBg = styled.div`
  padding-top: 4rem;
  text-align: center;
  font-size: var(--font-h3-size);
  background: url("${guideTopBg}") no-repeat center / cover;
  color: rgba(255, 255, 255, 0.94);
`

const TabList = styled.ul`
  margin-top: 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const TabItem = styled.li`
  width: 50%;
  padding: 0.9rem 0;
  cursor: pointer;
  text-align: center;
  background-color: var(--WSmoke);
  border-radius: 2.2rem 2.2rem 0 0;
  font-size: var(--font-body-size);
  font-weight: var(--font-medium);
  color: var(--Silver);

  &.on {
    background-color: white;
    color: var(--RevBlack);
  }
`

const TabContent = styled.div`
  display: none;

  &.on {
    display: block;
  }
`

const StepCont = styled.div`
  padding-top: 7.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  h4 {
    padding: 0.5rem 1.6rem;
    font-size: var(--font-body-size);
    border-radius: 3rem;
    color: white;
    background-color: var(--Purple);
  }
  p {
    margin-top: 2rem;
    padding: 0 0.5rem;
    font-size: var(--font-body-size);
    color: var(--N600);
    em {
      color: var(--Purple);
    }
    span {
      color: var(--L300);
    }
  }
`

const Desc = styled.span`
  margin-top: 3rem;
  font-size: var(--caption-size);
  color: var(--N300);
`

const ImgBox = styled.img`
  margin-top: 2rem;
  max-width: 15.5rem;
  width: 100%;
`
