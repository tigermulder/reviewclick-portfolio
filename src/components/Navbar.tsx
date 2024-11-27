import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { RoutePath } from "@/types/route-path"
import useToast from "@/hooks/useToast"
import IconCampaign from "assets/ico_tab_02.svg?react"
import IconAlerts from "assets/ico_tab_04.svg?react"
import IconProfile from "assets/ico-main.svg?react"
import styled, { css } from "styled-components"

const Navbar = () => {
  const location = useLocation()
  const currentPath = location.pathname
  const { addToast } = useToast()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

  useEffect(() => {
    const email = localStorage.getItem("email")
    if (email && email !== "null" && email !== "") {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
  }, [])

  useEffect(() => {
    if (currentPath.startsWith(RoutePath.MyCampaign)) {
      setActiveTab("campaign")
    } else if (currentPath === RoutePath.Home) {
      setActiveTab("home")
    } else if (currentPath.startsWith("/alerts/")) {
      setActiveTab("alerts")
    } else if (currentPath.startsWith("/user/")) {
      setActiveTab("user")
    } else if (currentPath === "/") {
      setActiveTab("home")
    }
  }, [currentPath])

  const handleTabClick = (
    tabName: string,
    requiresAuth: boolean,
    path: string,
    e: React.MouseEvent
  ) => {
    e.preventDefault()
    setActiveTab(tabName)

    if (isLoggedIn === false || isLoggedIn === null) {
      addToast("계정 인증 완료 후 이용 가능해요.", "warning", 3000, "Join")
      return
    }

    if (requiresAuth && !isLoggedIn) {
      addToast("계정 인증 완료 후 이용 가능해요.", "warning", 3000, "Join")
    } else {
      navigate(path, { replace: true })
    }
  }

  return (
    <Nav className="bottom-tab-bar">
      <NavItem $active={activeTab === "campaign"} $tabName="campaign">
        <StyledLink
          to={RoutePath.MyCampaign}
          onClick={(e) =>
            handleTabClick("campaign", true, RoutePath.MyCampaign, e)
          }
        >
          <NavItemContent>
            <StyledIcon as={IconCampaign} $active={activeTab === "campaign"} />
            <NavText $active={activeTab === "campaign"}>나의 캠페인</NavText>
          </NavItemContent>
        </StyledLink>
      </NavItem>

      <NavItem $active={activeTab === "user"} $tabName="user">
        <StyledLink
          to={RoutePath.UserProfile}
          onClick={(e) =>
            handleTabClick("user", true, RoutePath.UserProfile, e)
          }
          $tabName="user"
        >
          <NavItemContent>
            <StyledIcon
              as={IconProfile}
              $active={activeTab === "user"}
              $tabName="user"
            />
          </NavItemContent>
        </StyledLink>
      </NavItem>

      <NavItem $active={activeTab === "alerts"} $tabName="alerts">
        <StyledLink
          to={RoutePath.Alert}
          onClick={(e) => handleTabClick("alerts", true, RoutePath.Alert, e)}
        >
          <NavItemContent>
            <StyledIcon as={IconAlerts} $active={activeTab === "alerts"} />
            <NavText $active={activeTab === "alerts"}>알림</NavText>
          </NavItemContent>
        </StyledLink>
      </NavItem>
    </Nav>
  )
}

export default Navbar

const Nav = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 20;
  max-width: 768px;
  min-width: 280px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const NavItem = styled.div.attrs<{ $active: boolean; $tabName?: string }>(
  ({ $active }) => ({
    role: "button",
    "aria-pressed": $active,
  })
)<{ $active: boolean; $tabName?: string }>`
  ${({ $tabName }) =>
    $tabName === "campaign" &&
    css`
      width: 50%;
      padding: 0.3rem 0;
      background: var(--white);
      border-top-right-radius: 30px;
      border-top: 0.1rem solid var(--n80-color);
      flex: 1;
      display: flex;
      justify-content: center;
      a {
        margin-left: -1.6rem;
      }
    `}

  ${({ $tabName }) =>
    $tabName === "user" &&
    css`
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      margin-top: -0.3rem;
    `}

  ${({ $tabName }) =>
    $tabName === "alerts" &&
    css`
      width: 50%;
      padding: 0.3rem 0;
      border-top-left-radius: 30px;
      background: var(--white);
      border-top: 0.1rem solid var(--n80-color);
      flex: 1;
      display: flex;
      justify-content: center;
      a {
        margin-left: 1.6rem;
      }
    `}
`

const StyledLink = styled(Link).attrs<{ $tabName?: string }>({})<{
  $tabName?: string
}>`
  width: 4.8rem;
  height: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  /* $tabName이 "user"일 때 스타일 적용 */
  ${({ $tabName }) =>
    $tabName === "user" &&
    css`
      position: absolute;
      width: 4.8rem;
      height: 4.8rem;
      top: -22px;
      left: 50%;
      transform: translateX(-50%);
    `}
`

const NavItemContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const StyledIcon = styled.svg.attrs<{ $active: boolean; $tabName?: string }>(
  ({ $active }) => ({
    "aria-hidden": true,
  })
)<{ $active: boolean; $tabName?: string }>`
  width: ${({ $tabName }) => {
    if ($tabName === "user") return "4.9rem"
    else if ($tabName === "alerts") return "1.5rem"
    else return "1.7rem"
  }};
  height: ${({ $tabName }) => {
    if ($tabName === "user") return "4.9rem"
    else if ($tabName === "alerts") return "1.3rem"
    else return "1.7rem"
  }};
  margin-bottom: 0.4rem;
  color: ${({ $active }) => ($active ? "var(--revu-color)" : "var(--silver)")};
`

const NavText = styled.span.attrs<{ $active: boolean }>(({ $active }) => ({
  "aria-current": $active ? "page" : undefined,
}))<{ $active: boolean }>`
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.5px;
  color: ${({ $active }) => ($active ? "var(--revu-color)" : "var(--silver)")};
`
