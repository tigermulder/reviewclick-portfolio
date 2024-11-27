import { useState } from "react"
import styled from "styled-components"
import { useSwipeable } from "react-swipeable"
import Banner1 from "assets/banner01.png"
import Banner2 from "assets/banner02.png"
import Banner3 from "assets/banner03.png"

const banners = [
  { type: "image", value: Banner1 },
  { type: "image", value: Banner2 },
  { type: "image", value: Banner3 },
]

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
        {banners.map((banner, index) => (
          <BannerItem key={index} banner={banner} />
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

const BannerContainer = styled.div<{ $currentIndex: number }>`
  display: flex;
  height: 100%;
  transition: transform 0.3s ease;
  transform: translateX(-${({ $currentIndex }) => $currentIndex * 100}%);
`

const BannerItem = ({
  banner,
}: {
  banner: { type: string; value: string }
}) => {
  if (banner.type === "image") {
    return <StyledBannerImage src={banner.value} alt="Banner Image" />
  } else {
    return <StyledBannerDiv style={{ backgroundColor: banner.value }} />
  }
}

const StyledBannerImage = styled.img`
  min-width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
`

const StyledBannerDiv = styled.div`
  min-width: 100%;
  height: 100%;
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
