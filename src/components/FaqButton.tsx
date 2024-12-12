import IconFaq from "assets/ico-faq.svg?react"
import { useNavigate } from "react-router-dom"
import { RoutePath } from "@/types/route-path"
import styled from "styled-components"

const FaqButton = () => {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate(RoutePath.ContactAdd)
  }
  return (
    <FaqContainer onClick={handleClick}>
      <div>
        <StyledIconFaq />
        <p>문의등록</p>
      </div>
    </FaqContainer>
  )
}

export default FaqButton

const FaqContainer = styled.button`
  position: fixed;
  right: 2rem;
  bottom: 9.5rem;
  z-index: 10;
  width: 6rem;
  height: 6rem;
  background-color: var(--prim-L200);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0.8rem 1.4rem rgba(32, 32, 32, 0.1);

  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.1rem;
    p {
      color: var(--white);
      font-size: 0.9rem;
      font-weight: var(--font-weight-medium);
    }
  }
`
const StyledIconFaq = styled(IconFaq)`
  width: 2.4rem;
  height: 2.4rem;
`
