import { Link } from "react-router-dom"
import { RoutePath } from "@/types/route-path"
import FooterLogo from "assets/revu_logo.svg?react"
import styled from "styled-components"

const Footer = () => {
  return (
    <FooterComponent>
      <FooterLogoContainer aria-label="Revuclick Logo">
        <FooterLogo aria-hidden="true" />
      </FooterLogoContainer>

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
        <a href="mailto:revuclick@jamonglab.com">revuclick@jamonglab.com</a>
        <br />
        고객센터 : <a href="tel:0234729229">02-3472-9229</a>
        <br />
        * 업무시간 : 평일 10:00 ~ 17:00 (점심: 12:00 ~ 13:00 / 주말, 공휴일
        휴무)
        <br />
        Copyright © Revuclick Corporation. All Rights Reserved.
      </CompanyInfo>
    </FooterComponent>
  )
}

export default Footer

const FooterComponent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: var(--SWhite);
  padding: 3.6rem 1.5rem 14rem;
`

const LinkContainer = styled.div`
  margin-top: 3rem;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
`

const LinkText = styled(Link)`
  color: var(--N300);
  font-size: var(--caption-size);
  font-weight: var(--font-medium);
  letter-spacing: var(--L-spacing-L);
`

const CompanyInfo = styled.div`
  color: var(--N200);
  font-size: 1.1rem;
  line-height: 1.6;
  margin-top: 0.8rem;
  word-wrap: break-word;
  letter-spacing: var(--L-spacing-L);
  a {
    font-weight: var(--font-light) !important;
  }
`

const FooterLogoContainer = styled.div`
  width: 9.4rem;
  color: var(--N200);

  svg {
    width: 100%;
    height: auto;
  }
`
