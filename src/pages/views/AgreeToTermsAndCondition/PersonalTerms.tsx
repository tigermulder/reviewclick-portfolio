import ReuseHeader from "@/components/ReuseHeader"
import Button from "@/components/Button"
import { RoutePath } from "@/types/route-path"
import { useNavigate } from "react-router-dom"
import PDFViewer from "@/components/PdfViewer"
import styled from "styled-components"
import SeoHelmet from "@/components/SeoHelmet"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"

const PersonalTerms = () => {
  const navigate = useNavigate()
  const handleConfirm = () => {
    navigate(RoutePath.Join, { replace: true })
  }

  return (
    <>
      <SeoHelmet
        title="리뷰클릭-개인정보호약관"
        description="리뷰클릭은 제품과 서비스 전반에 걸친 다양한 사용자 리뷰를 한곳에서 제공합니다. 믿을 수 있는 평가와 상세한 리뷰로 현명한 소비를 지원합니다."
      />
      <ReuseHeader title="개인정보호약관" onBack={handleConfirm} />
      <TransformWrapper initialScale={1} minScale={1} maxScale={4}>
        <TransformComponent>
          <PDFContainer>
            <PDFViewer
              pdfPath={"https://cdn.revuclick.io/docs-public/PersonalTerms.pdf"}
            />
          </PDFContainer>
        </TransformComponent>
      </TransformWrapper>

      <ButtonWrapper>
        <Button $variant="red" onClick={handleConfirm}>
          확인
        </Button>
      </ButtonWrapper>
    </>
  )
}

export default PersonalTerms

const PDFContainer = styled.div`
  padding: 7rem 0 12rem;
`

const ButtonWrapper = styled.div`
  position: fixed;
  padding: 1.6rem 1.5rem 4.1rem;
  width: 100%;
  bottom: 0;
  left: 0;
  background-color: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.08);
  z-index: 100;
`
