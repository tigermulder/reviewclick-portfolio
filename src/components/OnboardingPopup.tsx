import { useState, useEffect } from "react"
import {
  OnboardingPopupProps,
  CloseButtonProps,
} from "@/types/component-types/onboarding-popup"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import IconCheck from "assets/ico_onboarding_check.svg?react"
import IconArrow from "assets/ico_onboard_arrow.svg?react"
import Onboarding01 from "assets/onboarding-01.png"
import Onboarding02 from "assets/onboarding-02.png"
import Onboarding03 from "assets/onboarding-03.png"
import Onboarding04 from "assets/onboarding-04.png"
import Onboarding05 from "assets/onboarding-05.png"
import Onboarding06 from "assets/onboarding-06.png"
import Onboarding07 from "assets/onboarding-07.png"
import styled from "styled-components"

const slidesData = [
  {
    buttonText: "캠페인 참여방법 확인하기",
    backgroundImage: `url("${Onboarding01}")`,
  },
  {
    title: "STEP 2",
    description: "이것은 페이지 2의 내용입니다.",
    backgroundImage: `url(${Onboarding02})`,
  },
  {
    title: "STEP 3",
    description: "이것은 페이지 3의 내용입니다.",
    backgroundImage: `url(${Onboarding03})`,
  },
  {
    title: "STEP 4",
    description: "이것은 페이지 4의 내용입니다.",
    backgroundImage: `url(${Onboarding04})`,
  },
  {
    title: "STEP 5",
    description: "이것은 페이지 5의 내용입니다.",
    backgroundImage: `url(${Onboarding05})`,
  },
  {
    title: "STEP 6",
    description: "이것은 페이지 6의 내용입니다.",
    backgroundImage: `url(${Onboarding06})`,
  },
  {
    title: "미션 성공!",
    description: "이것은 페이지 7의 내용입니다.",
    backgroundImage: `url(${Onboarding07})`,
  },
]

