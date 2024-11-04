import { useState } from "react"
import Button from "@/components/Button"
import useToast from "@/hooks/useToast"
import { StepTwoProps } from "@/types/component-types/my-campaigndetail-type"
import IconNotice from "assets/ico_notice.svg?url"
import IconNoticeArrow from "assets/ico-notice-arrow.svg?url"
import { formatDate } from "@/utils/util"
import { confirmReview } from "@/services/review"
import styled from "styled-components"
import { ReviewConfirmRequest } from "@/types/api-types/review-type"
import Modal from "@/components/Modal"
import { useNavigate } from "react-router-dom"
import { RoutePath } from "@/types/route-path"

const StepTwo = ({
  reviewIdKey,
  thumbnailUrl,
  campaignTitle,
  reward,
  isEnded,
  remainingTime,
  creatTime,
  goToNextStep,
  refetchData,
  setValidatedReviewText,
}: StepTwoProps): JSX.Element => {
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(true)
  const [reviewText, setReviewText] = useState<string>("")
  //** 모달 상태 관리 */
  const [isLoadingModalOpen, setLoadingModalOpen] = useState(false)
  const [isResultModalOpen, setResultModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState<string>("")
  const [modalContent, setModalContent] = useState<string | React.ReactNode>("")
  const [modalConfirmText, setModalConfirmText] = useState<string>("확인")
  const [modalCancelText, setModalCancelText] = useState<string | undefined>(
    undefined
  )
  const [showLinkRouter, setShowLinkRouter] = useState(false)
  const maxChars = 180
  const minChars = 100
  const { addToast } = useToast()
  const navigate = useNavigate()

  //** 유의사항 드롭다운 */
  const toggleGuide = () => {
    setIsGuideOpen(!isGuideOpen)
  }
  //** 리뷰 텍스트 변경 핸들러 */
  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    if (text.length <= maxChars) {
      setReviewText(text)
    } else {
      setReviewText(text.slice(0, maxChars)) // 최대 문자 수 초과 시 자르기
    }
  }
  //** 복사 버튼 핸들러 */
  const handleCopy = () => {
    if (reviewText.trim().length === 0 || reviewText.trim().length < minChars) {
      // 텍스트가 비어있을 경우 토스트 메시지 표시 (옵션)
      addToast("100자이상 입력해주세요", "copy", 1000, "copy")
      return
    }
    navigator.clipboard
      .writeText(reviewText)
      .then(() => {
        addToast("내용이 복사됐어요.", "copy", 1000, "copy")
      })
      .catch((err) => {
        console.error("copy되지 않았습니다.: ", err)
        // 복사 실패 시 에러 처리 (옵션)
      })
  }

  //** 리뷰검수 OCR */
  const handleReviewOcrSave = async () => {
    if (reviewText.trim().length < minChars) {
      addToast("100자 이상 입력해주세요", "copy", 1000, "copy")
      return
    }

    const data: ReviewConfirmRequest = {
      reviewId: Number(reviewIdKey),
      reviewText: reviewText,
    }

    // 로딩 모달 표시
    setLoadingModalOpen(true)

    try {
      const response = await confirmReview(data)
      // const response = {
      //   statusCode: 0,
      // };

      // 로딩 모달 닫기
      setLoadingModalOpen(false)
      if (response.statusCode === 0) {
        // 부모 컴포넌트 상태 업데이트
        setValidatedReviewText(reviewText)
        setModalTitle("📝 거의 다 왔어요!")
        setModalContent(
          <p>
            리뷰 검수가 완료됐어요. <br />
            리뷰를 등록하러 가볼까요?
          </p>
        )
        setModalConfirmText("등록하러가기")
        setModalCancelText("아니요")
        setResultModalOpen(true)
      } else {
        // 리뷰 수정 모달 설정
        setModalTitle("️⛔ 앗, 잠깐!")
        setModalContent(
          <p>
            부정적인 리뷰는
            <br />
            포인트 적립에 영향을 줄 수 있어요.
            <br />
            긍정적인 사용 경험을 중심으로 수정 후<br />
            검수를 다시 받아보세요.
          </p>
        )
        setModalConfirmText("닫기")
        setModalCancelText("작성한 리뷰 수정하기")
        setResultModalOpen(true)
        setShowLinkRouter(true)
      }
    } catch (error) {
      // 로딩 모달 닫기
      setLoadingModalOpen(false)
      setModalTitle("️⛔ 앗, 잠깐!")
      setModalContent(
        <p>
          부정적인 리뷰는
          <br />
          포인트 적립에 영향을 줄 수 있어요.
          <br />
          긍정적인 사용 경험을 중심으로 수정 후<br />
          검수를 다시 받아보세요.
        </p>
      )
      setModalConfirmText("재검수하기")
      setModalCancelText("닫기")
      setResultModalOpen(true)
      setShowLinkRouter(true)
    }
  }

  //** 모달 확인 버튼 핸들러 */
  const handleModalConfirm = async () => {
    setResultModalOpen(false)

    if (modalConfirmText === "등록하러가기") {
      // 데이터 다시 가져오기
      await refetchData()
      // 다음 스텝으로 이동
      goToNextStep()
    } else if (modalConfirmText === "닫기") {
      // 모달 닫기만 수행
    }
  }

  //** 모달 닫기 버튼 핸들러 */
  const handleModalCancel = () => {
    setResultModalOpen(false)
    if (modalConfirmText !== "닫기") {
      navigate(RoutePath.MyCampaign)
    }
  }

  return (
    <>
      {/* 로딩 모달 */}
      <Modal
        isOpen={isLoadingModalOpen}
        isLoading={true}
        onConfirm={function (): void {
          throw new Error("Function not implemented.")
        }}
        onCancel={function (): void {
          throw new Error("Function not implemented.")
        }}
        title={"AI 검수가 진행중이에요"}
        content={
          <>
            <p>
              작성한 리뷰에 이상이 없을 경우
              <br />
              상품 페이지로 이동되며,
              <br />
              작성한 리뷰는 자동으로 복사돼요.
            </p>
          </>
        }
      />
      {/* 결과 모달 */}
      <Modal
        isOpen={isResultModalOpen}
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
        title={modalTitle}
        content={modalContent}
        confirmText={modalConfirmText}
        cancelText={modalCancelText}
        showRouteLink={showLinkRouter}
      />
      <CartTest>
        {/* 상단캠페인 정보 */}
        <CampaignStatus>
          <CampaignTitle>캠페인 정보</CampaignTitle>
          <CampaignStatusCard>
            <CampaignStatusCardThumb>
              <img src={thumbnailUrl} alt="나의캠페인 썸네일" />
              {isEnded && <DimmedBackground />}
              <RemainingDays $isEnded={isEnded}>
                {isEnded ? "종료" : remainingTime}
              </RemainingDays>
            </CampaignStatusCardThumb>
            <StepItemInfoTextBox>
              <CardDate>{formatDate(creatTime)}</CardDate>
              <span>{campaignTitle}</span>
              <p>{reward}P</p>
            </StepItemInfoTextBox>
          </CampaignStatusCard>
        </CampaignStatus>
        {/* 리뷰가이드 및 리뷰작성 */}
        <ReviewTestContainer>
          <GuideContainer>
            <GuideHeader onClick={toggleGuide}>
              <p className="title">작성 가이드</p>
              <img
                src={IconNoticeArrow}
                alt="가이드 토글 아이콘"
                className={`ico_arr ${isGuideOpen ? "active" : ""}`}
              />
            </GuideHeader>
            {isGuideOpen && (
              <GuideContent>
                <ul className="guide-list">
                  <li>
                    <p>글자수는 최소 100자 이상 작성해주세요.</p>
                  </li>
                  <li>
                    <p>
                      본문 첫 줄에 <em>"협찬"문구를 반드시 추가</em>하여
                      작성해주세요.
                    </p>
                  </li>
                  <li>
                    <p>
                      리뷰 작성 &gt; 리뷰 AI 검수 완료 &gt; 상품 랜딩페이지로
                      이동 &gt; 리뷰 등록(작성한 리뷰 붙여넣기)
                    </p>
                  </li>
                  <li>
                    <p>
                      부정적인 글로 작성되는 경우 미션 진행 및 포인트 지급에
                      영향을 줄 수 있으니, 긍정적인 경험을 바탕으로
                      작성해주세요.
                    </p>
                  </li>
                </ul>
              </GuideContent>
            )}
          </GuideContainer>
          <ReviewContent>
            <ReviewHeader>리뷰 작성</ReviewHeader>
            <ReviewTextBox>
              <textarea
                placeholder="상품과 연관이 없거나 성의없는 리뷰 작성 시 포인트 지급 대상자에서 제외됩니다."
                value={reviewText}
                onChange={handleReviewChange}
              />
              <Count>
                <span>{reviewText.length}</span>&nbsp;/180
              </Count>
              <Button $variant="copy" onClick={handleCopy}>
                복사
              </Button>
            </ReviewTextBox>
          </ReviewContent>
        </ReviewTestContainer>
        {/* 픽스된 bottom 버튼 */}
        <BottomButtonContainer>
          <p>
            버튼을 누르면 리뷰 AI 검수가 진행돼요. 검수 완료 후 리뷰를
            등록해주세요!
          </p>
          <Button
            $variant="red"
            disabled={reviewText.trim().length < minChars}
            onClick={handleReviewOcrSave}
          >
            리뷰 검수
          </Button>
        </BottomButtonContainer>
      </CartTest>
    </>
  )
}

