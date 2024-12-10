import detailGuideImage from "assets/guide-img.png"
import styled from "styled-components"

const GuideDetail = () => {
  return (
    <div>
      <SectionTitle>미션 프로세스</SectionTitle>
      <GuideImg src={detailGuideImage} alt="미션프로세스" />
      <Divider />
      <SectionTitle>상품구매 가이드</SectionTitle>
      <GuideList>
        <li>
          <p>1. 캠페인 신청하기</p>
          <p>
            ⏳ 캠페인 신청 후 <Red>"1시간 이내"</Red>
            <strong>구매 및 영수증 인증을 완료</strong>해주세요.
          </p>
        </li>
        <li>
          <p>2. 캠페인 상품 구매</p>
          <p>
            &horbar; &#91;나의 캠페인&#93; &gt; '상품 구매' 클릭 &gt; '구매하러
            가기' 클릭
            <br />
            <strong>
              &sext; 반드시 리뷰클릭에서 제공하는 상품 URL로 접속 후 선구매를
              진행해주세요.
            </strong>
          </p>
        </li>
        <li>
          <p>3. 캠페인 상품 결제 내역 확인</p>
          <p>
            &horbar; &#91;네이버 앱/웹&#93; 접속 &gt; 'pay' 아이콘 클릭 &gt;
            하단 '결제' 아이콘 클릭 &gt; 결제한 상품의 '주문상세' 혹은
            '결제상세' 클릭
          </p>
        </li>
        <li>
          <p>4. 구매영수증 캡쳐</p>
          <p>
            &horbar; '영수증' 클릭 &gt; '구매영수증' 클릭 &gt; 구매영수증 캡쳐
          </p>
        </li>
        <li>
          <p>5. 구매영수증 업로드</p>
          <p>
            &horbar; &#91;나의 캠페인&#93; &gt; '상품구매' 클릭 &gt; '이미지
            업로드' 클릭
          </p>
        </li>
      </GuideList>
      <Divider />
      <SectionTitle>리뷰작성 및 등록 가이드</SectionTitle>
      <GuideList>
        <li>
          <p>1. 리뷰 작성</p>
          <p>
            &horbar; &#91;나의 캠페인&#93; &gt; '리뷰검수' 클릭
            <br />
            <strong>
              &sext; 긍정적인 경험을 바탕으로 작성해주세요.(100~180자 이내)
            </strong>
            <br />
            &sext; 리뷰 본문 첫 줄에 경제적 이해 관계(대가성 유무)를 명시하는
            <Purple>&lt;협찬&gt;</Purple> <strong>문구 기재 필수</strong>
          </p>
        </li>
        <li>
          <p>2. 리뷰 AI 검수 진행</p>
        </li>
        <li>
          <p>3. 캠페인 상품 페이지에 리뷰 등록 후 캡쳐</p>
          <p>
            &horbar; &#91;나의 캠페인&#93; &gt; '리뷰등록' 클릭 &gt; '리뷰
            등록하러가기' 클릭 &gt; 상품페이지 내 리뷰영역에 검수완료된 내용
            붙여넣기
            <br />
            <strong>
              &sext; <Red>ID, 날짜, 상품명, 리뷰 전체 내용</Red>이 보이도록
              이미지 캡쳐
            </strong>
          </p>
        </li>
        <li>
          <p>4. 실제 리뷰 이미지 업로드</p>
          <p>
            &horbar; &#91;나의 캠페인&#93; &gt; '리뷰등록' 클릭 &gt; '이미지
            업로드' 클릭
            <br />
            <strong>
              &sext; 적립된 포인트는 '마이페이지' &gt; '포인트 적립내역'에서
              확인할 수 있습니다.
            </strong>
          </p>
        </li>
      </GuideList>
    </div>
  )
}

export default GuideDetail

const SectionTitle = styled.h3`
  margin-top: 4.3rem;
  font-size: var(--font-h3-size);
  font-weight: var(--font-h3-weight);
  letter-spacing: var(--font-h3-letter-spacing);
  color: var(--n600-color);
`

const GuideImg = styled.img`
  width: 30.5rem;
  margin: 2rem auto 4.4rem;
`

const Divider = styled.div`
  width: 100%;
  height: 0.1rem;
  background: var(--n80-color);
`

const GuideList = styled.ul`
  margin: 3.2rem 0 5.3rem;

  li strong {
    font-weight: var(--font-weight-bold);
  }

  li + li {
    margin-top: 2rem;
  }
  li p:nth-child(1) {
    font-size: var(--font-title-size);
    font-weight: var(--font-title-weight);
    letter-spacing: var(--font-title-letter-spacing);
    color: var(--n600-color);
  }
  li p:nth-child(2) {
    margin-top: 0.4rem;
    font-size: var(--font-bodyL-size);
    font-weight: var(--font-bodyL-weight);
    letter-spacing: var(--font-bodyL-letter-spacing);
  }
`

const Red = styled.em`
  color: var(--prim-L300);
  font-weight: var(--font-weight-bold);
`

const Purple = styled.em`
  color: var(--purple);
  font-weight: var(--font-weight-bold);
`
