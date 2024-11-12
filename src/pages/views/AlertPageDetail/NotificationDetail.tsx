import ReuseHeader from "@/components/ReuseHeader"
import { useNavigate, useParams } from "react-router-dom"
import { RoutePath } from "@/types/route-path"
import IconNotify from "assets/ico-notify.svg?react"
import dummyImage from "assets/dummy-image.png"
import { getNotificationItem } from "@/services/notification"
import { useQuery } from "@tanstack/react-query"
import useScrollToTop from "@/hooks/useScrollToTop"
import styled from "styled-components"

const NotificationDetail = () => {
  const { notificationId } = useParams()
  const navigate = useNavigate()

  //** 스크롤 0부터시작 */
  useScrollToTop()

  const fetchNotifyDetail = async () => {
    const response = await getNotificationItem({
      notificationId: Number(notificationId),
    })
    return response
  }

  const { data, isFetching, error } = useQuery({
    queryKey: ["noticeDetail", notificationId],
    queryFn: fetchNotifyDetail,
    enabled: !!notificationId,
    staleTime: 0,
  })
  if (error && isFetching) {
    throw error
  }

  const notifyData = data?.notification
  return (
    <Container>
      <ReuseHeader title="새소식" onBack={() => navigate(RoutePath.Alert)} />
      <AlertLogo>
        <IconNotify />
      </AlertLogo>
      <AlertContainer>
        <Header>
          <p>리뷰참여완료</p>
          <span>리뷰 참여가 완료됐어요.</span>
        </Header>
        <Body>
          <BodyTitle>캠페인정보</BodyTitle>
          <BodyContainer>
            <ThumbArea>
              <img src={dummyImage} alt="나의캠페인 썸네일" />
            </ThumbArea>
            <InfoArea>
              <p>{notifyData?.title}</p>
              <span>7,500P</span>
            </InfoArea>
          </BodyContainer>
        </Body>
        <div>
          <FooterText>
            리뷰참여 시작 후 3시간 이내 해당 제품을 구매해야만 다음 단계로
            넘어갈 수 있어요.
          </FooterText>
        </div>
      </AlertContainer>
      <Time>
        <p>오후 4:46</p>
      </Time>
    </Container>
  )
}

export default NotificationDetail

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: start;
`

const AlertLogo = styled.div`
  width: 3rem;
  height: 3rem;
  flex-shrink: 0;

  svg {
    width: 100%;
    height: 100%;
  }
`

const AlertContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-left: 1.6rem;

  div {
    padding: 1rem 1.4rem;
    border-radius: 1rem;
    background: var(--white);
  }
`

const Header = styled.div`
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    right: 100%;
    transform: translateY(-50%);
    margin-top: -1rem;
    border-right: 1.2rem solid #fff;
    border-top: 0.2rem solid transparent;
    border-bottom: 0.6rem solid transparent;
    border-top-left-radius: 1rem;
  }
  p {
    display: inline-block;
    margin-right: 0.8rem;
    font-size: var(--font-h5-size);
    font-weight: var(--font-h5-weight);
    letter-spacing: var(--font-h5-letter-spacing);
    color: var(--prim-L300);
  }
  span {
    font-size: var(--font-bodyM-size);
    font-weight: var(--font-bodyM-weight);
    line-height: var(--font-bodyM-line-height);
    letter-spacing: var(--font-bodyM-letter-spacing);
    color: var(--n500-color);
  }
`

const Body = styled.div`
  padding: 1rem 1.4rem 1.4rem;
`

const BodyTitle = styled.p`
  font-size: var(--font-h5-size);
  font-weight: var(--font-h5-weight);
  letter-spacing: var(--font-h5-letter-spacing);
  color: var(--n600-color);
`

const BodyContainer = styled.div`
  margin-top: 0.6rem;
  display: flex;
  align-items: center;
  padding: 0 !important;
`

const ThumbArea = styled.div`
  width: 6.5rem;
  border-radius: 0.8rem;
  overflow: hidden;
  flex-shrink: 0;
`

const InfoArea = styled.div`
  margin-left: 0.8rem;
  p {
    font-size: var(--font-bodyM-size);
    font-weight: var(--font-bodyM-weight);
    line-height: var(--font-bodyM-line-height);
    letter-spacing: var(--font-bodyM-letter-spacing);
    color: var(--n500-color);
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  span {
    font-size: var(--font-h2-size);
    font-weight: var(--font-h2-weight);
    letter-spacing: var(--font-h2-letter-spacing);
  }
`

const FooterText = styled.p`
  font-size: var(--font-bodyM-size);
  font-weight: var(--font-bodyM-weight);
  line-height: var(--font-bodyM-line-height);
  letter-spacing: var(--font-bodyM-letter-spacing);
  color: var(--n500-color);
`

const Time = styled.div`
  margin-left: 0.6rem;
  font-size: var(--font-callout-small-size);
  font-weight: var(--font-callout-small-weight);
  letter-spacing: var(--font-callout-small-letter-spacing);
  color: var(--n100-color);
  align-self: flex-end;
  flex-shrink: 0;
`
