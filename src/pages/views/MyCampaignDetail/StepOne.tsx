import styled from "styled-components"
import Button from "@/components/Button"
import IconNotice from "assets/ico_notice.svg?url"
import { StepOneProps } from "@/types/component-types/my-campaigndetail-type"
import { useState, useRef } from "react"
import { authReview } from "@/services/review"
import Modal from "@/components/Modal"
import SampleReviewImage from "assets/pro-sample-review.png"
import { useNavigate } from "react-router-dom"
import { RoutePath } from "@/types/route-path"

const StepOne = ({
  reviewIdKey,
  thumbnailUrl,
  campaignTitle,
  reward,
  isEnded,
  remainingTime,
  campaignsUrl,
  goToNextStep,
  refetchData,
}: StepOneProps): JSX.Element => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [files, setFile] = useState<File | null>(null)
  const navigate = useNavigate()

  //** 모달 상태 관리 */
  const [isLoadingModalOpen, setLoadingModalOpen] = useState(false)
  const [isResultModalOpen, setResultModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState<string>("")
  const [modalContent, setModalContent] = useState<string | React.ReactNode>("")
  const [modalConfirmText, setModalConfirmText] = useState<string>("확인")
  const [modalCancelText, setModalCancelText] = useState<string | undefined>(
    undefined
  )

  //** 버튼 클릭 시 파일 선택 창 열기 */
  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }
  //** 영수증 OCR 핸들러 */
  const handleReceiptOCR = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault()
    const files = event.currentTarget.files
    if (files && reviewIdKey) {
      const file = files[0]
      setFile(file)
      const formData = new FormData()
      formData.append("reviewId", reviewIdKey)
      formData.append("image", file)
      // 로딩 모달 열기
      setLoadingModalOpen(true)

      try {
        const response = await authReview(formData)
        // const response = {
        //   statusCode: 0,
        // };

        // 로딩 모달 닫기
        setLoadingModalOpen(false)
        if (response.statusCode === 0) {
          // 인증 성공 모달 설정
          setModalTitle("👏 영수증 인증 완료!")
          setModalContent(
            "구매 영수증 인증이 완료됐어요. 리뷰 검수를 진행해주세요."
          )
          setModalConfirmText("리뷰검수하기")
          setModalCancelText("닫기")
          setResultModalOpen(true)
        } else {
          // 기타 에러 처리 모달 설정
          setModalTitle("⛔ 인증 실패")
          setModalContent(
            "구매 영수증 내 캠페인 상품과 동일한 상품명, 금액이 표시돼 있어야 해요!"
          )
          setModalConfirmText("재인증")
          setModalCancelText("닫기")
          setResultModalOpen(true)
        }
      } catch (error) {
        // 로딩 모달 닫기
        setLoadingModalOpen(false)
        setModalTitle("⛔ 인증 실패")
        setModalContent(
          "구매 영수증 내 캠페인 상품과 동일한 상품명, 금액이 표시돼 있어야 해요!"
        )
        setModalConfirmText("재인증")
        setModalCancelText("닫기")
        setResultModalOpen(true)
      }
    } else {
      console.warn("파일 또는 reviewId가 누락되었습니다.")
    }
  }

  // 모달 확인 버튼 핸들러
  const handleModalConfirm = async () => {
    setResultModalOpen(false)
    if (modalConfirmText === "재인증") {
      handleButtonClick()
    } else if (modalConfirmText === "리뷰검수하기") {
      // 데이터 다시 가져오기
      await refetchData()
      // 다음 스텝으로 이동
      goToNextStep()
    }
  }

  // 모달 취소 버튼 핸들러
  const handleModalCancel = () => {
    setResultModalOpen(false)
    navigate(RoutePath.MyCampaign)
  }

  // 새 창으로 이동하는 핸들러
  const handleNavigate = () => {
    const url = campaignsUrl
    window.open(url, "_blank")
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
        title={"영수증을 확인 중이에요"}
        content={
          <>
            <p>
              조금만 기다려주세요.
              <br /> 처리가 곧 끝나요!
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
      />
      <CartTitle>
        <p>
          상품 구매하고 <br />
          온라인 영수증 인증하기
        </p>
      </CartTitle>
      <CartStepContainer>
        <StepItem>
          <StepItemHeader>STEP1. 상품 구매</StepItemHeader>
          <StepItemInfo>
            <StepItemInfoThumb>
              <img src={thumbnailUrl} alt="나의캠페인 썸네일" />
              {isEnded && <DimmedBackground />}
              <RemainingDays $isEnded={isEnded}>
                {isEnded ? "종료" : remainingTime}
              </RemainingDays>
            </StepItemInfoThumb>
            <StepItemInfoTextBox>
              <span>{campaignTitle}</span>
              <p>{reward}P</p>
            </StepItemInfoTextBox>
          </StepItemInfo>
          <Button $variant="pink" onClick={handleNavigate}>
            구매하러가기
          </Button>
        </StepItem>
        <StepItem>
          <StepItemHeader>STEP2. 구매 영수증 인증</StepItemHeader>
          <StepNotice>
            구매 영수증 내 캠페인 상품과 동일한 상품명, 금액이 표시돼 있어야
            해요!
          </StepNotice>
          <figure>
            <img src={SampleReviewImage} alt={"기본 영수증 이미지"} />
          </figure>
          <Button $variant="pink" onClick={handleButtonClick}>
            이미지업로드
          </Button>
          {/* 숨겨진 파일 입력 */}
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleReceiptOCR}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
        </StepItem>
      </CartStepContainer>
    </>
  )
}

