import { SingleHeader } from "@/types/component-types/single-page-header-type"
import { RoutePath } from "@/types/route-path"
import IconToggle from "assets/ico_toggle.svg?react"
import { Link } from "react-router-dom"
import styled from "styled-components"

const SinglePageHeader = ({ title, showRouteToggle = false }: SingleHeader) => {
  return (
    <HeaderContainer>
      <Title>{title}</Title>
      {showRouteToggle && (
        <RouteLink to={RoutePath.UserAccountSetting}>
          <IconToggle />
        </RouteLink>
      )}
    </HeaderContainer>
  )
}

export default SinglePageHeader

const HeaderContainer = styled.div`
  max-width: 768px;
  min-width: 375px;
  display: flex;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3;
  width: 100%;
  padding: 1.9rem 1.5rem;
  background: var(--white);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
`

const Title = styled.h3`
  font-size: var(--font-h2-size);
  font-weight: var(--font-weight-bold);
`

const RouteLink = styled(Link)`
  width: 2.4rem;
  height: auto;
`
