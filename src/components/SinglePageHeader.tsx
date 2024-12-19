import { SingleHeader } from "@/types/component-types/single-page-header-type"
import styled from "styled-components"

const SinglePageHeader = ({ title }: SingleHeader) => {
  return (
    <HeaderContainer>
      <h2>{title}</h2>
    </HeaderContainer>
  )
}

export default SinglePageHeader

const HeaderContainer = styled.div`
  max-width: 768px;
  min-width: 280px;
  display: flex;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3;
  width: 100%;
  padding: 1.6rem;
  background-color: white;

  h2 {
    font-weight: var(--font-bold);
  }
`
