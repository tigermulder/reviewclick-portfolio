import { useEffect, useRef, useState } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { getNotificationList } from "@/services/notification"
import IconNotify from "assets/ico-notify.svg?react"
import { formatDate } from "@/utils/util"
import { Link, useNavigate } from "react-router-dom"
import { RoutePath } from "@/types/route-path"
import styled from "styled-components"

const NewsContent = () => {
  // ** 로드 모어 요소 선언 */
  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  // ** 클릭된 알림 ID를 저장하는 상태 */
  const [clickedNotifications, setClickedNotifications] = useState<number[]>(
    () => {
      // 컴포넌트 마운트 시 LocalStorage에서 데이터 불러오기
      const savedData = sessionStorage.getItem("clickedNotifications")
      return savedData ? JSON.parse(savedData) : []
    }
  )
  const navigate = useNavigate()
  // ** 클릭된 알림 ID를 LocalStorage에 저장 */
  useEffect(() => {
    sessionStorage.setItem(
      "clickedNotifications",
      JSON.stringify(clickedNotifications)
    )
  }, [clickedNotifications])

  // ** 알림 클릭 핸들러 */
  const handleNotificationClick = (
    notificationId: number,
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault()
    // 이미 클릭된 알림이 아니라면 상태 업데이트
    if (!clickedNotifications.includes(notificationId)) {
      setClickedNotifications((prev) => [...prev, notificationId])
    }
    // 상태 업데이트 후 페이지 이동 (짧은 지연)
    setTimeout(() => {
      navigate(RoutePath.NotificationDetail(`${notificationId}`))
    }, 0)
  }

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
      {notificationList.map((notificationItem) => {
        const isClicked = clickedNotifications.includes(
          notificationItem.notificationId
        )

        return (
          <li key={notificationItem.notificationId}>
            <StyledLink
              to={RoutePath.NotificationDetail(
                `${notificationItem.notificationId}`
              )}
              onClick={(e) =>
                handleNotificationClick(notificationItem.notificationId, e)
              }
            >
              <NotifyDate isClicked={isClicked}>
                <IconNotify />
                {formatDate(notificationItem.createdAt)}
              </NotifyDate>
              <NotifyMessage isClicked={isClicked}>
                {notificationItem.title}
              </NotifyMessage>
            </StyledLink>
          </li>
        )
      })}
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
    border-bottom: 0.1rem solid var(--WSmoke);
  }
`

const NotifyDate = styled.p<{ isClicked: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: var(--caption-size);
  color: ${({ isClicked }) => (isClicked ? "var(--N200)" : "var(--N300)")};
  font-weight: var(--font-light);

  svg {
    width: 1rem;
    color: ${({ isClicked }) => (isClicked ? "var(--N200)" : "var(--L400)")};
  }
`

const NotifyMessage = styled.p<{ isClicked: boolean }>`
  margin-top: 0.4rem;
  font-size: var(--font-h5-size);
  font-weight: var(--font-medium);
  color: ${({ isClicked }) => (isClicked ? "var(--N200)" : "var(--RevBlack)")};
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
  font-size: var(--font-body-size);
  color: var(--N300);
`
