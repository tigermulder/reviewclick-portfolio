import IconNew from "assets/ico-new.svg?react"
import IconArrowRight from "assets/ico_arr_right.svg?url"
import { useSuspenseQuery } from "@tanstack/react-query"
import { getNoticeList } from "@/services/notice"
import { RoutePath } from "@/types/route-path"
import { Link } from "react-router-dom"
import styled from "styled-components"

const Announcement = () => {
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
  const { data } = useSuspenseQuery({
    queryKey: ["noticeList"],
    queryFn: fetchNoticeList,
    staleTime: 0,
    refetchOnMount: false,
  })
  const noticeList = data?.list

  return (
    <NoticeSection>
      <ListContainer>
        {noticeList && noticeList.length > 0 ? (
          noticeList.map((noticeItem) => (
            <li key={noticeItem.noticeId}>
              <StyledLink to={RoutePath.NoticeDetail(`${noticeItem.noticeId}`)}>
                <NotifyMessage>
                  <IconNew />
                  {noticeItem.title}
                </NotifyMessage>
              </StyledLink>
            </li>
          ))
        ) : (
          <NoNoticeContainer>
            <NoNoticeMessage>공지사항이 없습니다.</NoNoticeMessage>
          </NoNoticeContainer>
        )}
      </ListContainer>
    </NoticeSection>
  )
}

export default Announcement

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
  font-weight: 500;
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

const NoNoticeContainer = styled.div`
  height: 70vh;
  display: flex;;
  justify-content: center;
  align-items: center;
}
`

const NoNoticeMessage = styled.p`
  padding: 2.2rem 0;
  text-align: center;
  color: var(--n400-color);
  font-size: var(--font-bodyM-size);
  font-weight: var(--font-bodyM-weight);
`
