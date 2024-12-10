import styled from "styled-components"
import IconNoticeArrow from "assets/ico-notice-arrow.svg?react"

function Notice() {
  return (
    <Details open>
      <Summary>
        <NoticeTitle>※ 유의사항 안내</NoticeTitle>
        <IconPlaceholder>
          <StyledIconNoticeArrow />
        </IconPlaceholder>
      </Summary>
      <NoticeBox>
        <li>
          캠페인 상세 페이지 내 URL을 통하여 구매한 건에 대해서만 인정됩니다.
        </li>
        <li>
          기간 내 영수증 인증 &gt; 리뷰 등록 및 인증이 완료된 후 포인트가
          적립됩니다.
        </li>
        <li>
          영수증 인증 완료 후 7일 이내 남은 미션을 완료해주시기 바랍니다.
          (캠페인 미션 기간 준수)
        </li>
        <li>
          정당한 사유 없이 캠페인 미션 기간 내 리뷰를 등록하지 않거나, 부정
          행위가 적발 될 경우 미션 실패로 간주되며, 포인트는 지급되지 않습니다.
        </li>
        <li>
          배송 관련 문의는 제품 상세 페이지 내 표시된 담당자 연락처로 연락하여
          조율하시기 바랍니다.
        </li>
        <li>
          배송 지연, 상품 파손 등과 같은 사유로 인하여 진행이 어려운 경우
          고객센터로 문의바랍니다.
        </li>
        <li>
          제공받은 제품 재판매 적발 시 회수는 물론, 법적 조치로 인한 불이익을
          받을 수 있습니다.
        </li>
        <li>작성된 콘텐츠는 최소 6개월 유지해주셔야 합니다.</li>
        <li>공정거래위원회 지침에 따른 대가성 문구를 포함해주시기 바랍니다.</li>
      </NoticeBox>
    </Details>
  )
}

export default Notice

const Details = styled.details`
  margin: 2rem 0;
  cursor: pointer;
`

const Summary = styled.summary`
  display: flex;
  align-items: center;
  justify-content: space-between;
  &::-webkit-details-marker {
    display: none;
  }
`

const NoticeTitle = styled.p`
  font-weight: bold;
  font-size: 1.4rem;
`

const IconPlaceholder = styled.div`
  width: 24px;
  height: 24px;
  transition: transform 0.1s ease;
  transform: rotate(180deg);

  details[open] & {
    transform: rotate(0deg);
  }
`

const StyledIconNoticeArrow = styled(IconNoticeArrow)`
  width: 100%;
  height: 100%;
`

const NoticeBox = styled.ul`
  padding: 1.6rem 1.5rem 1.6rem 2.5rem;
  margin-top: 2.4rem;
  border-radius: 1rem;
  background: var(--whitewood);
  color: var(--gray-01);
  font-size: var(--font-caption-size);

  li {
    position: relative;
  }
  li:not(:last-child) {
    margin-bottom: 0.2rem;
  }
  li:before {
    content: "";
    display: block;
    position: absolute;
    top: 24%;
    right: 100%;
    transform: translateY(-50%);
    margin-right: 0.7rem;
    width: 0.3rem;
    height: 0.3rem;
    border-radius: 50%;
    background: var(--gray-01);
  }
`
