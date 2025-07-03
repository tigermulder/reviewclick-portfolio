import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSuspenseQuery } from "@tanstack/react-query"
import { getCampaignItem } from "services/campaign"
import { checkAdAndGetLandingUrl } from "services/ads"
import SeoHelmet from "@/components/SeoHelmet"
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

const CAMPAIGN_ITEM_QUERY_KEY = (campaignCode: string | string) => [
  "campaign",
  campaignCode,
]
const TTL = 3 * 60 * 60 * 1000 // TTL: 3시간

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
  const [shouldAnimateButton, setShouldAnimateButton] = useState(false)

  if (!campaignCode) {
    return <div>유효하지 않은 캠페인 ID입니다.</div>
  }

  // campaignCode별 key
  const storageKey = `isProductViewed_${campaignCode}`
  const loadIsProductViewed = () => {
    const item = localStorage.getItem(storageKey)
    if (!item) return false
    try {
      const { value, timestamp } = JSON.parse(item)
      const now = Date.now()
      // TTL 만료 확인
      if (now - timestamp > TTL) {
        // 만료 시 키 삭제
        localStorage.removeItem(storageKey)
        return false
      }
      return value === "true"
    } catch {
      return false
    }
  }

  const [isProductViewed, setIsProductViewed] = useState(() =>
    loadIsProductViewed()
  )

  const [showOnboarding, setShowOnboarding] = useState(false) // 온보딩팝업 상태
  const viewProductRef = useRef<HTMLButtonElement>(null) // 상품보러가기 버튼 위치
  const [isRimitModalOpen, setRimitModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState<string>("")
  const [modalContent, setModalContent] = useState<string | React.ReactNode>("")
  const [modalConfirmText, setModalConfirmText] = useState<string>("확인")
  const [modalCancelText, setModalCancelText] = useState<string | undefined>(
    undefined
  )
  const [deadline, setDeadline] = useState(false)

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

    if (savedDate === today) {
      setShowOnboarding(false)
    } else {
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

  //** 상품을 보고 온 경우 자동으로 페이지 끝으로 스크롤 */
  useEffect(() => {
    const json = localStorage.getItem(storageKey)
    if (json !== null && json !== undefined) {
      const ViewedObj = JSON.parse(json)
      if (ViewedObj.value) {
        window.scrollTo(0, document.body.scrollHeight)
      }
    }
  }, [isProductViewed])

  const handleButtonClick = () => {
    if (!isScrolledToBottom) {
      // 스크롤 내리기 동작
      window.scrollBy({
        top: window.innerHeight * 1.2,
        left: 0,
        behavior: "smooth",
      })
    } else {
      if (isProductViewed) {
        // '상품 구경하러가기'를 클릭한 경우 캠페인 신청 진행
        handleApply()
      } else {
        // '상품 구경하러가기'를 클릭하지 않은 경우 토스트 메시지 표시
        addToast(
          "'상품 구경하러가기' 클릭 후 신청이 가능해요.",
          3000,
          "campaign"
        )
        // '상품 구경하러가기' 버튼 위치로 스크롤
        viewProductRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })

        // 스크롤 후 약간의 지연시간 뒤에 애니메이션 적용
        setTimeout(() => {
          setShouldAnimateButton(true)
        }, 500)
      }
    }
  }

  //** 탭 설정 */
  const singleTab = [{ label: "캠페인 정보", value: "info" }]
  const handleTabSelect = (tabValue: string) => {
    setSelectedTab(tabValue)
  }

  //** 캠페인 상세ITEM */
  const { data, refetch } = useSuspenseQuery({
    queryKey: CAMPAIGN_ITEM_QUERY_KEY(campaignCode),
    queryFn: () =>
      getCampaignItem({
        campaignCode: campaignCode as string,
      }),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: false,
  })

  const campaignDetail = data.campaign
  const reviewStatus = data.review_status

  //** D-Day 계산 */
  const today = new Date()
  const endDate = new Date(campaignDetail.joinEndAt || campaignDetail.endAt)
  const diffTime = endDate.getTime() - today.getTime()
  const dDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  let dDayText = ""
  if (dDay === 0) {
    dDayText = "D-Day"
  } else if (dDay < 0) {
    dDayText = "신청마감"
  } else {
    dDayText = `D-${dDay}`
  }

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
      const isPhoneVerify = localStorage.getItem("userPhoneNumber")
      if (isLoggedIn === "null" || isLoggedIn === "") {
        setIsAuthModalOpen(true)
        setModalTitle("계정인증을 하시겠습니까?")
        setModalContent(
          <>
            <p>
              캠페인은 계정 인증 후 신청이 가능합니다. <br /> 계정 인증을 하러
              가시겠습니까?
            </p>
          </>
        )
        setModalConfirmText("계정인증")
        setModalCancelText("아니요")
      } else {
        if (
          isPhoneVerify === null ||
          isPhoneVerify === undefined ||
          isPhoneVerify === "" ||
          isPhoneVerify === "null"
        ) {
          setIsAuthModalOpen(true)
          setModalTitle("휴대폰번호 인증을 해주세요.")
          setModalContent(
            <>
              <p>
                리뷰클릭 서비스를 이용하시려면 <br /> 휴대폰 인증이 필요합니다.
              </p>
              <p>
                인증이 완료 후에는 캠페인 진행 상황과 1:1 문의에 대한 카카오
                알림톡을 받아보실 수 있습니다.
              </p>
            </>
          )
          setModalConfirmText("휴대폰 인증")
          setModalCancelText("아니요")
        } else {
          setIsModalOpen(true)
        }
      }
    }
  }

  //** 계정 인증 모달 확인 버튼 핸들러 */
  const handleAuthModalConfirm = () => {
    setIsAuthModalOpen(false)
    if (modalConfirmText === "계정인증") {
      navigate(RoutePath.Join)
    } else {
      navigate(RoutePath.JoinPhoneVerify)
    }
  }
  // ** 모달에서 캠페인 신청핸들러 [1-2] */
  const handleConfirm = async () => {
    try {
      const dataObj = {
        campaignId: campaignDetail.campaignId,
      }
      const response = await joinReview(dataObj)
      if (response.statusCode === 0) {
        setIsApplySuccess(true)
        refetch()
      }
    } catch (error: any) {
      const errorCode = error.response.data.errorCode
      setIsApplySuccess(false)
      setIsModalOpen(false)
      if (errorCode === 3) {
        setRimitModalOpen(true)
        setModalTitle("❗ 신청 횟수 초과!")
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
      } else if (errorCode === 6) {
        setRimitModalOpen(true)
        setModalTitle("❗ 캠페인 신청 불가")
        setModalContent(
          <>
            <p>이 캠페인은 현재 신청이 불가합니다.</p>
            <p>
              오픈 전이거나 이미 종료된 캠페인이니, <br />
              다른 캠페인을 확인해 주세요.
            </p>
          </>
        )
        setModalConfirmText("확인")
        setModalCancelText("확인")
      } else if (errorCode === 7) {
        setRimitModalOpen(true)
        setModalTitle("❗ 신청 횟수 초과!")
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
  const handleViewProduct = async () => {
    let url = campaignDetail.snsUrl || "https://naver.com"

    // B2 광고 시스템을 통한 추적 URL 생성
    if (campaignDetail.adCode) {
      try {
        const userUid =
          localStorage.getItem("email") || sessionStorage.getItem("authToken")
        const adCheckData = {
          adCode: campaignDetail.adCode,
          uid: userUid || undefined,
          advId: campaignDetail.advertiserId.toString(),
        }

        const response = await checkAdAndGetLandingUrl(adCheckData)
        if (response.statusCode === 0 && response.landingUrl) {
          url = response.landingUrl
          console.log("B2 추적 URL 생성 성공:", url)
        } else {
          console.warn("B2 API 응답 오류, 기본 URL 사용:", response.message)
        }
      } catch (error) {
        console.error("B2 API 호출 실패, 기본 URL 사용:", error)
        addToast(
          "상품 링크를 생성하는데 문제가 발생했습니다.",
          2000,
          "campaign"
        )
      }
    }

    // URL 열기
    window.open(url, "_blank", "noopener,noreferrer")
    setIsProductViewed(true)
    const now = Date.now()
    localStorage.setItem(
      storageKey,
      JSON.stringify({ value: "true", timestamp: now })
    )
    // 상품보러가기 후에는 애니메이션 해제
    setShouldAnimateButton(false)
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
        addToast("캠페인 신청이 취소되었습니다.", 3000, "campaign")
        setIsApplySuccess(false) // 신청 성공 상태 초기화
        setIsCancelModalOpen(false) // 모달 닫기
        // 상품보러가기 상태도 초기화
        setIsProductViewed(false)
        const now = Date.now()
        localStorage.setItem(
          storageKey,
          JSON.stringify({ value: "false", timestamp: now })
        )
      }
    } catch (error) {
      addToast(
        "캠페인 신청 취소에 실패했습니다. 다시 시도해주세요.",
        3000,
        "campaign"
      )
    }
  }

  //** 디데이 -일시 join 채우기 */
  const displayJoins = dDay >= 0 ? campaignDetail.joins : campaignDetail.quota

  //** 인원 마감시 버튼 상태 */
  useEffect(() => {
    if (displayJoins === campaignDetail.quota) {
      setDeadline(true)
    }
  }, [displayJoins, campaignDetail.quota])

  return (
    <>
      <SeoHelmet
        title="리뷰클릭-Campaign Detail"
        description="리뷰클릭은 제품과 서비스 전반에 걸친 다양한 사용자 리뷰를 한곳에서 제공합니다. 믿을 수 있는 평가와 상세한 리뷰로 현명한 소비를 지원합니다."
      />
      {/* 온보딩팝업 */}
      {showOnboarding && (
        <OnboardingPopup onClose={() => setShowOnboarding(false)} />
      )}
      <ShareModal />
      <DetailHeader imageUrl={thumbnailUrl} scale={scale} />
      <DetailBody>
        <PopUp $offsetY={popUpOffsetY}>
          🎉 신청을 서두르세요! 신청인원 {displayJoins}/{campaignDetail.quota}
        </PopUp>
        <Dday>{dDayText}</Dday>
        <Title>{campaignDetail.title}</Title>
        <CampaignDetails
          campaign={campaignDetail}
          handleViewProduct={handleViewProduct}
          ref={viewProductRef}
          shouldAnimateButton={shouldAnimateButton}
        />
        <Line />
        <CustomTap>
          <ContentTab
            tabs={singleTab}
            selectedTab={selectedTab}
            onTabSelect={handleTabSelect}
          />
        </CustomTap>
        <GuideDetail />
        <Notice />
        <FooterButtons
          campaignDetail={campaignDetail}
          reviewStatus={reviewStatus}
          handleCancelOpen={handleCancelOpen}
          isScrolledToBottom={isScrolledToBottom}
          handleButtonClick={handleButtonClick}
          deadlineStatus={deadline}
        />
      </DetailBody>
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
                <em>1시간</em> 안에 상품구매와
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
      <Modal
        isOpen={isRimitModalOpen}
        title={modalTitle}
        content={modalContent}
        confirmText={modalConfirmText}
        cancelText={modalCancelText}
        onConfirm={() => setRimitModalOpen(false)}
        onCancel={() => setRimitModalOpen(false)}
      />
      <Modal
        isOpen={isAuthModalOpen}
        onConfirm={handleAuthModalConfirm}
        onCancel={() => setIsAuthModalOpen(false)}
        title={modalTitle}
        content={modalContent}
        confirmText={modalConfirmText}
        cancelText={modalCancelText}
      />
      <Modal
        isOpen={isCancelModalOpen}
        onConfirm={handleConfirmCancel}
        onCancel={handleCloseModal}
        title="정말 신청 취소하시겠어요?"
        content={
          <>
            <p>
              한 번 취소하면 해당 캠페인에 다시 참여 <br />
              할 수 없어요. 취소 완료 후 다른 캠페인 <br />
              참여는 가능해요!
            </p>
          </>
        }
        confirmText="신청 취소하기"
        cancelText="닫기"
      />
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
    background-color: var(--N20);
  }
`

const PopUp = styled.div.attrs<{ $offsetY: number }>(({ $offsetY }) => ({
  style: {
    transform: `translate(-50%, ${$offsetY}px)`,
  },
}))<{ $offsetY: number }>`
  width: 92.775%;
  position: absolute;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: start;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 1.8rem;
  padding: 0.75rem 1.6rem;
  border: 1px solid white;
  color: var(--Purple);
  font-size: var(--font-h5-size);
  font-weight: var(--font-bold);
  will-change: transform;
  transition: transform 0.2s ease-in-out;
  z-index: -1;
`

const DetailBody = styled.div`
  position: relative;
  top: -9.9rem;
  padding: 1.6rem 1.6rem 3.2rem;
  background-color: white;
`

const CustomTap = styled.div`
  margin-top: 3.6rem;
`

const Dday = styled.span`
  border-radius: 3rem;
  display: inline-block;
  padding: 0.4rem 1rem;
  font-size: 1.1rem;
  background-color: var(--L20);
  color: var(--L300);
`

const Title = styled.h4`
  margin-top: 1rem;
  font-weight: var(--font-medium);
  letter-spacing: calc(1.6rem * (-0.3 / 100));
`
