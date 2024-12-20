import { useState, useEffect, useRef } from "react"
import SeoHelmet from "@/components/SeoHelmet"
import ReuseHeader from "@/components/ReuseHeader"
import { useNavigate } from "react-router-dom"
import useScrollToTop from "@/hooks/useScrollToTop"
import useToast from "@/hooks/useToast"
import TextField from "@/components/TextField"
import Button from "@/components/Button"
import styled from "styled-components"
import axios from "axios"
import { validateName } from "@/utils/util"
import useDebounce from "@/hooks/useDebounce"

const CoupangVerificationPage = () => {
  const redirect = sessionStorage.getItem("redirectPath")
  const isLoggedIn = localStorage.getItem("name")
  const navigate = useNavigate()
  const { addToast } = useToast()
  useScrollToTop()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imageURL, setImageURL] = useState<string | null>(null)
  const [userName, setUserName] = useState("")
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isNameValid, setIsNameValid] = useState(false)

  useEffect(() => {
    if (selectedImage) {
      const url = URL.createObjectURL(selectedImage)
      setImageURL(url)
      return () => {
        URL.revokeObjectURL(url)
      }
    } else {
      setImageURL(null)
    }
  }, [selectedImage])

  useEffect(() => {
    if (isLoggedIn && isLoggedIn !== "null") {
      addToast("이미 인증되었습니다", 3000, "verify")
      if (redirect) {
        navigate(redirect)
      }
    }
  }, [isLoggedIn, redirect, navigate, addToast])

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      setSelectedImage(file)
      setIsError(false)
      setErrorMessage("")
      setIsNameValid(false)
      setUserName("")
    }
  }
  const debouncedValidateName = useDebounce((name: string) => {
    if (name.trim() === "") {
      // 입력값이 빈 문자열일 때 에러 상태 초기화
      setIsError(false)
      setErrorMessage("")
      setIsNameValid(false)
      return
    }

    if (validateName(name)) {
      setIsError(false)
      setErrorMessage("")
      setIsNameValid(true)
    } else {
      setIsError(true)
      setErrorMessage("유효한 이름을 입력해주세요 (2자 이상의 한글)")
      setIsNameValid(false)
    }
  }, 300) // 300ms 디바운스

  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    setUserName(name)
    debouncedValidateName(name)
  }

  const handleVerification = async () => {
    setIsError(false)
    setErrorMessage("")

    if (!validateName(userName)) {
      setIsError(true)
      setErrorMessage("유효한 이름을 입력해주세요 (2자 이상의 한글)")
      return
    }

    if (!selectedImage) {
      setIsError(true)
      setErrorMessage("이미지가 없습니다. 다시 업로드해주세요.")
      addToast("이미지가 없습니다. 다시 업로드해주세요.", 3000, "error")
      return
    }

    setIsVerifying(true)

    try {
      const formData = new FormData()
      formData.append("image", selectedImage)
      formData.append("name", userName)

      const response = await axios.post("/api/ocr-verify", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.data.success) {
        addToast("인증 성공!", 3000, "success")
        localStorage.setItem("name", userName)
        if (redirect) {
          navigate(redirect)
        } else {
          navigate("/")
        }
      } else {
        setIsError(true)
        setErrorMessage(response.data.message || "인증 실패")
        addToast(response.data.message || "인증 실패", 3000, "error")
      }
    } catch (error: any) {
      setIsError(true)
      setErrorMessage("인증 중 오류가 발생했습니다.")
      addToast("인증 중 오류가 발생했습니다.", 3000, "error")
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <>
      <SeoHelmet
        title="리뷰클릭-User Authentication"
        description="리뷰클릭은 제품과 서비스 전반에 걸친 다양한 사용자 리뷰를 한곳에서 제공합니다. 믿을 수 있는 평가와 상세한 리뷰로 현명한 소비를 지원합니다."
      />
      <VerificationContainer>
        <ReuseHeader
          title="계정인증"
          onBack={() => {
            navigate(-1)
          }}
        />
        <AccountVerifyTitle>
          리뷰클릭 이용을 위해 <br />
          <em>계정 인증</em>을 해주세요
        </AccountVerifyTitle>
        <AccountVerifyText>
          서비스를 이용하기 위해 쿠팡에 등록된 실명과 일치하는 정보가
          필요합니다. 서비스 이용을 위해 <em>고객님의 이름(실명)이 포함</em>된
          페이지를 캡쳐 후 업로드해 주세요.
        </AccountVerifyText>

        <ContentContainer>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleFileChange}
          />
          <Button $variant="uploadImage" onClick={handleButtonClick}>
            {selectedImage ? "새로운 이미지 업로드" : "이미지 업로드"}
          </Button>
        </ContentContainer>
        {imageURL && (
          <ThumbnailWrapper>
            <img src={imageURL} alt="thumbnail" />
          </ThumbnailWrapper>
        )}

        <TextFieldWrapper $visible={!!selectedImage}>
          <TextField
            type="text"
            name="name"
            placeholder="이름을 입력해주세요"
            value={userName}
            onChange={handleUserNameChange}
            $isError={isError}
            $marginBottom="1rem"
            errorMessage={errorMessage}
          />
          <ButtonContainer $visible={isNameValid}>
            <Button
              $variant="red"
              onClick={handleVerification}
              disabled={isVerifying}
            >
              {isVerifying ? "인증 중..." : "인증하기"}
            </Button>
          </ButtonContainer>
        </TextFieldWrapper>
      </VerificationContainer>
    </>
  )
}

export default CoupangVerificationPage

const VerificationContainer = styled.div`
  padding: 5.2rem 0;
`

const ContentContainer = styled.div`
  border: 1px solid var(--N80);
  border-radius: 0.8rem;
  text-align: center;
`

const AccountVerifyTitle = styled.h2`
  margin-top: 2.4rem;
  color: var(--N600);
  em {
    color: var(--L400);
  }
`

const AccountVerifyText = styled.p`
  margin: 1.2rem 0 2.4rem;
  em {
    color: var(--L400);
  }
`

const ThumbnailWrapper = styled.div`
  margin-top: 2rem;
  width: 100%;
  height: 20rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  background-color: var(--RevBlack);
  overflow: hidden;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`
const TextFieldWrapper = styled.div<{ $visible: boolean }>`
  position: fixed;
  padding: 1.6rem 1.5rem 4.1rem;
  width: 100%;
  bottom: 0;
  left: 0;
  background-color: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.08);
  transform: ${({ $visible }) =>
    $visible ? "translateY(0)" : "translateY(100%)"};
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition:
    transform 0.2s ease-in-out,
    opacity 0.1s ease-in-out;
  z-index: 100;
`

const ButtonContainer = styled.div<{ $visible: boolean }>`
  width: 100%;
  margin-top: 1.6rem;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) =>
    $visible ? "translateY(0)" : "translateY(20px)"};
  transition:
    opacity 0.2s ease-in-out,
    transform 0.1s ease-in-out;
  pointer-events: ${({ $visible }) => ($visible ? "auto" : "none")};
  display: flex;
  justify-content: center;
`
