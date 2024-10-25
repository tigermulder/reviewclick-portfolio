import styled from "styled-components"
import Button from "@/components/Button"
import IconNotice from "assets/ico_notice.svg?url"
import { StepThreeProps } from "@/types/component-types/my-campaigndetail-type"
import { useState, useRef } from "react"
import { confirmReview } from "@/services/review"
import SampleReviewImage from "assets/pro-sample-text.png"
import { ReviewAuthResponse } from "@/types/api-types/review-type"
import useToast from "@/hooks/useToast"

const StepThree = ({
  reviewIdKey,
  campaignsUrl,
}: StepThreeProps): JSX.Element => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const { addToast } = useToast()

  // 버튼 클릭 시 파일 선택 창 열기
  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }
  // 영수증 OCR 핸들러
  const handleReceiptOCR = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (file && reviewIdKey) {
      setSelectedFile(file)
      const formData = new FormData()
      formData.append("reviewId", reviewIdKey)
      formData.append("image", file)
      try {
        const response: ReviewAuthResponse = await confirmReview(formData)
        if (response.statusCode === 0) {
          console.log("인증 성공:", response)
        } else {
          // handleAuthError(response.statusCode)
        }
      } catch (error) {
        console.error("인증 실패:", error)
      }
    } else {
      // 파일 또는 reviewId가 없는 경우 처리
      console.warn("파일 또는 reviewId가 누락되었습니다.")
    }
  }

  const handleCopy = () => {
    if (textRef.current) {
      const text = textRef.current.innerText

      try {
        navigator.clipboard.writeText(text)
        addToast("내용이 복사됐어요.", "copy", 1000, "copy")
      } catch (err) {
        addToast("복사 실패.", "copy", 1000, "copy")
      }
    }
  }

  // 새 창으로 이동하는 핸들러
  const handleNavigate = () => {
    const url =
      "https://new-m.pay.naver.com/historybenefit/paymenthistory?page=1" // 이동하려는 URL
    window.open(url, "_blank")
  }

  return (
    <>
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
              검수 완료된 리뷰가 여기에 Lorem ipsum dolor sit amet consectetur,
              adipisicing elit. Harum, dolor? Amet hic rerum non molestiae
              laborum aspernatur aliquam, cumque ea! 검수 완료된 리뷰가 여기에
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Harum,
              dolor? Amet hic rerum non molestiae laborum aspernatur aliquam,
              cumque ea!
            </StepItemReviewBox>
            <Button $variant="copy" onClick={handleCopy}>
              복사
            </Button>
          </StepItemReviewContainer>

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
    width: 100%;
    height: 227px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    position: relative;

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

const StepItemReviewBox = styled.div`
  display: block;

  margin-bottom: 1.4rem;
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
