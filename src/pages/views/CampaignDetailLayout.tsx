import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSuspenseQuery } from "@tanstack/react-query"
import { getCampaignItem } from "services/campaign"
import Modal from "@/components/Modal"
import ShareModal from "@/components/ShareModal"
import useToast from "@/hooks/useToast"
import useScrollToTop from "@/hooks/useScrollToTop"
import { RoutePath } from "@/types/route-path"
import ContentTab from "@/components/Tab"
import dummyImage from "assets/dummy-image.png"
import { joinReview, cancelReview } from "@/services/review"
import { isModalOpenState } from "@/store/modal-recoil"
import { useRecoilState } from "recoil"
import DetailHeader from "./CampaignDetail/DetailHeader"
import CampaignDetails from "./CampaignDetail/CampaignDetails"
import Notice from "./CampaignDetail/Notice"
import FooterButtons from "./CampaignDetail/FooterButtons"
import useScrollAnimation from "@/hooks/useScrollAnimation"
import GuideDetail from "./CampaignDetail/GuideDetail"
import OnboardingPopup from "@/components/OnboardingPopup"
import styled from "styled-components"

// React Query 키
const CAMPAIGN_ITEM_QUERY_KEY = (campaignCode: string | string) => [
  "campaign",
  campaignCode,
]

