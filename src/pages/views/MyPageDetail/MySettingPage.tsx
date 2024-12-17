import { Link, useNavigate } from "react-router-dom"
import { RoutePath } from "@/types/route-path"
import IconArrowRight from "assets/ico_arr_right.svg?url"
import IconCheck from "assets/ico_check.svg?url"
import ReuseHeader from "@/components/ReuseHeader"
import useToast from "@/hooks/useToast"
import { logout } from "@/services/login"
import { authState } from "@/store/auth-recoil"
import { useSetRecoilState } from "recoil"
import styled from "styled-components"

const MySettingPage = () => {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const setAuth = useSetRecoilState(authState)
  const userEmail = localStorage.getItem("email")

  //** 로그아웃 핸들러 */
  const handleLogOut = async () => {
    try {
      const response = await logout()
      // const response = {
      //   statusCode: 0,
      // }
      if (response.statusCode === 0) {
        addToast("계정이 로그아웃 되었습니다", 1000, "LogOut")
        // Recoil 로그인상태 업데이트
        setAuth({
          isLoggedIn: false,
          token: null,
        })
        sessionStorage.removeItem("authToken")
        localStorage.removeItem("email")
        localStorage.removeItem("nickname")
        const redirect = sessionStorage.getItem("redirectPath")
        if (redirect) {
          navigate(redirect)
        } else {
          navigate(RoutePath.Home)
        }
      } else {
        throw new Error()
      }
    } catch (err) {
      addToast("다시시도해주세요", 1000, "LogOut")
    }
  }
  return (
    <>
      <ReuseHeader
        title="비밀번호 재설정"
        onBack={() => navigate(RoutePath.UserProfile)}
      />
      <Links>
        <TitleWrapper>계정</TitleWrapper>
        <TextWrapper>
          ID
          <span>
            <em>{userEmail}</em>인증됨
          </span>
        </TextWrapper>
        <li>
          <LogoutButton onClick={handleLogOut}>로그아웃</LogoutButton>
        </li>
        <li>
          <StyledLink to={RoutePath.UserAccountDeletion}>회원탈퇴</StyledLink>
        </li>
      </Links>
    </>
  )
}

export default MySettingPage

const Links = styled.ul`
  padding-bottom: 1.9rem;

  li {
    position: relative;

    a::after {
      content: "";
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      width: 2.4rem;
      height: 2.4rem;
      background: url("${IconArrowRight}") no-repeat center / 100%;
    }
  }
`

const TitleWrapper = styled.li`
  width: 100%;
  padding: 2.2rem 0;
  font-size: var(--font-body-size);
  font-weight: var(--font-bold);
`

const TextWrapper = styled.li`
  width: 100%;
  padding: 2.2rem 0;
  font-size: var(--font-body-size);
  font-weight: var(--font-medium);
  border-bottom: 0.1rem solid var(--WSmoke);

  span {
    position: absolute;
    top: 50%;
    right: 3rem;
    transform: translateY(-50%);
    color: var(--N300);

    em {
      margin-right: 0.4rem;
    }
  }
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    width: 2.4rem;
    height: 2.4rem;
    background: url("${IconCheck}") no-repeat center / 100%;
  }
`

const StyledLink = styled(Link)`
  position: relative;
  display: block;
  width: 100%;
  padding: 2.2rem 0;
  font-size: var(--font-body-size);
  font-weight: var(--font-medium);
  border-bottom: 0.1rem solid var(--WSmoke);
  color: inherit;

  &:hover {
    background-color: var(--WWood);
  }
`

const LogoutButton = styled.button`
  position: relative;
  display: block;
  width: 100%;
  padding: 2.2rem 0;
  font-size: var(--font-body-size);
  font-weight: var(--font-medium);
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  border-bottom: 0.1rem solid var(--WSmoke);
  color: inherit;

  &:hover {
    background-color: var(--WWood);
  }

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    width: 2.4rem;
    height: 2.4rem;
    background: url("${IconArrowRight}") no-repeat center / 100%;
  }
`
