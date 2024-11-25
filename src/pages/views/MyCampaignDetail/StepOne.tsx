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
  const [showLinkRouter, setShowLinkRouter] = useState(false)

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
      // 로딩 모달 open
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
            <p>
              포인트는 영수증 인증 후 7일 이내에 <br /> 모든 미션을 완료해야
              지급돼요. <br /> 상품을 배송받은 후 리뷰 검수 미션과 <br />
              리뷰 등록&#40;인증&#41; 미션을 진행해 주세요.
            </p>
          )
          setModalConfirmText("나의 캠페인 내역")
          setModalCancelText("닫기")
          setResultModalOpen(true)
        }
      } catch (error) {
        // 로딩 모달 닫기
        setLoadingModalOpen(false)
        setModalTitle("⛔ 인증 실패")
        setModalContent(
          <>
            <p>예시 사진 및 아래 내용을 참고하여 다시 업로드 해주세요.</p>
            <p>영수증의 일부가 잘리지 않도록 전체를 캡쳐해 주세요.</p>
            <p>사진이 흐리거나 어두운 경우, 잘 보이도록 다시 캡쳐해주세요.</p>
            <p>
              문제가 계속될 경우, 1:1 문의 혹은 고객센터로 문의해 주시기
              바랍니다.
            </p>
          </>
        )
        setModalConfirmText("재인증")
        setModalCancelText("닫기")
        setResultModalOpen(true)
        setShowLinkRouter(true)
      } finally {
        // 파일 입력 초기화
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
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
    } else if (modalConfirmText === "나의 캠페인 내역") {
      // 데이터 다시 가져오기
      // await refetchData()
      navigate(RoutePath.MyCampaign)
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
        showRouteLink={showLinkRouter}
      />
      <CartTitle>
        <p>
          3시간 내에 상품 구매하고
          <br />
          온라인 영수증 인증하기
        </p>
      </CartTitle>
      <CartStepContainer>
        <StepItem>
          <StepItemHeader>STEP1. 상품 구매</StepItemHeader>
          <StepItemInfo>
            <StepItemInfoThumb>
              <img src={thumbnailUrl} alt="나의캠페인 썸네일" />
              {/* {isEnded && <DimmedBackground />}
              <RemainingDays $isEnded={isEnded}>
                {isEnded ? "종료" : remainingTime}
              </RemainingDays> */}
            </StepItemInfoThumb>
            <StepItemInfoTextBox>
              <span>{campaignTitle}</span>
              <p>{reward?.toLocaleString()}P</p>
            </StepItemInfoTextBox>
          </StepItemInfo>
          <Button $variant="pink" onClick={handleNavigate}>
            상품 구매하러가기
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
            구매 영수증 업로드
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
  background: var(--white);

  p {
    padding: 7rem 1.5rem 2rem;
    font-size: var(--font-h2-size);
    font-weight: var(--font-h2-weight);
    letter-spacing: var(--font-h2-letter-spacing);
    line-height: var(--base-line-height);
  }
`

const CartStepContainer = styled.ul`
  margin: 0 -1.5rem;
  padding: 2rem 1.5rem 10rem 2.6rem;
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
