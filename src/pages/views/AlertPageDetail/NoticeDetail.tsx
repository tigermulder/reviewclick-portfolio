import ReuseHeader from "@/components/ReuseHeader"
import { useNavigate } from "react-router-dom"
import { RoutePath } from "@/types/route-path"
import { useParams } from "react-router-dom"
import { getNoticeItem } from "@/services/notice"
import useScrollToTop from "@/hooks/useScrollToTop"
import { useQuery } from "@tanstack/react-query"
import styled from "styled-components"

const NoticeDetail = () => {
  const { noticeId } = useParams()
  const navigate = useNavigate()

  //** 스크롤 0부터시작 */
  useScrollToTop()

  const fetchNoticeDetail = async () => {
    const response = await getNoticeItem({
      noticeId: Number(noticeId),
    })
    return response
  }

  const { data } = useQuery({
    queryKey: ["noticeDetail", noticeId],
    queryFn: fetchNoticeDetail,
    enabled: !!noticeId,
    staleTime: 0,
    refetchOnMount: false,
  })
  const noticeDetail = data?.notice

  return (
    <Container>
      <ReuseHeader title="공지사항" onBack={() => navigate(RoutePath.Alert)} />
      <h2>{noticeDetail?.title}</h2>
      <p>{noticeDetail?.content}</p>
    </Container>
  )
}

export default NoticeDetail

const Container = styled.div`
  padding: 1.5rem;
  background: var(--white);
  min-height: 80vh;
  border-radius: 1rem;

  h2 {
    font-size: var(--font-h3-size);
    font-weight: var(--font-h3-weight);
    letter-spacing: var(--font-h3-letter-spacing);
    text-align: center;
  }
  p {
    margin-top: 3.6rem;
    font-size: 1.4rem;
    font-weight: var(--font-weight-medium);
    color: var(--n400-color);
  }
`
