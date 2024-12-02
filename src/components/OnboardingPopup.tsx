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
import Title01 from "assets/onboarding-02-txt.png"
import Title02 from "assets/onboarding-03-txt.png"
import Title03 from "assets/onboarding-04-txt.png"
import Title04 from "assets/onboarding-05-txt.png"
import Title05 from "assets/onboarding-06-txt.png"
import Title06 from "assets/onboarding-07-txt.png"
import RevuIcon from "assets/revu_icon.svg?url"
import NaverIcon from "assets/ico-naver.svg?url"
import styled from "styled-components"

const slidesData = [
  {
    buttonText: "캠페인 참여방법 확인하기",
    imageSrc: Onboarding01,
  },
  {
    description: "네이버 계정으로 인증하고\n캠페인 참여하기",
    imageSrc: Onboarding02,
    imageTitle: Title01,
  },
  {
    description: "네이버에서 상품구매 후\n리뷰클릭에서 영수증인증하기",
    imageSrc: Onboarding03,
    imageTitle: Title02,
  },
  {
    description:
      "상품을 수령하면\n 네이버에서 구매확정하고\n 리뷰클릭에서 리뷰검수받기",
    imageSrc: Onboarding04,
    imageTitle: Title03,
  },
  {
    description:
      "리뷰 등록하러가기 클릭 후\n네이버에서 구매한 상품에\n 리뷰클릭에서 검수한 리뷰등록하기",
    imageSrc: Onboarding05,
    imageTitle: Title04,
  },
  {
    description: "네이버에 등록된 리뷰를 캡처 후\n리뷰클릭에서 리뷰인증하기",
    imageSrc: Onboarding06,
    imageTitle: Title05,
  },
  {
    description: "지금 바로 시작해볼까요?",
    imageSrc: Onboarding07,
    imageTitle: Title06,
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
          spaceBetween={60}
          loop={false}
          onSwiper={(swiper) => {
            setSwiperInstance(swiper)
            swiper.on("slideChange", () => {
              setActiveIndex(swiper.activeIndex)
            })
          }}
          allowSlideNext={activeIndex < totalSlides - 1}
        >
          {/* 첫 번째 슬라이드 */}
          {/* 슬라이드 데이터를 기반으로 슬라이드 생성 */}
          {slidesData.map((slide, index) => (
            <SwiperSlide key={index}>
              <SlideContent>
                <img
                  src={slide.imageSrc}
                  alt={`Onboarding Slide ${index + 1}`}
                />
                {slide.description && (
                  <InfoArea>
                    <InfoAreaTitle>
                      <img
                        src={slide.imageTitle}
                        alt={`Onboarding Slide Title ${index + 1}`}
                      />
                    </InfoAreaTitle>
                    <p>{slide.description}</p>
                  </InfoArea>
                )}
                {slide.buttonText && (
                  <StartButton onClick={() => swiperInstance.slideNext()}>
                    {slide.buttonText}
                    <IconArrow />
                  </StartButton>
                )}
              </SlideContent>
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
`

const SlideContent = styled.div`
  position: relative;
  width: 100%;
  border-radius: 2.8rem;
  overflow: hidden;
  background: white;
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
  width: 100%;
  display: flex;
  gap: 0.6rem;
  position: absolute;
  bottom: 3.5rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.9rem;
  font-weight: var(--font-weight-medium);
  color: var(--white);
  justify-content: center;
  align-items: center;
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

const InfoArea = styled.div`
  position: relative;
  height: 15.3rem;
  background: var(--white);
  border-radius: 0 0 2.8rem 2.8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  p {
    margin-top: 0.8rem;
    text-align: center;
    font-size: 1.7rem;
    font-weight: var(--font-weight-medium);
    line-height: 1.3;
    letter-spacing: calc(1.7rem * (-0.02 / 100));
    color: var(--n500-color);
  }
  p em {
    font-weight: var(--font-weight-bold);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    &::before {
      content: "";
      width: 1.2rem;
      height: 1.2rem;
    }
    &:nth-of-type(1) {
      color: var(--success-color);
      &::before {
        background: url("${NaverIcon}") no-repeat center / 100%;
      }
    }
    &:nth-of-type(2) {
      color: var(--revu-color);
      &::before {
        background: url("${RevuIcon}") no-repeat center / 0.8rem 0.8rem;
      }
    }
  }
`

const InfoAreaTitle = styled.div`
  height: 2rem;
`
