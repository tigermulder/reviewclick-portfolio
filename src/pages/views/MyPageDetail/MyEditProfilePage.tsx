import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { RoutePath } from "@/types/route-path"
import ReuseHeader from "@/components/ReuseHeader"
import TextField from "@/components/TextField"
import { validatePassword, validatePhone } from "@/utils/util"
import Button from "@/components/Button"
import { modifyUser } from "@/services/user"
import useToast from "@/hooks/useToast"
import styled from "styled-components"

const MyEditProfilePage = () => {
  const navigate = useNavigate()
  const [password1, setPassword1] = useState("")
  const [password2, setPassword2] = useState("")
  const [phone, setPhone] = useState("")
  const [registerEnabled, setRegisterEnabled] = useState(false)
  const { addToast } = useToast()

  //** 내정보 수정 활성화 조건 체크 */
  useEffect(() => {
    const passwordValid =
      password1 !== "" &&
      password2 !== "" &&
      password1 === password2 &&
      validatePassword(password1)
    const phoneValid = validatePhone(phone)
    const buttonEnabled = passwordValid || phoneValid
    setRegisterEnabled(buttonEnabled)
  }, [password1, password2, phone])

  //** 내정부 수정 핸들러 */
  const handleEditProfile = async () => {
    try {
      const response = await modifyUser({
        password: password1,
        phone,
      })

      if (response.statusCode === 0) {
        addToast("내 정보가 수정됐어요.", "info", 1000, "EditProfile")
        navigate(RoutePath.UserProfile)
      } else {
        throw new Error()
      }
    } catch (err) {
      addToast("다시시도해주세요", "warning", 1000, "EditProfile")
    }
  }

  return (
    <Container>
      <ReuseHeader
        title="내 정보 수정"
        onBack={() => navigate(RoutePath.UserProfile)}
      />
      <Label>새 비밀번호</Label>
      <TextField
        type="password"
        name="password1"
        placeholder="영문 대/소문자, 숫자, 특수문자 조합하여 8~16자"
        value={password1}
        onChange={(e) => setPassword1(e.target.value)}
        $isError={password1 !== "" && !validatePassword(password1)}
        errorMessage={
          password1 !== "" && !validatePassword(password1)
            ? "영문 대/소문자, 숫자, 특수문자를 조합하여 8~16자로 입력해 주세요."
            : undefined
        }
      />
      <TextField
        type="password"
        name="password2"
        placeholder="새로운 비밀번호 확인"
        value={password2}
        onChange={(e) => setPassword2(e.target.value)}
        $isError={password2 !== "" && password1 !== password2}
        errorMessage={
          password2 !== "" && password1 !== password2
            ? "비밀번호가 일치하지 않습니다."
            : undefined
        }
      />
      <MarginTop />
      <Label>휴대폰 번호 변경</Label>
      <TextField
        type="phone"
        name="phone"
        placeholder="휴대폰 번호 입력(‘-’제외)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        $isError={phone !== "" && !validatePhone(phone)}
        errorMessage={
          phone !== "" && !validatePhone(phone)
            ? "- 없이 8자리 이상의 숫자로 입력해주세요."
            : undefined
        }
      />
      <Button
        type="button"
        disabled={!registerEnabled}
        $variant="red"
        onClick={handleEditProfile}
      >
        내정보 수정
      </Button>
    </Container>
  )
}

export default MyEditProfilePage

const Container = styled.div`
  padding: 3.2rem 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`

const Label = styled.p`
  margin: 0 0 0.8rem 0.4rem;
  color: var(--primary-color);
  font-size: var(--font-bodyL-size);
  font-weight: var(--font-weight-medium);
`

const MarginTop = styled.div`
  margin-top: 2.55rem;
`
