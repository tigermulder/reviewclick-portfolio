import { useEffect, useState } from "react"
import { useRecoilState } from "recoil"
import { isShareModalOpenState } from "@/store/modal-recoil"
import useToast from "@/hooks/useToast"
import IconClose from "assets/ico_close.svg?react"
import IconClip from "assets/ico-link.svg?react"
import IconMore from "assets/ico-more.svg?react"
import IconKaKaoURL from "assets/ico-kakao.svg?url"
import styled, { keyframes, css } from "styled-components"

const ShareModal = () => {
  const [isModalOpen, setIsModalOpen] = useRecoilState(isShareModalOpenState)
  const [$isClosing, setIsClosing] = useState(false)
  const { addToast } = useToast()
  const JAVASCRIPT_KEY = import.meta.env.VITE_APP_JAVASCRIPT_KEY

  /** 모달 닫기 핸들러 */
  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsModalOpen(false)
      setIsClosing(false)
    }, 150)
  }

  /** 링크 복사 핸들러 */
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      addToast("링크가 복사되었습니다.", 3000, "copy")
    } catch (error) {
      console.error("링크 복사 실패:", error)
      addToast("링크 복사 실패.", 3000, "copy")
    }
  }

  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.cleanup()
      window.Kakao.init(JAVASCRIPT_KEY)
    }
  }, [JAVASCRIPT_KEY])

  /** 카카오톡 공유 핸들러 */
  const handleKakaoShare = () => {
    if (window.Kakao) {
      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: "RevuClick",
          description: "리뷰로 결제 금액을 돌려받는 특별한 혜택!",
          imageUrl:
            "http://k.kakaocdn.net/dn/Q2iNx/btqgeRgV54P/VLdBs9cvyn8BJXB3o7N8UK/kakaolink40_original.png",
          link: {
            mobileWebUrl: window.location.href,
          },
        },
        buttons: [
          {
            title: "RevuClick",
            link: {
              mobileWebUrl: window.location.href,
            },
          },
        ],
      })
    }
  }

  /** 웹 공유 API 핸들러 */
  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "RevuClick",
          text: "리뷰로 결제 금액을 돌려받는 특별한 혜택!",
          url: window.location.href,
        })
        addToast("공유 성공.", 3000, "link")
      } catch (error) {
        addToast("공유 실패.", 3000, "link")
      }
    } else {
      addToast("Web Share를 지원하지 않는 브라우저입니다.", 3000, "link")
    }
  }

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isModalOpen])

  return (
    <>
      {isModalOpen && (
        <Overlay onClick={handleClose}>
          <ModalContainer
            $isClosing={$isClosing}
            onClick={(e) => e.stopPropagation()}
          >
            <ShareHeader>
              <h3>공유하기</h3>
              <CloseButton onClick={handleClose} aria-label="모달 닫기">
                <IconClose aria-hidden="true" />
              </CloseButton>
            </ShareHeader>
            <IconsWrapper>
              <IconItem onClick={handleCopyLink} aria-label="링크 복사">
                <IconClipStyled aria-hidden="true" />
                <IconText>링크 복사</IconText>
              </IconItem>
              <IconItem onClick={handleKakaoShare} aria-label="카카오톡">
                <IconKaKaoBackground aria-hidden="true" />
                <IconText>카카오톡</IconText>
              </IconItem>
              <IconItem onClick={handleWebShare} aria-label="더보기">
                <IconMoreStyled aria-hidden="true" />
                <IconText>더보기</IconText>
              </IconItem>
            </IconsWrapper>
          </ModalContainer>
        </Overlay>
      )}
    </>
  )
}

export default ShareModal

const slideUp = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`

const slideDown = keyframes`
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
`

const Overlay = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 1000;
`

const ModalContainer = styled.div<{ $isClosing: boolean }>`
  background: #fff;
  width: 100%;
  border-radius: 12px 12px 0 0;
  animation: ${({ $isClosing }) =>
    $isClosing
      ? css`
          ${slideDown} 0.15s ease-out forwards
        `
      : css`
          ${slideUp} 0.15s ease-out forwards
        `};
  position: relative;
  text-align: center;
`

const ShareHeader = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 0.1rem solid var(--N20);
  padding: 1.6rem 0;
`

const CloseButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 1.6rem;
  background: none;
  border: none;
  font-size: 2.4rem;
  cursor: pointer;
`

const IconsWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  padding: 2.6rem 1.6rem 4rem;
`

const IconItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
`

const IconClipStyled = styled(IconClip)`
  width: 5rem;
  height: 5rem;
  object-fit: contain;
`

const IconMoreStyled = styled(IconMore)`
  width: 5rem;
  height: 5rem;
  object-fit: contain;
`

const IconKaKaoBackground = styled.div`
  width: 5rem;
  height: 5rem;
  background: url("${IconKaKaoURL}") #ffe617 no-repeat center / 50%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const IconText = styled.p`
  font-size: var(--caption-size);
  color: #333;
`
