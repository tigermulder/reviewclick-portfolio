import ReuseHeader from "@/components/ReuseHeader"
import Button from "@/components/Button"
import { RoutePath } from "@/types/route-path"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import PDFViewer from "@/components/PdfViewer"

const ServiceTerms = () => {
  const navigate = useNavigate()
  const handleConfirm = () => {
    navigate(RoutePath.Join, { replace: true })
  }

  return (
    <>
      <ReuseHeader title="서비스 이용약관" onBack={handleConfirm} />

      <PDFContainer>
        <PDFViewer
          pdfPath={"https://cdn.revuclick.io/docs-public/ServiceTerms.pdf"}
        />
      </PDFContainer>

      <ButtonWrapper>
        <Button $variant="red" onClick={handleConfirm}>
          확인
        </Button>
      </ButtonWrapper>
    </>
  )
}

export default ServiceTerms

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
