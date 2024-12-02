import { useState, useEffect } from "react"
import {
  OnboardingPopupProps,
  CloseButtonProps,
  InfoAreaTitleProps,
  IcoHandProps,
} from "@/types/component-types/onboarding-popup"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import { SlideData } from "@/types/component-types/onboarding-popup"
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
import RevuIcon from "assets/main-logo-img.svg?url"
import NaverIcon from "assets/ico-naver.svg?url"
import HandIcon01 from "assets/onboarding-hand-01.png"
import HandIcon02 from "assets/onboarding-hand-02.png"
import IconStar from "assets/onboarding-07-ico.svg?url"
import Button from "@/components/Button"
import styled, { keyframes, css } from "styled-components"

const slidesData: SlideData[] = [
  {
    buttonText: "캠페인 참여방법 확인하기",
    imageSrc: Onboarding01,
  },
  {
    description: (
      <p>
        캠페인 신청하고
        <br />
        네이버 계정 인증하기(최초1회)
      </p>
    ),
    imageSrc: Onboarding02,
    imageTitle: Title01,
    handIcon: HandIcon01,
    animationButton: <Button $variant="onboarding01">스크롤 내리기</Button>,
  },
  {
    description: (
      <p>
        네이버에서 <em>상품구매</em> 후 <br />
        리뷰클릭에서 <em>영수증인증</em>하기
      </p>
    ),
    imageSrc: Onboarding03,
    imageTitle: Title02,
    handIcon: HandIcon02,
    animationButton: (
      <Button $variant="onboarding02">2. 구매영수증 업로드</Button>
    ),
  },
  {
    description: (
      <p>
        상품을 수령하면
        <br />
        네이버에서 <em>구매확정</em>하고
        <br />
        리뷰클릭에서 <em>리뷰검수</em>받기
      </p>
    ),
    imageSrc: Onboarding04,
    imageTitle: Title03,
  },
  {
    description: (
      <p>
        <em>리뷰 등록하러가기</em> 클릭 후<br />
        네이버에서 구매한 상품에
        <br />
        리뷰클릭에서 검수한 <em>리뷰등록</em>하기
      </p>
    ),
    imageSrc: Onboarding05,
    imageTitle: Title04,
  },
  {
    description: (
      <p>
        네이버에 등록된 리뷰를 캡처 후<br />
        리뷰클릭에서 <em>리뷰인증</em>하기
      </p>
    ),
    imageSrc: Onboarding06,
    imageTitle: Title05,
    handIcon: HandIcon02,
    animationButton: (
      <Button $variant="onboarding02">등록 리뷰 캡처 업로드</Button>
    ),
  },
  {
    description: <p>지금 바로 시작해볼까요?</p>,
    imageSrc: Onboarding07,
    imageTitle: Title06,
    LastButtonText: "캠페인 참여하러 가기",
  },
]

const OnboardingPopup = ({ onClose }: OnboardingPopupProps) => {
  const [showPopup, setShowPopup] = useState(true)
  const [swiperInstance, setSwiperInstance] = useState<any>(null)
  const [activeIndex, setActiveIndex] = useState(0) // 현재 슬라이드 인덱스 상태
  const [doNotShowAgainChecked, setDoNotShowAgainChecked] = useState(false) // 체크박스 상태 추가
  const [buttonChanged, setButtonChanged] = useState(false) // 추가된 상태
  const totalSlides = 7

  useEffect(() => {
    const doNotShowAgain = sessionStorage.getItem("doNotShowOnboardingToday")
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

  // ** 슬라이드 전환 시 버튼 변경 타이머 설정
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (activeIndex === 1) {
      // 특정 슬라이드 인덱스
      timer = setTimeout(() => {
        setButtonChanged(true)
      }, 1500) // 1.5초 후에 실행
    } else {
      setButtonChanged(false) // 다른 슬라이드로 이동 시 상태 초기화
    }

    return () => {
      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [activeIndex])

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
                <ThumbArea>
                  <img
                    src={slide.imageSrc}
                    alt={`Onboarding Slide ${index + 1}`}
                  />
                  <AnimationBox>
                    {slide.animationButton &&
                      (index === 1 && activeIndex === 1 ? (
                        buttonChanged ? (
                          <Button $variant="onboarding01">
                            캠페인 신청하기
                          </Button>
                        ) : (
                          <Button $variant="onboarding01">스크롤 내리기</Button>
                        )
                      ) : (
                        slide.animationButton
                      ))}
                    {slide.handIcon && (
                      <IcoHand
                        src={slide.handIcon}
                        alt="handIcon"
                        $animate={index === 1 && activeIndex === 1}
                      />
                    )}
                  </AnimationBox>
                </ThumbArea>

                {slide.description && (
                  <InfoArea>
                    <InfoAreaTitle
                      src={slide.imageTitle}
                      alt={`Onboarding Slide Title ${index + 1}`}
                      isLast={index === totalSlides - 1}
                    />
                    {slide.description}
                    {slide.LastButtonText && (
                      <LastButton onClick={handleClose} aria-label="닫기">
                        {slide.LastButtonText}
                      </LastButton>
                    )}
                  </InfoArea>
                )}
                {slide.buttonText && (
                  <StartButton
                    onClick={() => swiperInstance.slideNext()}
                    aria-label="다음 슬라이드로 이동"
                  >
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
  width: 100%;
  max-width: 32rem;
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
  z-index: 10;
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

const ThumbArea = styled.div`
  position: relative;
  z-index: 10;
`

const InfoArea = styled.div`
  position: relative;
  height: 15.3rem;
  background: var(--snowwhite);
  display: flex;
  gap: 0.8rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  p {
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

const InfoAreaTitle = styled.img<InfoAreaTitleProps>`
  height: ${(props) => (props.isLast ? "2.8rem" : "2rem")};
`

const LastButton = styled.button`
  width: 82%;
  margin-top: 1.1rem;
  padding: 0.8rem 0;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(
    90deg,
    rgba(117, 125, 130, 1) 19.929147191072637%,
    rgba(117, 125, 130, 1) 20.929153302577156%,
    rgba(229, 11, 20, 1) 79.92951388134382%
  );
  color: var(--white);
  font-size: var(--font-callout-size);
  font-weight: var(--font-callout-weight);
  letter-spacing: var(--font-callout-letter-spacing);
  border-radius: 2.8rem;

  &::before {
    content: "";
    position: absolute;
    left: 2rem;
    width: 1rem;
    height: 1rem;
    background: url("${IconStar}") no-repeat center / 100%;
  }
  &::after {
    content: "";
    position: absolute;
    right: 2rem;
    width: 1rem;
    height: 1rem;
    background: url("${IconStar}") no-repeat center / 100%;
  }
`

const AnimationBox = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 1.3rem;
  width: 100%;
  padding: 0 3rem;
`

const handAnimation = keyframes`
  0% { transform: scale(1); }
  20% { transform: scale(1.4); }
  25% { transform: scale(1.3); }
  40% { transform: scale(1.4); }
  55% { transform: scale(1.3); }
  100% { transform: scale(1.3); }
`

const IcoHand = styled.img<IcoHandProps>`
  position: absolute;
  top: ${(props) => (props.$animate ? "-4.3rem" : "0.6rem")};
  right: ${(props) => (props.$animate ? "2.3rem" : "2.8rem")};
  width: 6rem;
  animation: ${(props) =>
    props.$animate
      ? css`
          ${handAnimation} 1.8s linear forwards
        `
      : "none"};
  transition: transform 0.3s ease;
`
