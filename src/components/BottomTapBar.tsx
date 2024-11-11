import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useSetRecoilState } from "recoil"
import { isGlobalCategoryMenuOpenState } from "store/mainpage-recoil"
import { RoutePath } from "@/types/route-path"
import useToast from "@/hooks/useToast"
import { authState } from "@/store/auth-recoil"
import { useRecoilValue } from "recoil"
import IconCategory from "assets/ico_tab_01.svg?react"
import IconCampaign from "assets/ico_tab_02.svg?react"
import IconHome from "assets/ico_tab_03.svg?react"
import IconAlerts from "assets/ico_tab_04.svg?react"
import IconProfile from "assets/ico-main.svg?react"
import styled from "styled-components"

const BottomTabBar = () => {
  const location = useLocation()
  const currentPath = location.pathname
  const setIsMenuOpen = useSetRecoilState(isGlobalCategoryMenuOpenState)
  const { isLoggedIn } = useRecoilValue(authState)
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("")

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

  const handleCategoryClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setActiveTab("category")
    setIsMenuOpen(true)
  }

  const handleTabClick = (
    tabName: string,
    requiresAuth: boolean,
    path: string,
    e: React.MouseEvent
  ) => {
    e.preventDefault()
    setActiveTab(tabName)
    if (requiresAuth && !isLoggedIn) {
      addToast("계정인증이 필요합니다.", "warning", 1000, "Join")
      navigate(RoutePath.Join, { replace: true })
    } else {
      navigate(path, { replace: true })
    }
  }

  return (
    // <Nav className="bottom-tab-bar">
    //   <NavItem $active={activeTab === "category"}>
    //     <StyledLink to="#" onClick={handleCategoryClick}>
    //       <NavItemContent>
    //         <StyledIcon as={IconCategory} $active={activeTab === "category"} />
    //         <NavText $active={activeTab === "category"}>카테고리</NavText>
    //       </NavItemContent>
    //     </StyledLink>
    //   </NavItem>
    //   <NavItem $active={activeTab === "campaign"}>
    //     <StyledLink
    //       to={RoutePath.MyCampaign}
    //       onClick={(e) =>
    //         handleTabClick("campaign", true, RoutePath.MyCampaign, e)
    //       }
    //     >
    //       <NavItemContent>
    //         <StyledIcon as={IconCampaign} $active={activeTab === "campaign"} />
    //         <NavText $active={activeTab === "campaign"}>나의 캠페인</NavText>
    //       </NavItemContent>
    //     </StyledLink>
    //   </NavItem>
    //   <NavItem $active={activeTab === "home"}>
    //     <StyledLink
    //       to={RoutePath.Home}
    //       onClick={(e) => handleTabClick("home", false, RoutePath.Home, e)}
    //     >
    //       <NavItemContent>
    //         <StyledIcon as={IconHome} $active={activeTab === "home"} />
    //         <NavText $active={activeTab === "home"}>Home</NavText>
    //       </NavItemContent>
    //     </StyledLink>
    //   </NavItem>
    //   <NavItem $active={activeTab === "alerts"}>
    //     <StyledLink
    //       to={RoutePath.Alert}
    //       onClick={(e) => handleTabClick("alerts", true, RoutePath.Alert, e)}
    //     >
    //       <NavItemContent>
    //         <StyledIcon as={IconAlerts} $active={activeTab === "alerts"} />
    //         <NavText $active={activeTab === "alerts"}>알림</NavText>
    //       </NavItemContent>
    //     </StyledLink>
    //   </NavItem>
    //   <NavItem $active={activeTab === "user"}>
    //     <StyledLink
    //       to={RoutePath.UserProfile}
    //       onClick={(e) =>
    //         handleTabClick("user", true, RoutePath.UserProfile, e)
    //       }
    //     >
    //       <NavItemContent>
    //         <StyledIcon as={IconProfile} $active={activeTab === "user"} />
    //         <NavText $active={activeTab === "user"}>내 정보</NavText>
    //       </NavItemContent>
    //     </StyledLink>
    //   </NavItem>
    // </Nav>
    <Nav className="bottom-tab-bar">
      <NavItem $active={activeTab === "campaign"}>
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

      <NavItem $active={activeTab === "user"}>
        <StyledLink
          to={RoutePath.UserProfile}
          onClick={(e) =>
            handleTabClick("user", true, RoutePath.UserProfile, e)
          }
        >
          <NavItemContent>
            <StyledIcon
              as={IconProfile}
              $active={activeTab === "user"}
              $tabName="user"
            />
            {/* <NavText $active={activeTab === "user"}>마이페이지</NavText> */}
          </NavItemContent>
        </StyledLink>
      </NavItem>

      <NavItem $active={activeTab === "alerts"}>
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

export default BottomTabBar

const Nav = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 40;
  width: 100%;
  height: 5.9rem;
  padding: 1.2rem 16px;
  background: var(--white);
  display: flex;
  justify-content: space-evenly;
  // justify-content: center;
  // gap: 0.8rem;
  align-items: center;
  border-top: 1px solid #ddd;
`

const NavItem = styled.div.attrs<{ $active: boolean }>(({ $active }) => ({
  role: "button",
  "aria-pressed": $active,
}))<{ $active: boolean }>`
  flex-basis: 20%;
  height: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
`

const StyledLink = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  width: 100%;
  height: 100%;
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
  width: ${({ $tabName }) => ($tabName === "user" ? "4.9rem" : "1.6rem")};
  height: ${({ $tabName }) => ($tabName === "user" ? "4.9rem" : "1.6rem")};
  margin-bottom: 0.7rem;
  color: ${({ $active }) => ($active ? "var(--revu-color)" : "var(--silver)")};
`

const NavText = styled.span.attrs<{ $active: boolean }>(({ $active }) => ({
  "aria-current": $active ? "page" : undefined,
}))<{ $active: boolean }>`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ $active }) => ($active ? "var(--revu-color)" : "var(--silver)")};
`
