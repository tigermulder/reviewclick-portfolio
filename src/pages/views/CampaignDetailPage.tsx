import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { keepPreviousData, useSuspenseQuery } from "@tanstack/react-query"
import { useRecoilValue } from "recoil"
import { getCampaignItem } from "services/campaign"
import { formatDate, disCountRate } from "@/utils/util"
import IconNoticeArrow from "assets/ico-notice-arrow.svg?react"
import IconStar from "assets/ico-star.svg?url"
import CampaignDetailBackButton from "@/components/CampaignDetailBackButton"
import CampaignDetailShareButton from "@/components/CampaignDetailShareButton"
import Button from "@/components/Button"
import Modal from "@/components/Modal"
import LikeButton from "@/components/LikeButton"
import ShareModal from "@/components/ShareModal"
import useToast from "@/hooks/useToast"
import useScrollToTop from "@/hooks/useScrollToTop"
import styled from "styled-components"
import { RoutePath } from "@/types/route-path"
import ContentTab from "@/components/Tab"
import dummyImage from "assets/dummy-image.png"
import detailImage from "assets/prd-img.png"
import detailGuideImage from "assets/prd-detail-guide.png"
import { joinReview, cancelReview } from "@/services/review"
import { isModalOpenState } from "@/store/modal-recoil"
import { useRecoilState } from "recoil"

// React Query 키
const CAMPAIGN_ITEM_QUERY_KEY = (campaignCode: string | string) => [
  "campaign",
  campaignCode,
]

