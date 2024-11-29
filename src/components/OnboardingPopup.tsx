import { useState, useEffect } from "react"
import {
  OnboardingPopupProps,
  CloseButtonProps,
} from "@/types/component-types/onboarding-popup"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import styled from "styled-components"

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
          <SwiperSlide>
            <SlideContent>
              {/* 첫 번째 슬라이드 내용 */}
              <FirstPageTitle>
                스마트한 쇼핑 생활 <br />
                리워드 플랫폼
              </FirstPageTitle>
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
                {/* 각 슬라이드 내용 */}
                <Title>
                  {index + 1 === 6 ? "미션 성공!" : `STEP ${index + 1}`}
                </Title>
                <p>{`이것은 페이지 ${index + 1}의 내용입니다.`}</p>
              </SlideContent>
            </SwiperSlide>
          ))}
          <CloseButton onClick={handleClose} $color="var(--n500-color)" />
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
        {/* 오늘 하루 보지 않기 체크박스 */}
        <DoNotShowAgain>
          <label>
            <Checkbox
              type="checkbox"
              checked={doNotShowAgainChecked}
              onChange={handleDoNotShowAgainChange}
            />
            <span>오늘 하루 보지 않기</span>
          </label>
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
  z-index: 9999;
`

const Dimmed = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
`

const DoNotShowAgain = styled.div`
  position: absolute;
  top: -3rem;
  left: 0%;
  color: var(--n80-color);
  background: transparent;
  border: none;
  font-size: 1.4rem;

  label {
    display: flex;
    align-items: center;
  }
`

const Checkbox = styled.input`
  margin-right: 0.5rem;
  width: 1.6rem;
  height: 1.6rem;
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
`

const SlideContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  padding: 2.5rem;
`

const CustomSwiper = styled(Swiper)`
  height: 100%;
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

const FirstPageTitle = styled.h2`
  font-size: 2.4rem;
  color: #33373a;
  font-weight: var(--font-weight-medium);
  letter-spacing: -0.48px;
`

const Title = styled.h2`
  color: var(--white);
  font-size: var(--font-h3-size);
  font-weight: var(--font-weight-bold);
  letter-spacing: -0.36px;
`

const StartButton = styled.button`
  margin-top: 20px;
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
  transition: width 0.3s ease;
`