export default StepTwo

const CartTest = styled.div`
  padding: 6rem 0 10rem;
`
const CampaignStatus = styled.div`
  position: relative;
  padding: 2rem 1.6rem 2.3rem 2.3rem;
`
const CampaignTitle = styled.p`
  margin-bottom: 1.2rem;
  font-size: var(--font-h5-size);
  font-weight: var(--font-h5-weight);
  line-height: var(--font-h5-line-height);
  letter-spacing: var(--font-h5-letter-spacing);
`

const CampaignStatusCard = styled.div`
  border-radius: 0.8rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const CampaignStatusCardThumb = styled.div`
  position: relative;
  width: 8.1rem;
  height: 8.1rem;
  overflow: hidden;
  border-radius: 1rem;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
  }
`

const DimmedBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
`

interface RemainingDaysProps {
  $isEnded: boolean
}
const RemainingDays = styled.span.attrs<RemainingDaysProps>((props) => ({
  "aria-label": props.$isEnded ? "캠페인이 종료되었습니다" : "캠페인 남은 일수",
  "data-is-ended": props.$isEnded,
}))<RemainingDaysProps>`
  position: absolute;
  bottom: ${({ $isEnded }) => ($isEnded ? "50%" : "0.7rem")};
  left: ${({ $isEnded }) => ($isEnded ? "50%" : "0")};
  transform: ${({ $isEnded }) => ($isEnded ? "translate(-50%, 50%)" : "none")};
  background-color: black;
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 0.2rem;
  font-size: var(--font-caption-size);
  font-weight: var(--font-caption-weight);
  line-height: var(--font-caption-line-height);
  letter-spacing: var(--font-caption-letter-spacing);
  z-index: 2;
`