const CampaignDetailPage = () => {
  const [selectedTab, setSelectedTab] = useState("info") // 기본선택
  const [isGuideOpen, setIsGuideOpen] = useState(false) // 가이드 표시 여부 상태
  const [popUpOffsetY, setPopUpOffsetY] = useState(-62) // PopUp 위치 상태 추가
  const [scale, setScale] = useState(1) // 배경 이미지 확대 상태
  const [isModalOpen, setIsModalOpen] = useRecoilState(isModalOpenState) // Recoil 모달
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false) // 신청 취소 모달 상태
  const [isApplySuccess, setIsApplySuccess] = useState(false) // 신청 성공 여부 상태
  const [errorCode, setErrorCode] = useState<number | null>(null) // 에러 코드 상태
  const { campaignCode } = useParams()
  const { addToast } = useToast()
  const navigate = useNavigate()

  //** 스크롤 0부터시작 */
  useScrollToTop()

  //** 유의사항 토글버튼 */
  const toggleGuide = () => {
    setIsGuideOpen(true)
  }

  //** 탭 설정 */
  const singleTab = [{ label: "캠페인 정보", value: "info" }]
  const handleTabSelect = (tabValue: string) => {
    setSelectedTab(tabValue)
  }

  //** 애니메이션 효과 */
  useEffect(() => {
    const handleScroll = () => {
      let scrollPosition = window.scrollY
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight
      // 스크롤 위치를 0과 maxScroll 사이로 제한
      const clampedScrollPosition = Math.max(
        0,
        Math.min(scrollPosition, maxScroll)
      )
      // PopUp 위치 업데이트
      let newOffsetY = -62
      if (clampedScrollPosition <= 100) {
        newOffsetY = -62 + (clampedScrollPosition / 100) * 62
      } else {
        newOffsetY = 0
      }
      setPopUpOffsetY(newOffsetY)
      // 배경 이미지 확대 효과 적용 (최상단)
      if (scrollPosition < 0) {
        const scaleFactor = 1 - scrollPosition / 400
        setScale(scaleFactor)
      } else {
        setScale(1)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!campaignCode) {
    return <div>유효하지 않은 캠페인 ID입니다.</div>
  }

  //** 캠페인 상세ITEM */
  const { data, error, isFetching } = useSuspenseQuery({
    queryKey: CAMPAIGN_ITEM_QUERY_KEY(campaignCode),
    queryFn: () =>
      getCampaignItem({
        campaignCode: campaignCode,
      }),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,
  })
  if (error && isFetching) {
    throw error
  }

  const campaignDetail = data.campaign

  //** D-Day 계산 */
  const today = new Date()
  const endDate = new Date(campaignDetail.endAt)
  const diffTime = endDate.getTime() - today.getTime()
  const dDay = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  //** 캠페인신청 모달 열기 [1-1] */
  const handleApply = () => {
    const isLoggedIn = sessionStorage.getItem("email")
    if (!isLoggedIn) {
      addToast("계정인증이 필요합니다.", "warning", 1000, "Join")
      navigate(RoutePath.Join, { replace: true })
      setErrorCode(null)
    } else {
      setIsModalOpen(true)
    }
  }
  // ** 모달에서 캠페인 신청핸들러 [1-2] */
  const handleConfirm = async () => {
    try {
      const data = {
        campaignId: campaignDetail.campaignId,
      }
      const response = await joinReview(data)

      setIsApplySuccess(true)
      setErrorCode(null)
    } catch (error: any) {
      if (error.response && error.response.status === 403) {
        const { statusCode, errorCode } = error.response.data || {}

        // daily limit 에러 처리
        if (statusCode === -1 && errorCode === 7) {
          setIsApplySuccess(false)
          setErrorCode(7)
          return
        }
      }
      addToast("이미신청했습니다.", "warning", 2000, "campaign")
      setErrorCode(null) // 다른 에러 코드 초기화
    }
  }
  //** 모달닫기 핸들러 [1-3] */
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setIsCancelModalOpen(false)
    if (isApplySuccess) {
      navigate(`/campaign/${campaignCode}`, { replace: true })
      setErrorCode(null)
    }
  }
  //** 캠페인신청 성공후 핸들러 [1-4] */
  const handleModalConfirm = () => {
    if (isApplySuccess) {
      // 신청 성공 후 '나의 캠페인 내역'으로 라우팅
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
  //** 캠페인신청 취소 핸들러 [2-2] */
  const handleConfirmCancel = async () => {
    try {
      const data = {
        reviewId: campaignDetail.campaignId,
      }
      const response = await cancelReview(data)

      // 신청 취소 성공 시 처리
      addToast("캠페인 신청이 취소되었습니다.", "check", 2000, "campaign")
      setIsApplySuccess(false) // 신청 성공 상태를 초기화
      setIsCancelModalOpen(false) // 모달 닫기
    } catch (error) {
      addToast(
        "캠페인 신청 취소에 실패했습니다. 다시 시도해주세요.",
        "warning",
        2000,
        "campaign"
      )
    }
  }

  const thumbnailUrl = campaignDetail.thumbnailUrl || dummyImage

  //** 상품구경하러가기 버튼 핸들러 */
  const handleViewProduct = () => {
    const url = campaignDetail.snsUrl || "https://naver.com"
    window.open(url, "_blank", "noopener,noreferrer")
  }

  //** 캠페인 신청조건 */
  const isOpen = data.is_campaign_open
  const isCancellable = data.is_join_cancellable
  const isJoin = data.campaign.is_join
  const isEnable = data.is_join_enable

  const renderButton = () => {
    //** 캠페인이 마감되었거나 정원이 찬 경우 */
    if (isOpen === 0 || data.campaign.quota === data.campaign.joins) {
      return <Button $variant="grey">캠페인 신청 불가</Button>
    }
    //** 이미 참여 중인 경우 */
    if (isJoin === 1) {
      if (isCancellable === 1) {
        //** 참여 중이며 취소가 가능한 경우 */
        return (
          <Button onClick={handleCancelOpen} $variant="grey">
            캠페인 신청 취소하기
          </Button>
        )
      } else {
        //** 참여 중이며 취소가 불가능한 경우 */
        return <Button $variant="disable">캠페인 참여중</Button>
      }
    }
    //** 신청 가능 상태인 경우 */
    if (isEnable === 1) {
      return (
        <Button onClick={handleApply} $variant="red">
          캠페인 신청하기
        </Button>
      )
    }
    //** 그 외의 경우 신청 불가 */
    return <Button $variant="disable">캠페인 신청 불가</Button>
  }

  return (
    <>
      {/* 캐시워크때문에 주석처리 */}
      {/* <CampaignDetailBackButton />
      <CampaignDetailShareButton /> */}
      {/* 캐시워크때문에 주석처리 */}
      <ShareModal />
      <DetailHeader>
        <Background $imageUrl={thumbnailUrl} $scale={scale} />
      </DetailHeader>
      <DetailBody>
        {/* PopUp을 DetailBody 내부에 조건부로 렌더링 */}
        <PopUp $offsetY={popUpOffsetY}>
          🎉 신청을 서두르세요! 신청인원 {campaignDetail.joins}/
          {campaignDetail.quota}
        </PopUp>
        <Dday>{`D-${dDay}`}</Dday>
        <Title>{campaignDetail.title}</Title>
        <Divider />
        <CampaignContainer>
          <CampaignDetails>
            <li>
              <span>신청 마감일</span>
              <DetailInfo>{formatDate(campaignDetail.endAt)}</DetailInfo>
            </li>
            <li>
              <span>미션완료기간</span>
              <DetailInfo>미션 완료 기간 정보 없음</DetailInfo>
            </li>
            <li>
              <span>상품가</span>
              <DetailInfo>{campaignDetail.price.toLocaleString()}원</DetailInfo>
            </li>
            <li>
              <span>적립포인트</span>
              <DetailInfo>{campaignDetail.reward.toLocaleString()}P</DetailInfo>
            </li>
          </CampaignDetails>
        </CampaignContainer>
        <Button $variant="arrow" onClick={handleViewProduct}>
          상품구경하기
        </Button>
        <Line />
        <ContentTab
          tabs={singleTab}
          selectedTab={selectedTab}
          onTabSelect={handleTabSelect}
        />
        <Main>
          <div>
            <ImagePlaceholder />
            {/* GuideCont를 조건부로 렌더링 */}
            {isGuideOpen && (
              <GuideCont>
                <GuideDetail />
              </GuideCont>
            )}
          </div>
          {!isGuideOpen && (
            <ButtonContainer>
              <Button $variant="outlined" onClick={toggleGuide}>
                이용가이드 상세보기
              </Button>
            </ButtonContainer>
          )}
        </Main>
        {/* 유의사항 */}
        <Details open>
          <Summary>
            <NoticeTitle>※ 유의사항 안내</NoticeTitle>
            <IconPlaceholder>
              <StyledIconNoticeArrow />
            </IconPlaceholder>
          </Summary>
          <NoticeBox>
            <li>
              캠페인 상세 페이지 내 URL을 통하여 구매한 건에 대해서만
              인정됩니다.
            </li>
            <li>
              기간 내 영수증 인증 &gt; 리뷰 등록 및 인증이 완료된 후 포인트가
              적립됩니다.
            </li>
            <li>
              영수증 인증 완료 후 7일 이내 남은 미션을 완료해주시기 바랍니다.
              (캠페인 미션 기간 준수)
            </li>
            <li>
              정당한 사유 없이 캠페인 미션 기간 내 리뷰를 등록하지 않거나, 부정
              행위가 적발 될 경우 미션 실패로 간주되며, 포인트는 지급되지
              않습니다.
            </li>
            <li>
              배송 관련 문의는 제품 상세 페이지 내 표시된 담당자 연락처로
              연락하여 조율하시기 바랍니다.
            </li>
            <li>
              배송 지연, 상품 파손 등과 같은 사유로 인하여 진행이 어려운 경우
              고객센터로 문의바랍니다.
            </li>
            <li>
              제공받은 제품 재판매 적발 시 회수는 물론, 법적 조치로 인한
              불이익을 받을 수 있습니다.
            </li>
            <li>작성된 콘텐츠는 최소 6개월 유지해주셔야 합니다.</li>
            <li>
              공정거래위원회 지침에 따른 대가성 문구를 포함해주시기 바랍니다.
            </li>
          </NoticeBox>
        </Details>
        <FooterButtons>
          {/* 찜하기 버튼 */}
          {/* <LikeButton
            categoryId={campaignDetail.categoryId}
            campaignId={campaignDetail.campaignId}
          /> */}
          {/* 캠페인 신청하기 버튼 */}
          {renderButton()}
        </FooterButtons>
      </DetailBody>

      {/* 신청, 신청완료, 신청횟수 모달 */}
      <Modal
        isOpen={isModalOpen}
        onConfirm={handleModalConfirm}
        onCancel={handleCloseModal}
        title={
          isApplySuccess ? (
            "캠페인 신청 완료!"
          ) : errorCode === 7 ? (
            <>하루 신청 한도초과! (1/1)</>
          ) : (
            <>
              {campaignDetail.title} <br /> 캠페인을 신청하시겠어요?
            </>
          )
        }
        content={
          isApplySuccess ? (
            <ol>
              <li>
                캠페인은 <em>선착순으로</em> 진행돼요.
              </li>
              <li>
                반드시 ‘신청하기’ 클릭 후 <em>3시간 이내에</em> 리뷰클릭에서
                제공하는 캠페인 URL을 통해 구매 및 인증 한 건에 대해서만
                캠페인이 인정됩니다.
              </li>
              <li>
                캠페인은 <span>1일 1회 신청</span> 가능해요.
                <br />* 동일 캠페인 재신청 불가
              </li>
            </ol>
          ) : errorCode === 7 ? (
            <>
              <p>
                오늘 신청 가능한 횟수를 초과했어요. <br /> 내일 다시
                신청해주세요.
              </p>
            </>
          ) : (
            <>
              <p>
                <em>3시간</em> 안에 상품구매와
              </p>
              <p>구매 영수증 인증을 진행해주세요.</p>
            </>
          )
        }
        confirmText={isApplySuccess ? "나의 캠페인 내역" : "신청하기"}
        cancelText={
          isApplySuccess ? "더 둘러보기" : errorCode === 7 ? "확인" : "취소"
        }
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

const DetailHeader = styled.div`
  position: relative;
  height: 420px;
`

const Background = styled.div<{
  $imageUrl: string
  $scale: number
}>`
  position: fixed;
  max-width: 768px;
  min-width: 375px;
  top: 0;
  left: 0;
  background-image: url(${(props) => props.$imageUrl});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  width: 100%;
  height: 420px;
  z-index: -10;
  transform: scale(${(props) => props.$scale});
  transition: transform 0.2s ease-out;
`

const PopUp = styled.div.attrs<{ $offsetY: number }>(({ $offsetY }) => ({
  style: {
    transform: `translate(-50%, ${$offsetY}px)`,
  },
}))<{ $offsetY: number }>`
  width: calc(100% - 30px);
  position: absolute;
  left: 50%;
  height: 3.2rem;
  display: flex;
  align-items: center;
  justify-content: start;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 2rem;
  padding: 0 2rem;
  color: var(--purple);
  font-size: var(--font-bodyL-size);
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
  padding: 1.9rem 1.5rem 6.6rem;
  border-radius: 3rem 3rem 0 0;
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
  margin: 1.1rem 0;
  font-size: var(--font-h3-size);
  font-weight: var(--font-h3-weight);
  line-height: var(--font-h3-line-height);
  letter-spacing: var(--font-h3-letter-spacing);
`

const Divider = styled.hr`
  background: var(--n40-color);
  height: 1px;
  border: 0;
`

const CampaignContainer = styled.div`
  width: 100%;
  background-color: #fff;
  border-radius: 10px;
  height: 80px;
  margin: 30px 0 28px 5px;
  padding: 0 0 0 20px;
`

const CampaignDetails = styled.ul`
  position: relative;
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  &:before {
    content: "";
    position: absolute;
    top: 50%;
    left: -1.2rem;
    transform: translateY(-50%);
    width: 1px;
    height: 90%;
    border-left: 0.2rem dashed var(--n40-color);
  }

  li {
    position: relative;
    display: flex;
    justify-content: space-between;
    margin-top: 0.4rem;
    font-size: var(--font-bodyL-size);
    line-height: var(--font-bodyL-line-height);
    letter-spacing: var(--font-bodyL-letter-spacing);

    &::before {
      content: "";
      position: absolute;
      top: 50%;
      left: -1.35rem;
      transform: translateY(-50%);
      width: 0.5rem;
      height: 0.5rem;
      background: var(--n80-color);
      border-radius: 50%;
    }
    &:first-child {
      margin-top: 0;
      color: var(--primary-color);
      &::before {
        background: none;
        background-image: url("${IconStar}");
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        width: 1.3rem;
        height: 1.6rem;
        left: -1.6rem;
      }
      span:first-child,
      span:last-child {
        color: inherit;
      }
    }
    &:not(:first-child) {
      span:first-child {
        color: var(--n300-color);
      }
      span:last-child {
        color: var(--n300-color);
      }
    }
    &:last-child {
      span:first-child,
      span:last-child {
        font-weight: var(--font-bodyM-weight);
      }
    }

    span {
      &:first-child {
        display: block;
        width: 100px;
        flex-shrink: 0;
      }
    }
  }
`

const DetailInfo = styled.span`
  color: #000;
`

const Main = styled.div`
  padding: 1.4rem 0;
`

const ImagePlaceholder = styled.div`
  height: 384px;
  background-image: url("${detailImage}");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
`

const GuideDetail = styled.div`
  height: 1528px;
  background-image: url("${detailGuideImage}");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
`

const GuideCont = styled.div`
  margin-top: 2.2rem;
  border-top: 0.1rem solid var(--n80-color);
  padding: 3rem 0 1.8rem;
`

const ButtonContainer = styled.div`
  padding-top: 5rem;
  margin-top: -3rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #fff 22.19%);
`

const Details = styled.details`
  margin: 2rem 0;
  cursor: pointer;
`

const Summary = styled.summary`
  display: flex;
  align-items: center;
  justify-content: space-between;
  &::-webkit-details-marker {
    display: none;
  }
`

const NoticeTitle = styled.p`
  font-weight: bold;
  font-size: 1.4rem;
`

const IconPlaceholder = styled.div`
  width: 24px;
  height: 24px;
  transition: transform 0.1s ease;
  transform: rotate(180deg);

  details[open] & {
    transform: rotate(0deg);
  }
`

const StyledIconNoticeArrow = styled(IconNoticeArrow)`
  width: 100%;
  height: 100%;
`

const NoticeBox = styled.ul`
  padding: 1.6rem 1.6rem 1.6rem 3.2rem;
  margin-top: 1.5rem;
  border-radius: 1rem;
  background: var(--whitewood);
  color: var(--gray-01);
  font-size: 1.4rem;
  line-height: 1.4;

  li {
    position: relative;
  }
  li:not(:last-child) {
    margin-bottom: 0.2rem;
  }
  li:before {
    content: "";
    display: block;
    position: absolute;
    top: 20%;
    right: 100%;
    transform: translateY(-50%);
    margin-right: 1rem;
    width: 0.3rem;
    height: 0.3rem;
    border-radius: 50%;
    background: var(--gray-01);
  }
`

const FooterButtons = styled.div`
  max-width: 768px;
  min-width: 375px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  position: fixed;
  bottom: 5.9rem;
  left: 0;
  width: 100%;
  background: #fff;
  z-index: 100;
  padding: 1.5rem;
`
