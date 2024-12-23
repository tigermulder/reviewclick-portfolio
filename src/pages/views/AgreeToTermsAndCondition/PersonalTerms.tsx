import ReuseHeader from "@/components/ReuseHeader"
import Button from "@/components/Button"
import { RoutePath } from "@/types/route-path"
import { useNavigate } from "react-router-dom"
import { PdfViewer } from "@naverpay/react-pdf"
import styled from "styled-components"

const PersonalTerms = () => {
  const navigate = useNavigate()
  const handleConfirm = () => {
    navigate(RoutePath.Join)
  }

  return (
    <>
      <ReuseHeader title="개인정보호약관" onBack={handleConfirm} />

      <PDFContainer>
        <PdfViewer
          pdfUrl={"https://cdn.revuclick.io/docs-public/PersonalTerms.pdf"}
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