const CampaignDetailPage = () => {
  const [selectedTab, setSelectedTab] = useState("info") // 기본선택
  const [isModalOpen, setIsModalOpen] = useRecoilState(isModalOpenState) // Recoil 모달
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false) // 신청 취소 모달 상태
  const [isApplySuccess, setIsApplySuccess] = useState(false) // 신청 성공 여부 상태
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false) // 계정 인증 모달 상태
  const [isRestrictionModalOpen, setIsRestrictionModalOpen] = useState(false) // 계정제한 모달 상태
  const { campaignCode } = useParams()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const { popUpOffsetY, scale } = useScrollAnimation()
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false)
  // const [isProductViewed, setIsProductViewed] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const viewProductRef = useRef<HTMLButtonElement>(null) // 상품보러가기 상태 위치
  //** 모달 상태 관리 */
  const [isRimitModalOpen, setRimitModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState<string>("")
  const [modalContent, setModalContent] = useState<string | React.ReactNode>("")
  const [modalConfirmText, setModalConfirmText] = useState<string>("확인")
  const [modalCancelText, setModalCancelText] = useState<string | undefined>(
    undefined
  )

  //** 캠페인상세 path set */
  useEffect(() => {
    if (campaignCode) {
      sessionStorage.setItem("redirectPath", `/campaign/${campaignCode}`)
    }
  }, [campaignCode])
  // ** 온보딩팝업 */
  useEffect(() => {
    const savedDate = localStorage.getItem("doNotShowOnboardingToday")
    const today = new Date().toDateString()

    if (savedDate !== today) {
      setShowOnboarding(true)
    }
  }, [])
  //** 스크롤 0부터시작 */
  useScrollToTop()
  //** 스크롤다운기능 */
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const windowHeight = window.innerHeight
      const fullHeight = document.documentElement.scrollHeight

      if (scrollTop + windowHeight >= fullHeight - 100) {
        // 페이지 끝에서 100px 전에 상태 변경
        setIsScrolledToBottom(true)
      } else {
        setIsScrolledToBottom(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleButtonClick = () => {
    if (!isScrolledToBottom) {
      // 스크롤 내리기 동작
      window.scrollBy({
        top: window.innerHeight * 0.8, // 한 번에 스크롤할 양
        left: 0,
        behavior: "smooth",
      })
    } else {
      handleApply()
      // if (isProductViewed) {
      //   // '상품 구경하러가기'를 클릭한 경우 캠페인 신청 진행

      // } else {
      //   // '상품 구경하러가기'를 클릭하지 않은 경우 토스트 메시지 표시
      //   addToast(
      //     "'상품 구경하러가기' 클릭 후 신청이 가능해요.",
      //     "warning",
      //     3000,
      //     "campaign"
      //   )
      //   // '상품 구경하러가기' 버튼 위치로 스크롤
      //   viewProductRef.current?.scrollIntoView({
      //     behavior: "smooth",
      //     block: "center",
      //   })
      // }
    }
  }
  //** 탭 설정 */
  const singleTab = [{ label: "캠페인 정보", value: "info" }]
  const handleTabSelect = (tabValue: string) => {
    setSelectedTab(tabValue)
  }

  if (!campaignCode) {
    return <div>유효하지 않은 캠페인 ID입니다.</div>
  }

  //** 캠페인 상세ITEM */
  const { data, error, isFetching, refetch } = useSuspenseQuery({
    queryKey: CAMPAIGN_ITEM_QUERY_KEY(campaignCode),
    queryFn: () =>
      getCampaignItem({
        campaignCode: campaignCode as string,
      }),
    staleTime: 0, // 데이터 즉시 신선하지 않게 설정
    gcTime: 0, // 데이터 캐시 즉시 제거
    retry: 0, // 재요청 횟수
    refetchOnMount: true, // 컴포넌트 마운트 시마다 데이터 재요청
    refetchOnWindowFocus: true, // 창 포커스 시 데이터 재요청
    refetchOnReconnect: true, // 네트워크 재연결 시 데이터 재요청
  })
  if (error && isFetching) {
    throw error
  }

  const campaignDetail = data.campaign
  const reviewStatus = data.review_status

  //** D-Day 계산 */
  const today = new Date()
  const endDate = new Date(campaignDetail.joinEndAt)
  const diffTime = endDate.getTime() - today.getTime()
  const dDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  //** 캠페인신청 모달 열기 [1-1] */
  const handleApply = () => {
    const penalty = sessionStorage.getItem("penalty")
    if (penalty === "step2") {
      setIsRestrictionModalOpen(true)
      setModalTitle("❗신규 캠페인 참여 제한 안내")
      setModalContent(
        <>
          <p>
            캠페인 진행 시 규정을 반복적으로 위반한 사례가 확인되어 “신규 캠페인
            참여”가 제한되었습니다
          </p>
          <p>자세한 사항은 고객센터를 통해 문의해주시기 바랍니다.</p>
        </>
      )
      setModalConfirmText("확인")
      setModalCancelText("확인")
    } else if (penalty === "step3") {
      setIsRestrictionModalOpen(true)
      setModalTitle("❗캠페인 참여 제한 안내")
      setModalContent(
        <>
          <p>
            규정 반복 위반으로 인해 신규 및 진행 중인 캠페인 참여가 모두
            제한되었습니다.
          </p>
          <p>자세한 사항은 고객센터를 통해 문의해주시기 바랍니다.</p>
        </>
      )
      setModalConfirmText("확인")
      setModalCancelText("확인")
    } else {
      const isLoggedIn = localStorage.getItem("email")
      if (isLoggedIn === "null" || isLoggedIn === "") {
        setIsAuthModalOpen(true)
      } else {
        setIsModalOpen(true)
      }
    }
  }

  //** 계정 인증 모달 확인 버튼 핸들러 */
  const handleAuthModalConfirm = () => {
    setIsAuthModalOpen(false)
    navigate(RoutePath.Join)
  }
  // ** 모달에서 캠페인 신청핸들러 [1-2] */
  const handleConfirm = async () => {
    try {
      const data = {
        campaignId: campaignDetail.campaignId,
      }
      const response = await joinReview(data)
      if (response.statusCode === 0) {
        setIsApplySuccess(true)
        refetch()
      }
    } catch (error: any) {
      setIsApplySuccess(false)
      setIsModalOpen(false)
      if (error.errorCode === 3) {
        setRimitModalOpen(true)
        setModalTitle("신청 횟수 초과!")
        setModalContent(
          <>
            <p>신청 가능한 횟수를 초과했어요.</p>
            <p>
              캠페인은 최대 3회까지 진행이 가능해요 <br />
              (1일 1회 참여 가능)
            </p>
          </>
        )
        setModalConfirmText("확인")
        setModalCancelText("확인")
      } else if (error.errorCode === 7) {
        setRimitModalOpen(true)
        setModalTitle("신청 횟수 초과!")
        setModalContent(
          <>
            <p>오늘 신청 가능한 횟수를 초과했어요.</p>
            <p>
              내일 다시 신청해주세요. <br />
              (1일 1회 참여 가능)
            </p>
          </>
        )
        setModalConfirmText("확인")
        setModalCancelText("확인")
      } else {
        setRimitModalOpen(true)
        setModalTitle("신청 횟수 초과!")
        setModalContent(
          <>
            <p>오늘 신청 가능한 횟수를 초과했어요.</p>
            <p>
              내일 다시 신청해주세요. <br />
              (1일 1회 참여 가능)
            </p>
          </>
        )
        setModalConfirmText("확인")
        setModalCancelText("확인")
      }
    }
  }
  //** 모달닫기 핸들러 [1-3] */
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setIsCancelModalOpen(false)
    setIsAuthModalOpen(false)
    if (isApplySuccess) {
      navigate(`/campaign/${campaignCode}`, { replace: true })
    }
  }
  //** 캠페인신청 성공후 핸들러 [1-4] */
  const handleModalConfirm = () => {
    if (isApplySuccess) {
      // 신청 성공 후 '나의 캠페인 내역'으로 이동
      setIsModalOpen(false)
      navigate(RoutePath.MyCampaign)
    } else {
      // 아직 신청을 완료하지 않았을 때는 신청 처리
      handleConfirm()
    }
  }
  //** 캠페인신청 취소 모달 열기 [2-1] */
  const handleCancelOpen = () => {
    setIsCancelModalOpen(true)
  }

  //** 썸네일 */
  const thumbnailUrl = campaignDetail.thumbnailUrl || dummyImage

  //** 상품구경하러가기 버튼 핸들러 */
  const handleViewProduct = () => {
    const url = campaignDetail.snsUrl || "https://naver.com"
    window.open(url, "_blank", "noopener,noreferrer")
    // setIsProductViewed(true) // 버튼 클릭 여부 업데이트
  }

  //** 캠페인신청 취소 핸들러 [2-2] */
  const handleConfirmCancel = async () => {
    try {
      const cancelData = {
        reviewId: data.reviewId,
      }
      const response = await cancelReview(cancelData)
      if (response.statusCode === 0) {
        // 신청 취소 성공 시 처리
        refetch()
        addToast("캠페인 신청이 취소되었습니다.", "check", 1000, "campaign")
        setIsApplySuccess(false) // 신청 성공 상태를 초기화
        setIsCancelModalOpen(false) // 모달 닫기
      }
    } catch (error) {
      addToast(
        "캠페인 신청 취소에 실패했습니다. 다시 시도해주세요.",
        "warning",
        1000,
        "campaign"
      )
    }
  }

  //** 디데이 0일시 join 채우기 */
  const displayJoins = dDay > 0 ? campaignDetail.joins : campaignDetail.quota

  return (
    <>
      {/* 온보딩팝업 */}
      {/* {showOnboarding && (
        <OnboardingPopup onClose={() => setShowOnboarding(false)} />
      )} */}
      {/* 캐시워크때문에 주석처리 */}
      {/* <CampaignDetailBackButton />
      <CampaignDetailShareButton /> */}
      {/* 캐시워크때문에 주석처리 */}
      <ShareModal />
      <DetailHeader imageUrl={thumbnailUrl} scale={scale} />
      <DetailBody>
        {/* PopUp을 DetailBody 내부에 조건부로 렌더링 */}
        <PopUp $offsetY={popUpOffsetY}>
          🎉 신청을 서두르세요! 신청인원 {displayJoins}/{campaignDetail.quota}
        </PopUp>
        <Dday>{`D-${dDay}`}</Dday>
        <Title>{campaignDetail.title}</Title>
        <CampaignDetails
          campaign={campaignDetail}
          handleViewProduct={handleViewProduct}
          ref={viewProductRef}
        />
        <Line />
        <ContentTab
          tabs={singleTab}
          selectedTab={selectedTab}
          onTabSelect={handleTabSelect}
        />

        {/* GuideDetail 이용가이드 */}
        <GuideDetail />
        {/* 유의사항 */}
        <Notice />
        {/* 상세버튼 */}
        <FooterButtons
          campaignDetail={campaignDetail}
          reviewStatus={reviewStatus}
          handleCancelOpen={handleCancelOpen}
          isScrolledToBottom={isScrolledToBottom}
          handleButtonClick={handleButtonClick}
        />
      </DetailBody>
      {/* 신청, 신청완료 모달 */}
      <Modal
        isOpen={isModalOpen}
        onConfirm={handleModalConfirm}
        onCancel={handleCloseModal}
        title={
          isApplySuccess ? (
            "캠페인 신청 완료!"
          ) : (
            <>
              {campaignDetail.title} <br /> 캠페인을 신청하시겠어요?
            </>
          )
        }
        content={
          isApplySuccess ? (
            <>
              <p>
                <em>3시간</em> 안에 상품구매와
              </p>
              <p>구매 영수증 인증을 진행해주세요.</p>
            </>
          ) : (
            <ol>
              <li>
                캠페인은 선착순으로 진행되며, 참여 도중 캠페인이 조기 마감될 수
                있습니다.
              </li>
              <li>
                리워드는 미션 완료 후 캠페인을 신청한 어플&#40;혹은
                웹서비스&#41;을 통해 지급되며, 미션 중 리워드 지급사는 변경할 수
                없습니다.
              </li>
              <li>
                캠페인은 <span>1일 1회 신청</span> 가능하며, 동일한 캠페인에
                대해서는 재신청이 불가합니다.
              </li>
            </ol>
          )
        }
        confirmText={isApplySuccess ? "나의 캠페인 내역" : "신청하기"}
        cancelText={isApplySuccess ? "더 둘러보기" : "취소"}
      />
      {/* 에러처리 모달 */}
      <Modal
        isOpen={isRimitModalOpen}
        title={modalTitle}
        content={modalContent}
        confirmText={modalConfirmText}
        onConfirm={() => setRimitModalOpen(false)}
        onCancel={() => setRimitModalOpen(false)}
      />
      {/* 계정인증 모달 */}
      <Modal
        isOpen={isAuthModalOpen}
        onConfirm={handleAuthModalConfirm}
        onCancel={() => setIsAuthModalOpen(false)}
        title="계정인증을 하시겠습니까?"
        content={
          <>
            <p>
              캠페인은 계정 인증 후 신청이 가능합니다. <br /> 계정 인증을 하러
              가시겠습니까?
            </p>
          </>
        }
        confirmText="계정인증"
        cancelText="아니요"
      />
      {/* 신청취소 모달 */}
      <Modal
        isOpen={isCancelModalOpen}
        onConfirm={handleConfirmCancel}
        onCancel={handleCloseModal}
        title="정말 신청 취소하시겠어요?"
        content={
          <>
            <p>
              신청을 취소할 경우 동일한 캠페인은 <br /> 더이상 신청할 수 없어요!
            </p>
          </>
        }
        confirmText="신청 취소하기"
        cancelText="닫기"
      />
      {/* 계정제한 모달 */}
      <Modal
        isOpen={isRestrictionModalOpen}
        onConfirm={() => setIsRestrictionModalOpen(false)}
        onCancel={() => setIsRestrictionModalOpen(false)}
        title={modalTitle}
        content={modalContent}
        confirmText={modalConfirmText}
        cancelText={modalCancelText}
      />
    </>
  )
}

export default CampaignDetailPage

const Line = styled.div`
  position: relative;
  margin-top: 1.6rem;
  height: 0;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: -1.5rem;
    width: calc(100% + 3rem);
    height: 0.4rem;
    background-color: var(--n20-color);
  }
`

const PopUp = styled.div.attrs<{ $offsetY: number }>(({ $offsetY }) => ({
  style: {
    transform: `translate(-50%, ${$offsetY}px)`,
  },
}))<{ $offsetY: number }>`
  width: calc(100% - 30px);
  position: absolute;
  left: 50%;
  height: 3.8rem;
  display: flex;
  align-items: center;
  justify-content: start;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 1.8rem;
  padding: 0 2rem;
  border: 1px solid var(--white);
  color: var(--purple);
  font-size: var(--font-h5-size);
  font-weight: var(--font-weight-bold);
  line-height: var(--font-bodyL-line-height);
  letter-spacing: var(--font-bodyL-letter-spacing);
  will-change: transform;
  transition: transform 0.2s ease-out;
  z-index: -1;
`

const DetailBody = styled.div`
  position: relative;
  top: -9.9rem;
  padding: 1.9rem 1.5rem 3.6rem;
  background: #fff;
`

const Dday = styled.span`
  border-radius: 30px;
  display: inline-block;
  padding: 0.3rem 0.8rem;
  font-size: var(--font-callout-small-size);
  font-weight: var(--font-callout-small-weight);
  line-height: var(--font-callout-small-line-height);
  letter-spacing: var(--font-callout-small-letter-spacing);
  background: var(--prim-L20);
  color: var(--revu-color);
`

const Title = styled.p`
  margin-top: 1rem;
  font-size: 1.6rem;
  font-weight: var(--font-weight-medium);
  letter-spacing: calc(1.6rem * (-0.3 / 100));
`
