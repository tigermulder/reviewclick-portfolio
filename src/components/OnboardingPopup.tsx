// OnboardingPopup.tsx
import { useState, useEffect } from "react"
import {
  OnboardingPopupProps,
  CloseButtonProps,
} from "@/types/component-types/onboarding-popup"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"
import styled from "styled-components"

const OnboardingPopup = ({ onClose }: OnboardingPopupProps) => {
  const [showPopup, setShowPopup] = useState(true)
  const [swiperInstance, setSwiperInstance] = useState<any>(null)

  useEffect(() => {
    const doNotShowAgain = localStorage.getItem("doNotShowOnboardingToday")
    if (doNotShowAgain === "true") {
      setShowPopup(false)
    }
  }, [])

  //** 스크롤방지 */
  useEffect(() => {
    if (showPopup) {
      // 모달이 열리면 body 스크롤을 막음
      document.body.style.overflow = "hidden"
    } else {
      // 모달이 닫히면 body 스크롤을 다시 활성화
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [showPopup])

  //** 오늘하루 보지않기 */
  const handleDoNotShowAgain = () => {
    localStorage.setItem("doNotShowOnboardingToday", "true")
    setShowPopup(false)
    onClose()
  }

  const handleClose = () => {
    setShowPopup(false)
    onClose()
  }

  if (!showPopup) return null

  return (
    <Overlay>
      <Dimmed>
        <DoNotShowAgain onClick={handleDoNotShowAgain}>
          오늘 하루 보지 않기
        </DoNotShowAgain>
      </Dimmed>
      <PopupContainer>
        <CustomSwiper
          slidesPerView={1}
          pagination={{ clickable: true }}
          allowTouchMove={true}
          modules={[Pagination]} // 모듈 등록
          onSwiper={(swiper) => setSwiperInstance(swiper)}
        >
          {/* 첫 번째 슬라이드 */}
          <SwiperSlide>
            <SlideContent>
              <CloseButton onClick={handleClose} $color="black" />
              {/* 첫 번째 슬라이드 내용 */}
              <h2>첫 번째 페이지</h2>
              <p>여기에 첫 번째 페이지 내용을 작성하세요.</p>
              <StartButton onClick={() => swiperInstance.slideNext()}>
                캠페인 참여방법 확인하기
              </StartButton>
            </SlideContent>
          </SwiperSlide>
          {/* 나머지 슬라이드 */}
          {Array.from({ length: 6 }).map((_, index) => (
            <SwiperSlide key={index}>
              <SlideContent>
                <CloseButton onClick={handleClose} $color="black" />
                {/* 각 슬라이드 내용 */}
                <h2>{`STEP ${index + 1}`}</h2>
                <p>{`이것은 페이지 ${index + 1}의 내용입니다.`}</p>
              </SlideContent>
            </SwiperSlide>
          ))}
        </CustomSwiper>
      </PopupContainer>
    </Overlay>
  )
}

export default OnboardingPopup

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
`

const Dimmed = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
`

const DoNotShowAgain = styled.button`
  position: absolute;
  bottom: 20px;
  right: 20px;
  color: white;
  background: transparent;
  border: none;
`

const PopupContainer = styled.div`
  position: relative;
  width: 90%;
  max-width: 400px;
  margin: auto;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border-radius: 10px;
  overflow: hidden;
`

const SlideContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 20px;
`

const CustomSwiper = styled(Swiper)`
  .swiper-pagination-bullet {
    border-radius: 50%;
    background-color: #fff;
    width: 0.7rem;
    height: 0.7rem;
    margin: 0 0.5rem;
  }

  .swiper-pagination-bullet-active {
    width: 2.4rem;
    border-radius: 0.5rem;
    background-color: var(--prim-L300);
  }

  .swiper-pagination {
    bottom: 2.4rem !important;
  }
`

const CloseButton = styled.button<CloseButtonProps>`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  width: 24px;
  height: 24px;
  cursor: pointer;

  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 0.2rem;
    height: 1.8rem;
    background-color: ${(props) => props.$color};
    top: 0.3rem;
    left: 1.2rem;
  }

  &::before {
    transform: rotate(45deg);
  }

  &::after {
    transform: rotate(-45deg);
  }
`

const StartButton = styled.button`
  margin-top: 20px;
`
