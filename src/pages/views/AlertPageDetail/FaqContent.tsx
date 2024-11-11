import IconNew from "assets/ico-new.svg?react"
import IconArrowRight from "assets/ico_arr_right.svg?url"
import { useQuery } from "@tanstack/react-query"
import { getNoticeList } from "@/services/notice"
import { getFaqList } from "@/services/faq"
import { RoutePath } from "@/types/route-path"
import { Link } from "react-router-dom"
import FaqItem from "./FaqItem"
import styled from "styled-components"

const FaqContent = () => {
  //** 리액트쿼리 나의 공지사항리스트 */
  const fetchNoticeList = async ({ queryKey }: { queryKey: string[] }) => {
    const [_key] = queryKey
    const requestData = {
      pageSize: 20,
      pageIndex: 1,
    }
    const response = await getNoticeList(requestData)
    return response
  }
  const { data: noticeData } = useQuery({
    queryKey: ["noticeList"],
    queryFn: fetchNoticeList,
    refetchOnMount: true,
    staleTime: 0,
  })
  //** 리액트쿼리 나의 공지사항리스트 */
  const fetchFaqList = async ({ queryKey }: { queryKey: string[] }) => {
    const [_key] = queryKey
    const requestData = {
      pageSize: 20,
      pageIndex: 1,
    }
    const response = await getFaqList(requestData)
    return response
  }
  const { data: faqData } = useQuery({
    queryKey: ["faqList"],
    queryFn: fetchFaqList,
    refetchOnMount: true,
    staleTime: 0,
  })
  const noticeList = noticeData?.list
  const faqList = faqData?.list

  return (
    <Container>
      <NoticeSection>
        <h3>공지사항</h3>
        <ListContainer>
          {noticeList?.map((noticeItem) => {
            return (
              <li key={noticeItem.noticeId}>
                <StyledLink
                  to={RoutePath.NoticeDetail(`${noticeItem.noticeId}`)}
                >
                  <NotifyMessage>
                    <IconNew />
                    {noticeItem.title}
                  </NotifyMessage>
                </StyledLink>
              </li>
            )
          })}
        </ListContainer>
      </NoticeSection>
      <section>
        <h3>FAQ</h3>
        <ListContainer>
          {faqList?.map((faqItem) => {
            return <FaqItem key={faqItem.faqId} faqItem={faqItem} />
          })}
        </ListContainer>
      </section>
    </Container>
  )
}

export default FaqContent

const Container = styled.div`
  margin-top: 4rem;

  section h3 {
    font-weight: var(--font-weight-bold);
    font-size: 1.8rem;
    color: var(--black);
    letter-spacing: -0.5px;
  }
`

const NoticeSection = styled.section`
  margin-bottom: 4rem;

  ul li a::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    width: 2.4rem;
    height: 2.4rem;
    background: url("${IconArrowRight}") no-repeat center / 100%;
  }
`

const ListContainer = styled.ul`
  margin-top: 0.8rem;
  li {
    padding: 2.2rem 0;
    display: flex;
    border-bottom: 0.1rem solid var(--whitesmoke);
  }
`

const NotifyMessage = styled.p`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-top: 0.4rem;
  font-size: var(--font-h5-size);
  font-weight: var(--font-h5-weight);
  line-height: var(--font-h5-line-height);
  letter-spacing: var(--font-h5-letter-spacing);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  img {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 2.4rem;
    height: 2.4rem;
    transition: transform 0.15s ease-in;
  }

  img.active {
    transform: translateY(-50%) rotate(180deg);
  }
`

const StyledLink = styled(Link)`
  position: relative;
  display: block;
  width: 100%;
`
