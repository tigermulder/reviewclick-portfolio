import ReuseHeader from "@/components/ReuseHeader"
import { useNavigate } from "react-router-dom"
import { RoutePath } from "@/types/route-path"
import dummyImage from "assets/dummy-image.png"
import styled from "styled-components"

const MyPointPage = () => {
  const navigate = useNavigate()
  return (
    <MyPointContainer>
      <ReuseHeader
        title="포인트 적립 내역"
        onBack={() => navigate(RoutePath.UserProfile)}
      />
      <MyPoinListContainer>
        <li>
          <MyPointCard>지급완료</MyPointCard>
          <MyPointWrapper>
            <ReviewCardThumb>
              <img src={dummyImage} alt="나의캠페인 썸네일" />
              {/* {isEnded && <DimmedBackground />}
              <RemainingDays $isEnded={isEnded}>
                {isEnded ? "종료" : remainingTime}
              </RemainingDays>
              {isEnded && <EndedOverlay />} */}
            </ReviewCardThumb>
            <ReviewCardInfo>
              <CardDate>2024.8.5 16:46</CardDate>
              <CardTitle>[리뷰] 00베이커리 모찌빵 말줄임</CardTitle>
              <CardPoint>25000P</CardPoint>
            </ReviewCardInfo>
          </MyPointWrapper>
        </li>
      </MyPoinListContainer>
    </MyPointContainer>
  )
}

export default MyPointPage

const MyPointContainer = styled.div`
  padding: 6rem 0;
`

const MyPoinListContainer = styled.ul`
  li {
    background: var(--white);
    padding: 1.3rem 2.3rem 1.8rem;
    border-radius: 0.8rem;
    overflow: hidden;
  }
`

const MyPointCard = styled.p`
  font-size: var(--font-h5-size);
  font-weight: var(--font-h5-weight);
  line-height: var(--font-h5-line-height);
  letter-spacing: var(--font-h5-letter-spacing);
`

const MyPointWrapper = styled.div`
  margin-top: 1.4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const ReviewCardThumb = styled.div`
  position: relative;
  width: 8.1rem;
  height: 8.1rem;
  overflow: hidden;
  border-radius: 1rem;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
  }
`

const DimmedBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
`

interface RemainingDaysProps {
  $isEnded: boolean
}
const RemainingDays = styled.span.attrs<RemainingDaysProps>((props) => ({
  "aria-label": props.$isEnded ? "캠페인이 종료되었습니다" : "캠페인 남은 일수",
  "data-is-ended": props.$isEnded,
}))<RemainingDaysProps>`
  position: absolute;
  bottom: ${({ $isEnded }) => ($isEnded ? "50%" : "0.7rem")};
  left: ${({ $isEnded }) => ($isEnded ? "50%" : "0")};
  transform: ${({ $isEnded }) => ($isEnded ? "translate(-50%, 50%)" : "none")};
  background-color: black;
  color: white;
  padding: 0.2rem 0.6rem;
  border-radius: 0.2rem;
  font-size: var(--font-caption-size);
  font-weight: var(--font-caption-weight);
  line-height: var(--font-caption-line-height);
  letter-spacing: var(--font-caption-letter-spacing);
  z-index: 2;
`

const EndedOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1;
  pointer-events: none;
`

const ReviewCardInfo = styled.div`
  margin-left: 1.4rem;
  flex-grow: 1;
  min-width: 0;
`

const CardDate = styled.p`
  font-size: var(--font-caption-size);
  font-weight: var(--font-caption-weight);
  line-height: var(--font-caption-line-height);
  letter-spacing: var(--font-caption-letter-spacing);
  color: var(--quicksilver);
`

const CardTitle = styled.span`
  display: block;
  width: 100%;
  margin-top: 0.4rem;
  padding-right: 1rem;
  font-size: var(--font-bodyM-size);
  font-weight: var(--font-bodyM-weight);
  line-height: var(--font-bodyM-line-height);
  letter-spacing: var(--font-bodyM-letter-spacing);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const CardPoint = styled.p`
  margin-top: 0.2rem;
  font-size: var(--font-h4-size);
  font-weight: var(--font-h4-weight);
  letter-spacing: var(--font-h4-letter-spacing);
`
