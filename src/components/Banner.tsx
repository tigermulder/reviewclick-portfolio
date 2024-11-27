import { useState } from "react"
import styled from "styled-components"
import { useSwipeable } from "react-swipeable"
import {
  BannerContainerProps,
  BannerItemProps,
} from "@/types/component-types/banner-type"

const banners = ["#D32F2F", "#F48FB1", "#C2185B", "#E57373", "#FFCDD2"]

const BannerSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleSwipedLeft = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length)
  }

  const handleSwipedRight = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    )
  }

  const handlers = useSwipeable({
    onSwipedLeft: handleSwipedLeft,
    onSwipedRight: handleSwipedRight,
    touchEventOptions: { passive: false },
    trackMouse: true,
  })

  return (
    <BannerWrapper {...handlers}>
      <BannerContainer $currentIndex={currentIndex}>
        {banners.map((color, index) => (
          <BannerItem key={index} color={color} />
        ))}
      </BannerContainer>
      <Indicator>{`${currentIndex + 1} / ${banners.length}`}</Indicator>
    </BannerWrapper>
  )
}

export default BannerSlider

const BannerWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 210px;
  overflow: hidden;
  margin: 8rem 0 1.6rem;
  border-radius: 10px;
`

const BannerItem = styled.div<BannerItemProps>`
  min-width: 100%;
  height: 100%;
  background-color: ${({ color }) => color};
  border-radius: 10px;
`

const Indicator = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
`

const BannerContainer = styled.div<BannerContainerProps>`
  display: flex;
  height: 100%;
  transition: transform 0.3s ease;
  transform: translateX(-${({ $currentIndex }) => $currentIndex * 100}%);
`
