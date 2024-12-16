import ReuseHeader from "@/components/ReuseHeader"
import { useNavigate, useParams } from "react-router-dom"
import { RoutePath } from "@/types/route-path"
import IconNotify from "assets/ico-notify.svg?react"
import dummyImage from "assets/dummy-image.png"
import { getNotificationItem } from "@/services/notification"
import { useQuery } from "@tanstack/react-query"
import useScrollToTop from "@/hooks/useScrollToTop"
import styled from "styled-components"
import { parseTitle } from "@/utils/util"
import {
  formatTalkTime,
  formatTalkDate,
  convertBrToNewline,
} from "@/utils/util"

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

  const { data } = useQuery({
    queryKey: ["noticeDetail", notificationId],
    queryFn: fetchNotifyDetail,
    enabled: !!notificationId,
    staleTime: 0,
    refetchOnMount: false,
  })

  const notifyData = data?.notification
  const thumbnailUrl = notifyData?.cardInfoReview?.thumbnailUrl || dummyImage
  const { status, mainText } = parseTitle(notifyData?.title)
  const userTime = notifyData?.createdAt as string

  return (
    <Container>
      <ReuseHeader title="새소식" onBack={() => navigate(RoutePath.Alert)} />
      <AlertLogo>
        <IconNotify />
      </AlertLogo>
      <AlertContainer>
        <YearDay>{formatTalkDate(userTime)}</YearDay>
        <Header>
          <p>
            <span>{status}</span>
            {mainText}
          </p>
        </Header>
        {notifyData?.cardInfoReview && (
          <Body>
            <BodyTitle>캠페인정보</BodyTitle>
            <BodyContainer>
              <ThumbArea>
                <img src={thumbnailUrl} alt="나의캠페인 썸네일" />
              </ThumbArea>
              <InfoArea>
                <p>{notifyData?.cardInfoReview?.title}</p>
                <span>
                  {notifyData?.cardInfoReview?.reward.toLocaleString()}P
                </span>
              </InfoArea>
            </BodyContainer>
          </Body>
        )}

        {notifyData?.cardInfoQnaAnswer ? (
          <QnAContainer>
            <AnswerTitle>
              A. {convertBrToNewline(notifyData.cardInfoQnaAnswer.answer)}
            </AnswerTitle>
            <Separator />
            <AnswerContent>
              Q. {notifyData.cardInfoQnaAnswer.question}
            </AnswerContent>
          </QnAContainer>
        ) : (
          <div>
            <FooterText>{notifyData?.content}</FooterText>
          </div>
        )}
      </AlertContainer>
      <Time>
        <p>{formatTalkTime(userTime)}</p>
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
  width: 2.6rem;
  height: 2.6rem;
  flex-shrink: 0;
  margin-top: 2.2rem;

  svg {
    width: 100%;
    height: 100%;
    color: var(--L600);
  }
`

const AlertContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-left: 1.6rem;

  div {
    padding: 1rem 1.4rem;
    border-radius: 1rem;
    background-color: white;
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
    border-right: 1.2rem solid white;
    border-top: 0.2rem solid transparent;
    border-bottom: 0.6rem solid transparent;
    border-top-left-radius: 1rem;
  }
  p {
    font-size: var(--font-body-size);
    color: var(--N500);

    span {
      margin-right: 0.4rem;
      color: var(--L600);
      font-weight: var(--font-bold);
    }
  }
`

const Body = styled.div`
  padding: 1rem 1.4rem 1.4rem;
`

const BodyTitle = styled.p`
  font-size: var(--font-h5-size);
  color: var(--N600);
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
  padding: 0 1.4rem !important;
  margin-left: 0.8rem;
  p {
    font-size: var(--font-body-size);
    color: var(--N500);
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  span {
    font-size: var(--font-h2-size);
    font-weight: var(--font-medium);
  }
`

const FooterText = styled.p`
  font-size: var(--font-body-size);
  white-space: pre-line;
  color: var(--N500);
`

const YearDay = styled.p`
  font-size: var(--caption-small-size);
  color: var(--N100);
  text-align: center;
`

const Time = styled.span`
  margin-left: 0.6rem;
  font-size: var(--caption-small-size);
  color: var(--N100);
  align-self: flex-end;
  flex-shrink: 0;
`

const QnAContainer = styled.div`
  background: white;
  border-radius: 10px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 0.4rem;
  display: inline-flex;
`

const AnswerTitle = styled.p`
  font-size: var(--font-body-size);
  color: var(--N500);
  white-space: pre-line;
`

const Separator = styled.span`
  width: 100%;
  height: 0px;
  margin: 0.4rem 0;
  border: 1px solid var(--N40);
`

const AnswerContent = styled.p`
  font-size: var(--font-body-size);
  color: var(--N100);
`
