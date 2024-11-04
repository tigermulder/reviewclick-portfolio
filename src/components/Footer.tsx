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
        문의 : <EmailSpan>revuclick@jamonglab.com</EmailSpan>
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

// 스타일 정의

const FooterComponent = styled.div`
  width: 100%;
  height: 340px;
  position: relative;
  background: #fafafa;
`

const LinkContainer = styled.div`
  position: absolute;
  left: 16px;
  top: 92px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 20.8px;
`

const LinkText = styled(Link)`
  color: #788991;
  font-size: 11.44px;
  font-family: "SUIT";
  font-weight: 500;
  line-height: 16.02px;
  word-wrap: break-word;
`

const CompanyInfo = styled.div`
  position: absolute;
  left: 16px;
  top: 126.24px;
  color: #a0acb1;
  font-size: 11px;
  font-family: "SUIT";
  font-weight: 500;
  line-height: 16px;
  word-wrap: break-word;
`

const EmailSpan = styled.span`
  color: #a0acb1;
`

const FooterLogoContainer = styled.div`
  position: absolute;
  width: 93.6px;
  height: 20.8px;
  left: 16px;
  top: 37px;
  color: var(--n200-color);

  svg {
    width: 100%;
    height: auto;
    fill: currentColor;
  }
`