const StepItemInfoTextBox = styled.div`
  margin-left: 1.4rem;
  flex-grow: 1;
  min-width: 0;

  span {
    width: 100%;
    padding-right: 1rem;
    font-size: var(--font-bodyM-size);
    font-weight: var(--font-bodyM-weight);
    line-height: var(--font-bodyM-line-height);
    letter-spacing: var(--font-bodyM-letter-spacing);
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
  }
  p {
    margin-top: 0.6rem;
    font-size: var(--font-h4-size);
    font-weight: var(--font-h4-weight);
    letter-spacing: var(--font-h4-letter-spacing);
  }
`

const CardDate = styled.span`
  font-size: var(--font-caption-size);
  font-weight: var(--font-caption-weight);
  line-height: var(--font-caption-line-height);
  letter-spacing: var(--font-caption-letter-spacing);
  color: var(--quicksilver);
`

const ReviewTestContainer = styled.div`
  position: relative;
  min-height: 100vh;
  padding: 2.3rem 0 0;
  background: var(--whitewood);

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: -1.5rem; /* 부모의 좌측 패딩 값 */
    width: calc(100% + 3rem); /* 좌우 패딩의 합 */
    height: 100%;
    background-color: var(--n20-color);
    z-index: -1;
  }
`

const GuideContainer = styled.div`
  margin-bottom: 2rem;
`

