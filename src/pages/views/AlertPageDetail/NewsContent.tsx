import { useEffect, useRef } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { getNotificationList } from "@/services/notification"
import IconNotify from "assets/ico-notify.svg?react"
import { formatDate } from "@/utils/util"
import { Link } from "react-router-dom"
import { RoutePath } from "@/types/route-path"
import styled from "styled-components"

const NewsContent = () => {
  // ** 로드 모어 요소에 대한 레퍼런스 선언 */
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  //** Fetch campaign list */
  const fetchNotificationList = async ({ pageParam = 1 }) => {
    const requestData = {
      pageSize: 10,
      pageIndex: pageParam,
    }
    const response = await getNotificationList(requestData)
    return response
  }

  // ** React Query - 무한 알림 리스트 */
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["notificationList"],
      queryFn: fetchNotificationList,
      getNextPageParam: (lastPage) => {
        if (lastPage.pageIndex < lastPage.totalPages) {
          return lastPage.pageIndex + 1
        }
        return undefined
      },
      initialPageParam: 1,
      refetchOnMount: true,
      staleTime: 0,
    })

  // ** 무한 스크롤을 위한 Intersection Observer */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // 관찰 대상이 보이고 있고 다음 페이지가 있을 경우
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 1.0 }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current)
      }
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  // ** 페이지 데이터 평탄화 */
  const notificationList = data?.pages.flatMap((page) => page.list) || []

  return (
    <NoticeContainer>
      {notificationList.map((notificationItem) => (
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
      ))}
      {/* 로드 모어 트리거 요소 */}
      <div ref={loadMoreRef} />
      {isFetchingNextPage && <Loading>로딩 중...</Loading>}
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

const Loading = styled.div`
  padding: 1rem;
  text-align: center;
  font-size: var(--font-bodyM-size);
  color: var(--n300-color);
`
