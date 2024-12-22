import ReuseHeader from "@/components/ReuseHeader"
import Button from "@/components/Button";
import { RoutePath } from "@/types/route-path";
import { useNavigate } from "react-router-dom"
import styled from "styled-components";

const ServiceTerms = () => {
  const navigate = useNavigate();
  const handleConfirm = () => {
    navigate(RoutePath.Join)
  }

  return (
    <>
     <ReuseHeader title="개인회원 이용약관" onBack={handleConfirm} /> 

     <PDFContainer>
        <iframe
          src="/service_terms.pdf"
          title="개인정보호약관"
          width="100%"
          height="100%"
          style={{ border: "none" }}
        ></iframe>
      </PDFContainer>

     <ButtonWrapper>
      <Button
        $variant="red"
        onClick={handleConfirm}
      >
        확인
      </Button>
    </ButtonWrapper>
    </>
  )
}

export default ServiceTerms

const PDFContainer = styled.div`
  width: 100%;
  height: calc(100vh - 5.2rem - 6rem);
  margin-top: 5.2rem;
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