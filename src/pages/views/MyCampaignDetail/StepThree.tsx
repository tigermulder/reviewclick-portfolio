import styled from "styled-components"
import Button from "@/components/Button"
import IconNotice from "assets/ico_notice.svg?url"
import { StepThreeProps } from "@/types/component-types/my-campaigndetail-type"
import { useState, useRef } from "react"
import { uploadReview } from "@/services/review"
import SampleReviewImage from "assets/pro-sample-text.png"
import Modal from "@/components/Modal"
import { useNavigate } from "react-router-dom"
import useToast from "@/hooks/useToast"
import { RoutePath } from "@/types/route-path"

const StepThree = ({
  reviewIdKey,
  validatedReviewText,
  goToNextStep,
  refetchData,
  LOCAL_STORAGE_KEY,
}: StepThreeProps): JSX.Element => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [files, setFile] = useState<File | null>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { addToast } = useToast()

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
        const response = await uploadReview(formData)
        console.log(response)
        // const response = {
        //   statusCode: 0,
        // };

        // 로딩 모달 닫기
        setLoadingModalOpen(false)
        if (response.statusCode === 0) {
          setModalTitle("리뷰 확인 중")
          setModalContent(
            <>
              <p>
                리뷰 인증 요청이 접수되었습니다. <br />
                인증이 정상적으로 완료되면 <br />
                3시간 이내 리워드가 지급됩니다. <br />
                실패할 경우 <br />
                다시 리뷰 인증을 진행해 주세요.
              </p>
            </>
          )
          setModalConfirmText("리뷰검수하기")
          setModalCancelText("확인")
          setResultModalOpen(true)
          // 로컬스토리지 복사텍스트 삭제
          localStorage.removeItem(LOCAL_STORAGE_KEY)
        }
      } catch (error) {
        setModalTitle("⛔ 앗, 잠깐!")
        setModalContent(
          <>
            <p>
              등록한 실리뷰를 확인할 수 없어요.
              <br />
              검수 완료된 리뷰의 내용과
              <br />
              동일하게 리뷰를 등록한 후 다시 요청해주세요.
            </p>
          </>
        )
        setModalConfirmText("다시시도")
        setModalCancelText("나의 캠페인 내역")
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
    if (modalConfirmText === "다시시도") {
      setLoadingModalOpen(false)
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
    if (modalCancelText === "나의 캠페인 내역") {
      setResultModalOpen(false)
      navigate(RoutePath.MyCampaign)
    } else {
      setResultModalOpen(false)
      navigate(RoutePath.UserPointLog)
    }
  }

  // 새 창으로 이동하는 핸들러
  const handleNavigate = () => {
    if (textRef.current) {
      const text = textRef.current.textContent || ""

      if (navigator.clipboard && window.isSecureContext) {
        // 클립보드 API 사용
        navigator.clipboard
          .writeText(text)
          .then(
            () => {
              addToast("리뷰 내용이 복사되었어요.", "copy", 1000, "copy")
            },
            (err) => {
              console.error("복사 실패:", err)
              addToast("복사에 실패했습니다.", "copy", 1000, "copy")
            }
          )
          .finally(() => {
            // 링크로 이동
            const url =
              "https://new-m.pay.naver.com/historybenefit/paymenthistory?page=1"
            window.open(url, "_blank")
          })
      } else {
        // 텍스트 영역을 사용한 복사
        const textArea = document.createElement("textarea")
        textArea.value = text
        textArea.style.position = "fixed" // 화면 밖에 위치하도록 설정
        textArea.style.left = "-999999px"
        textArea.style.top = "-999999px"
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()

        try {
          document.execCommand("copy")
          addToast("리뷰 내용이 복사되었어요.", "copy", 1000, "copy")
        } catch (err) {
          console.error("복사 실패:", err)
          addToast("복사에 실패했습니다.", "copy", 1000, "copy")
        } finally {
          document.body.removeChild(textArea)
          const url =
            "https://new-m.pay.naver.com/historybenefit/paymenthistory?page=1"
          window.open(url, "_blank")
        }
      }
    } else {
      addToast("복사할 내용이 없습니다.", "copy", 1000, "copy")
      // 텍스트가 없어도 링크로 이동
      const url =
        "https://new-m.pay.naver.com/historybenefit/paymenthistory?page=1"
      window.open(url, "_blank")
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
        title={"리뷰를 확인중이에요"}
        content={
          <>
            <p>
              등록한 실리뷰를 확인하고 있어요.
              <br />
              문제가 없으면 포인트가 바로 지급됩니다.
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
          리뷰 등록하고 <br />
          실제 리뷰 확인받기
        </p>
      </CartTitle>
      <CartStepContainer>
        <StepItem>
          <StepItemHeader>STEP1. 리뷰등록</StepItemHeader>
          <StepItemReviewContainer>
            <StepItemReviewBox ref={textRef}>
              {validatedReviewText}
            </StepItemReviewBox>
          </StepItemReviewContainer>
          <StepItemReviewText>
            ‘등록하러가기’ 클릭 시 검수 완료된 리뷰와 경제적 이해관계를 명시하는
            &lt;협찬&gt; 문구가 자동 입력 및 복사되며, ‘리뷰어’는 이에
            동의합니다.
          </StepItemReviewText>
          <Button $variant="pink" onClick={handleNavigate}>
            리뷰 등록하러가기
          </Button>
        </StepItem>
        <StepItem>
          <StepItemHeader>STEP2. 실제 리뷰 확인</StepItemHeader>
          <StepNotice>
            구매 영수증 내 캠페인 상품과 동일한 상품명, 금액이 표시돼 있어야
            해요!
          </StepNotice>
          <figure>
            {/* 동적 배경 이미지 적용 */}
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

export default StepThree

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
  padding: 4rem 1.5rem 10rem 2.6rem;
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

const StepItemReviewContainer = styled.div`
  margin-bottom: 1rem;
  padding: 1rem 1.4rem;
  border: 0.1rem solid var(--n60-color);
  border-radius: 1rem;
`

const StepItemReviewText = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 1.8rem;
  margin-bottom: 1rem;
  font-size: var(--font-callout-small-size);
  font-weight: var(--font-callout-small-weight);
  line-height: 1.4;
  letter-spacing: var(--font-callout-small-letter-spacing);
  color: var(--n200-color);
  background: url("${IconNotice}") no-repeat left 0px / 1.5rem 1.5rem;
`

const StepItemReviewBox = styled.div`
  display: block;
  width: 100%;
  height: 7rem;
  overflow-y: scroll;
  color: var(--n200-color);
  font-size: var(--font-bodyL-size);
  font-weight: var(--font-bodyL-weight);
  letter-spacing: var(--font-bodyL-letter-spacing);
  outline: 0;
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
