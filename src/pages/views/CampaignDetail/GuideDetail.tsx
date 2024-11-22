import detailGuideImage from "assets/guide-img.png"
import styled from "styled-components"

const GuideDetail = () => {
  return (
    <div>
      <SectionTitle>미션 프로세스</SectionTitle>
      <img src={detailGuideImage} alt="미션프로세스" />
      <Divider />
      <SectionTitle>상품구매 가이드</SectionTitle>
    </div>
  )
}

export default GuideDetail

const SectionTitle = styled.h3`
  font-size: var(--font-h3-size);
  font-weight: var(--font-h3-weight);
  letter-spacing: var(--font-h3-letter-spacing);
  color: var(--n600-color);
`

const Divider = styled.div`
  width: 100%;
  height: 0.1rem;
  background: var(--n80-color);
`
