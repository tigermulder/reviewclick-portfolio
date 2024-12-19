import ReuseHeader from "@/components/ReuseHeader"
import { useNavigate } from "react-router-dom"
import { RoutePath } from "@/types/route-path"
import { useParams } from "react-router-dom"
import { getNoticeItem } from "@/services/notice"
import useScrollToTop from "@/hooks/useScrollToTop"
import SeoHelmet from "@/components/SeoHelmet"
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
    <>
      <SeoHelmet
        title="리뷰클릭-Notice Detail"
        description="리뷰클릭은 제품과 서비스 전반에 걸친 다양한 사용자 리뷰를 한곳에서 제공합니다. 믿을 수 있는 평가와 상세한 리뷰로 현명한 소비를 지원합니다."
      />
      <Container>
        <ReuseHeader
          title="공지사항"
          onBack={() => navigate(RoutePath.Alert)}
        />
        <h3>{noticeDetail?.title}</h3>
        <p>{noticeDetail?.content}</p>
      </Container>
    </>
  )
}

export default NoticeDetail

const Container = styled.div`
  padding: 1.6rem;
  background-color: white;
  min-height: 80vh;
  border-radius: 1rem;

  h3 {
    padding: 0 3.2rem;
    margin: 0 auto;
    text-align: center;
    white-space: pre-line;
  }
  p {
    margin-top: 3.6rem;
    color: var(--N400);
    white-space: pre-line;
  }
`
