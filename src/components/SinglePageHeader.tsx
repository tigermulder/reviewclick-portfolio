import { SingleHeader } from "@/types/component-types/single-page-header-type"
import styled from "styled-components"

const SinglePageHeader = ({ title }: SingleHeader) => {
  return (
    <HeaderContainer>
      <Title>{title}</Title>
    </HeaderContainer>
  )
}

export default SinglePageHeader

const HeaderContainer = styled.div`
  max-width: 768px;
  min-width: 375px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3;
  width: 100%;
  padding: 1.9rem 1.5rem;
  background: var(--white);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
`

const Title = styled.h3`
  font-size: var(--font-h2-size);
  font-weight: var(--font-weight-bold);
`
