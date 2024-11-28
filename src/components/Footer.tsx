import { Link } from "react-router-dom"
import { RoutePath } from "@/types/route-path"
import FooterLogo from "assets/revu_logo.svg?react"
import styled from "styled-components"

const Footer = () => {
  return (
    <FooterComponent>
      <LinkContainer>
        <LinkText to={RoutePath.TermsOfService}>이용약관</LinkText>
        <LinkText to={RoutePath.PrivacyPolicy}>개인정보처리방침</LinkText>
      </LinkContainer>

      <CompanyInfo>
        법인명 : 주식회사 자몽랩 ㅣ 대표자 : 조준형
        <br />
        소재지 : 서울특별시 서초구 서초대로60길 18, 7층 (정인빌딩)
        <br />
        문의 :{" "}
        <EmailSpan href="mailto:revuclick@jamonglab.com">
          revuclick@jamonglab.com
        </EmailSpan>
        <br />
        고객센터 : <a href="tel:0234729229">02-3472-9229</a>
        <br />
        * 업무시간 : 평일 10:00 ~ 17:00 (점심: 12:00 ~ 13:00 / 주말, 공휴일
        휴무)
        <br />
        Copyright © Revuclick Corporation. All Rights Reserved.
      </CompanyInfo>

      {/* FooterLogo 컴포넌트를 사용해 color 적용 */}
      <FooterLogoContainer>
        <FooterLogo aria-label="Revuclick Logo" />
      </FooterLogoContainer>
    </FooterComponent>
  )
}

export default Footer

const FooterComponent = styled.div`
  width: 100%;
  height: 34rem;
  position: relative;
  background: #fafafa;
`

const LinkContainer = styled.div`
  position: absolute;
  left: 1.6rem;
  top: 9.2rem;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
`

const LinkText = styled(Link)`
  color: var(--n300-color);
  font-size: 1.2rem;
  line-height: 1.6;
  word-wrap: break-word;
`

const CompanyInfo = styled.div`
  position: absolute;
  left: 1.6rem;
  top: 12.6rem;
  color: var(--n200-color);
  font-size: 1.1rem;
  line-height: 1.6;
  word-wrap: break-word;
`

const EmailSpan = styled.a`
  color: #a0acb1;
`

const FooterLogoContainer = styled.div`
  position: absolute;
  width: 9.3rem;
  height: 2rem;
  left: 1.6rem;
  top: 3.6rem;
  color: var(--n200-color);

  svg {
    width: 100%;
    height: auto;
    fill: currentColor;
  }
`
