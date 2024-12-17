import { useNavigate } from "react-router-dom"
import { RoutePath } from "@/types/route-path"
import ReuseHeader from "@/components/ReuseHeader"
import IconCheck from "assets/ico_check.svg?react"
import styled from "styled-components"

const MyEditProfilePage = () => {
  const navigate = useNavigate()
  const userName = localStorage.getItem("name") || ""
  const userEmail = localStorage.getItem("email") || ""
  const userPhone = localStorage.getItem("userPhoneNumber") || ""

  return (
    <Container>
      <ReuseHeader
        title="내 정보 수정"
        onBack={() => navigate(RoutePath.UserProfile)}
      />

      <GroupWrap>
        {/* 이름 */}
        {/* <Group>
          <div>
            이름
            <IconCheck />
          </div>
          <div>
            <ValueTxt>{userName}</ValueTxt>
          </div>
        </Group> */}

        {/* 인증 계정 */}
        <Group>
          <div>
            인증 계정
            <IconCheck />
          </div>
          <div>
            <ValueTxt>{userEmail}</ValueTxt>
          </div>
        </Group>

        {/* 휴대폰 번호 */}
        <Group>
          <div>
            휴대폰 번호
            <IconCheck />
          </div>
          <div>
            <ValueTxt>{userPhone}</ValueTxt>
          </div>
        </Group>
      </GroupWrap>
    </Container>
  )
}

export default MyEditProfilePage

const Container = styled.div`
  padding: 3.2rem 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: white;
`

const GroupWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`

const Group = styled.div`
  font-size: var(--font-body-size);

  > div:nth-child(1) {
    margin-bottom: 0.8rem;
    color: var(--N600);
    display: flex;
    justify-content: start;
    align-items: center;
    gap: 0.2rem;
  }

  svg {
    width: 1.6rem;
    height: 1.6rem;
  }
`

const ValueTxt = styled.div`
  padding: 0 1.5rem;
  width: 100%;
  height: 4.4rem;
  line-height: 4.4rem;
  border-radius: 0.8rem;
  background-color: var(--N40);
  color: var(--N400);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  gap: 0.8rem;
`