const GuideHeader = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background: none;
  border: none;
  padding: 1rem;
  cursor: pointer;
  font-size: 1rem;

  .title {
    margin-top: 0;
    font-weight: var(--font-weight-bold);
    font-size: 1.6rem;
    letter-spacing: -1px;
  }

  .ico_arr {
    transition: transform 0.1s ease;
  }

  .ico_arr.active {
    transform: rotate(180deg);
  }
`

const GuideContent = styled.div`
  margin-top: 1.5rem;

  .guide-list {
    padding: 0 1rem;
    font-size: 1.4rem;
    line-height: 1.4;
    background: var(--whitewood);
    color: var(--gray-01);
  }

  .guide-list li {
    position: relative;
    padding-left: 1rem;
    font-size: var(--font-bodyM-size);
    line-height: var(--font-bodyL-line-height);
    letter-spacing: var(--font-bodyM-letter-spacing);
    display: flex;
    align-items: flex-start;
    color: var(--n400-color);
    p em {
      font-weight: var(--font-bodyM-weight);
    }
  }
  .guide-list li:not(:last-of-type) {
    margin-bottom: 0.6rem;
  }
  .guide-list > li::before {
    content: "";
    position: absolute;
    left: 0;
    margin-top: 0.85rem;
    width: 0.3rem;
    height: 0.3rem;
    border-radius: 50%;
    background: var(--gray-01);
    flex-shrink: 0;
  }
`

const ReviewContent = styled.div`
  margin-top: 3.6rem;
`

const ReviewHeader = styled.p`
  padding: 1.2rem 1rem;
  font-weight: var(--font-weight-bold);
  font-size: 1.6rem;
  letter-spacing: -1px;
`

const ReviewTextBox = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
  height: 23rem;
  padding: 1.4rem 1.4rem 4.7rem;
  border-radius: 1rem;
  background-color: #fff;

  textarea {
    display: block;
    width: 100%;
    height: 100%;
    outline: 0;
    border: none;
    &::placeholder {
      font-size: var(--font-bodyL-size);
      line-height: 1.4;
      letter-spacing: var(--font-bodyL-letter-spacing);
      color: var(--n200-color);
    }
  }
`

const BottomButtonContainer = styled.div`
  max-width: 768px;
  min-width: 375px;
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 1.2rem 1.6rem 2.1rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--white);
  border-top: 0.1rem solid var(--n40-color);

  p {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 1.5rem;
    margin-bottom: 1rem;
    font-size: var(--font-callout-small-size);
    font-weight: var(--font-callout-small-weight);
    letter-spacing: var(--font-callout-small-letter-spacing);
    color: var(--n200-color);
    background: url("${IconNotice}") no-repeat left center / 1rem 1rem;
  }
`

const Count = styled.div`
  position: absolute;
  right: 1.6rem;
  bottom: 6rem;
  font-size: 1.4rem;
  color: var(--n200-color);

  span {
    font-weight: var(--font-weight-bold);
    color: var(--primary-color);
  }
`
