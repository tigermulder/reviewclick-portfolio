import { useState } from "react"
import { Link } from "react-router-dom"
import IconArrowRight from "assets/ico_arr_right.svg?url"
import IconNoticeArrow from "assets/ico-notice-arrow.svg?url"
import IconNew from "assets/ico-new.svg"
import { RoutePath } from "@/types/route-path"
import SinglePageHeader from "@/components/SinglePageHeader"
import { extractUsername } from "@/utils/util"
import styled from "styled-components"

const MyPage = () => {
  const [isNoticeOpen, setIsNoticeOpen] = useState<boolean>(false)
  const userEmail = localStorage.getItem("email")
  const toggleNotice = () => {
    setIsNoticeOpen((prev) => !prev)
  }

  return (
    <>
      {/* 마이페이지 헤더 타이틀 */}
      <SinglePageHeader title="마이페이지" showRouteToggle={false} />

      {/* 타이틀 */}
      <TitleSection>
        <h2>
          안녕하세요,
          <br />
          <span>{extractUsername(userEmail)}</span> 회원님!
        </h2>
        <span>ID : {extractUsername(userEmail)}</span>
      </TitleSection>
      {/* /// 타이틀 */}

      {/* 하단 링크 */}
      <Links>
        <li>
          <StyledLink to={RoutePath.UserPointLog}>포인트 적립 내역</StyledLink>
        </li>
        <li className="service">
          <StyledLink to={RoutePath.UserServiceGuide}>
            서비스 이용가이드
          </StyledLink>
        </li>
        {/* <li>
          <StyledLink to={RoutePath.UserEditProfile}>내 정보 수정</StyledLink>
        </li> */}
        <li>
          <NoticeContainer>
            <NoticeHeader onClick={toggleNotice}>
              <p>유의사항</p>
              <img
                src={IconNoticeArrow}
                alt="Toggle Notice"
                className={isNoticeOpen ? "" : "active"}
              />
            </NoticeHeader>
            {!isNoticeOpen && (
              <NoticeContent>
                <ul>
                  <li>
                    리뷰클릭은 네이버 ID로만 계정 인증이 가능하며, 인증된 네이버
                    계정과 캠페인 참여 계정이 동일해야합니다.
                  </li>
                  <li>
                    캠페인 기간 내 구매 및 구매 인증, 리뷰 등록 및 인증이
                    완료되지 않을 경우, 해당 미션은 실패로 간주되어 포인트는
                    지급되지 않습니다.
                  </li>
                  <li>
                    캠페인 참여 기회는 1일 1회 제공되며, 계정당 최대 3회까지
                    참여할 수 있습니다.
                  </li>
                  <li>
                    부정적인 글로 작성되는 경우 미션 진행 및 포인트 지급에
                    영향을 줄 수 있으니, 긍정적인 경험을 바탕으로 작성하여
                    주시기 바랍니다.
                  </li>
                  <li>
                    부정 행위나 부적절한 행위가 발각될 경우 포인트는 지급되지
                    않습니다.
                  </li>
                  <li>
                    등록한 콘텐츠는 6개월간 유지되어야하며, 임의로 수정하거나,
                    삭제된 것이 발견될 경우 캠페인 참여가 불가능할 수 있습니다.
                  </li>
                  <li>
                    캠페인 미션 완료 후 상품 환불, 재판매 등과 같은 행위가
                    발각될 경우 캠페인 참여 제한이 있으며, 포인트는 회수될 수
                    있습니다.
                  </li>
                </ul>
              </NoticeContent>
            )}
          </NoticeContainer>
        </li>
      </Links>
      {/* 하단 링크 */}
    </>
  )
}

export default MyPage

const TitleSection = styled.div`
  padding: 4.4rem 0 7.7rem;
  text-align: center;

  h2 {
    font-size: 2.4rem;
    font-weight: var(--font-weight-bold);
    line-height: 1.4;
    letter-spacing: -1px;
  }

  > span {
    display: block;
    margin-top: 0.6rem;
    font-size: 1.4rem;
    font-weight: var(--font-weight-bold);
    color: var(--prim-L300);
    letter-spacing: unset;
  }
`

const Links = styled.ul`
  padding-bottom: 0;

  > li {
    position: relative;

    & + li {
      border-top: 0.1rem solid var(--whitesmoke);
    }

    a::after {
      content: "";
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      width: 2.4rem;
      height: 2.4rem;
      background: url("${IconArrowRight}") no-repeat center / 100%;
      pointer-events: none;
    }

    &.service a {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    &.service a::before {
      content: "";
      width: 1.3rem;
      height: 1.3rem;
      background: url("${IconNew}") no-repeat center / 100%;
    }
  }
`

const StyledLink = styled(Link)`
  position: relative;
  display: block;
  padding: 2.2rem 0;
  width: 100%;
  font-size: var(--font-bodyM-size);
  font-weight: var(--font-bodyM-weight);
  line-height: var(--font-bodyM-line-height);
  letter-spacing: var(--font-bodyM-letter-spacing);
  text-decoration: none;
  color: inherit;

  &:hover {
    background-color: #f5f5f5;
  }
`

const NoticeContainer = styled.div`
  position: relative;
`

const NoticeHeader = styled.div`
  position: relative;
  padding: 2.2rem 0;
  font-size: var(--font-bodyM-size);
  font-weight: var(--font-bodyM-weight);
  line-height: var(--font-bodyM-line-height);
  letter-spacing: var(--font-bodyM-letter-spacing);
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

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

const NoticeContent = styled.div`
  transition: max-height 0.2s ease-out;
  overflow: hidden;

  ul {
    margin-bottom: 1.5rem;
    padding: 1.5rem;
    font-size: 1.4rem;
    color: var(--gray-01);
    background: var(--whitewood);
    border-radius: 0.6rem;
  }

  li {
    position: relative;
    padding-left: 0.8rem;
    font-size: var(--font-caption-size);
    font-weight: var(--font-caption-weight);
    letter-spacing: var(--font-caption-small-letter-spacing);
    display: flex;
    align-items: flex-start;
    line-height: 1.25;
    color: var(--gray-01);

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 6px;
      width: 0.25rem;
      height: 0.25rem;
      border-radius: 50%;
      background: var(--gray-01);
    }

    & + li {
      margin-top: 0.8rem;
    }
  }
`