export default StepOne

const CartTitle = styled.div`
  margin-top: 3.5rem;
  background: var(--white);

  p {
    padding: 5.4rem 1.5rem 2rem;
    font-size: var(--font-h2-size);
    font-weight: var(--font-h2-weight);
    letter-spacing: var(--font-h2-letter-spacing);
    line-height: var(--base-line-height);
  }
`

const CartStepContainer = styled.ul`
  margin: 0 -1.5rem;
  padding: 4rem 1.5rem 0 2.6rem;
  min-height: 100vh;
  background: var(--whitewood);

  li {
    position: relative;
    &::before {
      content: "";
      position: absolute;
      top: 50%;
      right: 100%;
      margin-right: 0.7rem;
      width: 1.3rem;
      height: 1.3rem;
      border-radius: 50%;
      background: var(--n40-color);
    }
  }
  > li:nth-child(1)::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 100%;
    margin-top: 1.8rem;
    margin-right: 1.15rem;
    width: 0.3rem;
    height: 50%;
    background: var(--n40-color);
  }
  > li:nth-child(2)::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 100%;
    transform: translateY(-100%);
    margin-right: 1.15rem;
    margin-top: -0.5rem;
    width: 0.3rem;
    height: 60%;
    background: var(--n40-color);
  }
`

const StepItem = styled.li`
  padding: 1.3rem 1.6rem 1.3rem 1.6rem;
  background: var(--white);
  border-radius: 1.2rem;

  &:nth-of-type(2) {
    margin-top: 2.5rem;
  }

  figure {
    margin: 0.8rem 0 2rem;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`

const StepItemHeader = styled.p`
  margin-bottom: 2.2rem;
  font-size: var(--font-h5-size);
  font-weight: var(--font-h5-weight);
  line-height: var(--font-h5-line-height);
  letter-spacing: var(--font-h5-letter-spacing);
`

const StepItemInfo = styled.div`
  position: relative;
  margin-bottom: 2rem;
  border-radius: 0.8rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const StepItemInfoThumb = styled.div`
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
    font-size: var(--font-h2-size);
    font-weight: var(--font-h2-weight);
    letter-spacing: var(--font-h2-letter-spacing);
  }
`

const StepNotice = styled.span`
  font-size: var(--font-callout-small-size);
  font-weight: var(--font-callout-small-weight);
  line-height: var(--base-line-height);
  letter-spacing: var(--font-callout-small-letter-spacing);
  color: var(--prim-L300);
  display: flex;
  align-items: start;
  gap: 0.3rem;

  &::before {
    content: "";
    width: 1.4rem;
    height: 1.4rem;
    background: url("${IconNotice}") no-repeat center / 100%;
  }
`