const OnboardingPopup = ({ onClose }: OnboardingPopupProps) => {
  const [showPopup, setShowPopup] = useState(true)
  const [swiperInstance, setSwiperInstance] = useState<any>(null)
  const [activeIndex, setActiveIndex] = useState(0) // 현재 슬라이드 인덱스 상태
  const [doNotShowAgainChecked, setDoNotShowAgainChecked] = useState(false) // 체크박스 상태 추가
  const totalSlides = 7

  useEffect(() => {
    const doNotShowAgain = localStorage.getItem("doNotShowOnboardingToday")
    if (doNotShowAgain === "true") {
      setShowPopup(false)
    }
  }, [])

  //** 스크롤 방지 */
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

  //** 체크박스 상태 변경 핸들러 */
  const handleDoNotShowAgainChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDoNotShowAgainChecked(e.target.checked)
  }

  const handleClose = () => {
    if (doNotShowAgainChecked) {
      localStorage.setItem("doNotShowOnboardingToday", "true")
    }
    setShowPopup(false)
    onClose()
  }

  if (!showPopup) return null

  return (
    <Overlay>
      <Dimmed />
      <PopupContainer>
        <CustomSwiper
          slidesPerView={1}
          allowTouchMove={true}
          // Swiper의 기본 페이지네이션은 이미 제거됨
          onSwiper={(swiper) => {
            setSwiperInstance(swiper)
            swiper.on("slideChange", () => {
              setActiveIndex(swiper.activeIndex)
            })
          }}
        >
          {/* 첫 번째 슬라이드 */}
          {/* 슬라이드 데이터를 기반으로 슬라이드 생성 */}
          {slidesData.map((slide, index) => (
            <SwiperSlide key={index}>
              <SlideContent backgroundImage={slide.backgroundImage}>
                <p>{slide.description}</p>
                {slide.buttonText && (
                  <StartButton onClick={() => swiperInstance.slideNext()}>
                    {slide.buttonText}
                    <IconArrow />
                  </StartButton>
                )}
              </SlideContent>
            </SwiperSlide>
          ))}
          {/* 나머지 슬라이드 */}
          {slidesData.map((slide, index) => (
            <SwiperSlide key={index}>
              <SlideContent
                backgroundImage={slide.backgroundImage}
              ></SlideContent>
            </SwiperSlide>
          ))}
        </CustomSwiper>
        {/* 커스텀 페이지네이션 */}
        <PaginationContainer>
          {Array.from({ length: totalSlides }).map((_, index) => (
            <PaginationBullet
              key={index}
              active={index === activeIndex}
              onClick={() => swiperInstance.slideTo(index)}
            />
          ))}
        </PaginationContainer>
        {/* 닫기버튼 */}
        <CloseButton
          onClick={handleClose}
          $color={"var(--white)"}
          aria-label="닫기"
        />
        {/* 오늘 하루 보지 않기 체크박스 */}
        <DoNotShowAgain>
          <CheckboxLabel>
            <input
              type="checkbox"
              checked={doNotShowAgainChecked}
              onChange={handleDoNotShowAgainChange}
            />
            <IconCheck />
            <span>오늘 하루 보지 않기</span>
          </CheckboxLabel>
        </DoNotShowAgain>
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
  z-index: 999;
`

const Dimmed = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
`

const DoNotShowAgain = styled.div`
  position: absolute;
  top: -3rem;
  left: 1.5rem;
  color: var(--n80-color);
  background: transparent;
  border: none;
  font-size: 1.4rem;
`
const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  font-weight: var(--font-bodyM-weight);
  cursor: pointer;

  input {
    display: none;
  }

  svg {
    color: rgba(243, 245, 247, 0.2);
    width: 1.6rem;
    height: 1.6rem;
    margin-right: 0.6rem;
    transition: color 0.2s;
  }

  input:checked + svg {
    color: var(--white);
  }
`

const PopupContainer = styled.div`
  position: relative;
  width: 90%;
  max-width: 400px;
  margin: auto;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border-radius: 2.8rem;
  overflow: hidden;
`

const SlideContent = styled.div<{ backgroundImage: string }>`
  position: relative;
  width: 100%;
  height: 70vh;
  padding: 2.5rem;
  background-image: ${(props) => props.backgroundImage};
  background-size: cover; /* 배경 이미지 크기 조절 */
  background-position: center; /* 배경 이미지 위치 조절 */
  background-repeat: no-repeat; /* 배경 이미지 반복 방지 */
`

const CustomSwiper = styled(Swiper)`
  height: 100%;
`

const CloseButton = styled.button<CloseButtonProps>`
  position: absolute;
  top: -3rem;
  right: 1.5rem;
  background: transparent;
  border: none;
  width: 2rem;
  height: 2rem;
  cursor: pointer;
  z-index: 11;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    width: 0.1rem;
    height: 1.8rem;
    background-color: ${(props) => props.$color};
  }

  &::before {
    transform: rotate(45deg);
  }

  &::after {
    transform: rotate(-45deg);
  }
`

const Title = styled.h2`
  color: var(--white);
  font-size: var(--font-h3-size);
  font-weight: var(--font-weight-bold);
  letter-spacing: -0.36px;
`

const StartButton = styled.button`
  display: flex;
  gap: 0.6rem;
  position: absolute;
  bottom: 3.5rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: var(--font-h3-size);
  color: var(--white);
`

const PaginationContainer = styled.div`
  position: absolute;
  bottom: -2.4rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  z-index: 10;
`

const PaginationBullet = styled.button<{ active: boolean }>`
  border-radius: ${(props) => (props.active ? "0.5rem" : "50%")};
  background-color: ${(props) =>
    props.active ? "var(--prim-L300)" : "var(--n80-color)"};
  width: ${(props) => (props.active ? "2.4rem" : "0.7rem")};
  height: 0.7rem;
  margin: 0 0.5rem;
  border: none;
  cursor: pointer;
`
