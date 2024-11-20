import { getNotificationList } from "@/services/notification"
import { useQuery } from "@tanstack/react-query"
import IconNotify from "assets/ico-notify.svg?react"
import { formatDate } from "@/utils/util"
import { Link } from "react-router-dom"
import { RoutePath } from "@/types/route-path"
import styled from "styled-components"

const NewsContent = () => {
  //** 리액트쿼리 나의 알림리스트 */
  const fetchNotificationList = async ({
    queryKey,
  }: {
    queryKey: string[]
  }) => {
    const [_key] = queryKey
    const requestData = {
      pageSize: 20,
      pageIndex: 1,
    }
    const response = await getNotificationList(requestData)
    return response
  }
  const { data } = useQuery({
    queryKey: ["notificationList"],
    queryFn: fetchNotificationList,
    refetchOnMount: true,
    staleTime: 0,
  })
  const notificationList = data?.list

  return (
    <NoticeContainer>
      {notificationList?.map((notificationItem) => {
        return (
          <li key={notificationItem.notificationId}>
            <StyledLink
              to={RoutePath.NotificationDetail(
                `${notificationItem.notificationId}`
              )}
            >
              <NotifyDate>
                <IconNotify />
                {formatDate(notificationItem.createdAt)}
              </NotifyDate>
              <NotifyMessage>{notificationItem.title}</NotifyMessage>
            </StyledLink>
          </li>
        )
      })}
    </NoticeContainer>
  )
}

export default NewsContent

const NoticeContainer = styled.ul`
  min-height: 100vh;
  li {
    position: relative;
    padding: 1.8rem 0;
    display: flex;

    border-bottom: 0.1rem solid var(--whitesmoke);
  }
`

const NotifyDate = styled.p`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: var(--font-bodyM-size);
  font-weight: var(--font-bodyM-weight);
  line-height: var(--font-bodyM-line-height);
  letter-spacing: var(--font-bodyM-letter-spacing);
  color: var(--n300-color);
`

const NotifyMessage = styled.p`
  margin-top: 0.6rem;
  font-size: var(--font-h5-size);
  font-weight: var(--font-h5-weight);
  line-height: var(--font-h5-line-height);
  letter-spacing: var(--font-h5-letter-spacing);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const StyledLink = styled(Link)`
  position: relative;
  display: block;
  width: 100%;
`
