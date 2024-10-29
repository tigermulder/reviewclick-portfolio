import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import ReuseHeader from "@/components/ReuseHeader"
import TextField from "@/components/TextField"
import Button from "@/components/Button"
import useToast from "@/hooks/useToast"
import { checkName, validatePhone } from "@/utils/util" // validatePhone으로 수정
import { RoutePath } from "@/types/route-path"
import { findId } from "@/services/join"
import styled from "styled-components"

const FindIdPage = () => {
  const [nickname, setName] = useState("")
  const [phone, setPhone] = useState("")
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null) // 에러 상태

  // 버튼 활성화 여부를 동적으로 설정
  useEffect(() => {
    setIsButtonEnabled(checkName(nickname) && validatePhone(phone))
  }, [nickname, phone])

  // 아이디 찾기 API 호출 함수
  const handleFindId = async () => {
    try {
      const response = await findId({ nickname, phone })

      if (response.statusCode === 0) {
        // 성공적으로 이메일을 찾았을 때 로컬스토리지에 저장
        localStorage.setItem("find_email", response.email)
        localStorage.setItem("nickname", nickname)
        // 성공 메시지 출력 후 페이지 이동
        addToast("아이디가 이메일로 발송되었습니다.", "warning", 1000, "UserId")
        navigate(RoutePath.Login) // 로그인 페이지로 이동
      } else if (response.statusCode === -1) {
        // 서버에서 -1 에러코드를 받았을 때 처리
        addToast(
          "입력한 정보로 가입된 계정이 없습니다.",
          "warning",
          1000,
          "UserId"
        )
        console.error(response)
      }
    } catch (err) {
      setError(err as Error)
      addToast("아이디 찾기 중 오류가 발생했습니다.", "warning", 1000, "UserId")
    }
  }

  // ErrorBoundary가 포착하도록 에러 던지기
  if (error) {
    throw error
  }

  return (
    <Container>
      <ReuseHeader
        title="아이디 찾기"
        onBack={() => navigate(RoutePath.Login)}
      />
      <TitleContainer>
        <Title>
          가입할 때 사용한
          <br />
          계정 정보를 입력해주세요.
        </Title>
      </TitleContainer>

      <TextField
        type="text"
        name="name"
        placeholder="이름"
        value={nickname}
        onChange={(e) => setName(e.target.value)}
        $isError={nickname !== "" && !checkName(nickname)}
        errorMessage={
          nickname !== "" && !checkName(nickname)
            ? "올바른 형식의 이름을 입력하세요."
            : undefined
        }
      />
      <TextField
        type="text"
        name="phone"
        placeholder="휴대폰번호"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        $isError={phone !== "" && !validatePhone(phone)} // 전화번호 검증 함수 수정
        errorMessage={
          phone !== "" && !validatePhone(phone)
            ? "‘-’ 없이 8자리에서 11자리 숫자로 입력해주세요."
            : undefined
        }
      />
      <Button
        type="button"
        disabled={!isButtonEnabled}
        $variant="red"
        onClick={handleFindId} // 버튼 클릭 시 API 호출
      >
        아이디 찾기
      </Button>
    </Container>
  )
}

export default FindIdPage

const Container = styled.div`
  padding: 4.4rem 0;
  display: flex;
  flex-direction: column;
`

const TitleContainer = styled.div`
  padding: 2.8rem 0 4.2rem;
`

const Title = styled.h4`
  color: var(--primary-color);
  font-size: var(--font-h3-size);
  font-weight: var(--font-weight-bold);
  line-height: 2.5rem;
`
