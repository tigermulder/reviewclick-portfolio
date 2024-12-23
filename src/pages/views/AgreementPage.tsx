import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import styled from "styled-components"
import Checkbox from "@/components/CheckBox"
import ReuseHeader from "@/components/ReuseHeader"
import { Agreements } from "@/types/component-types/check-box-type"
import SeoHelmet from "@/components/SeoHelmet"
import Button from "@/components/Button"
import { RoutePath } from "@/types/route-path"
import useScrollToTop from "@/hooks/useScrollToTop"

const AgreementPage = () => {
  //** 스크롤 0부터시작 */
  useScrollToTop()
  const navigate = useNavigate()
  const [agreements, setAgreements] = useState<Agreements>({
    all: false,
    essential1: false,
    essential2: false,
    essential3: false,
    optionalAll: false,
  })

  //** 약관 동의 전체 체크박스 변경 함수 */
  const handleAgreementAllChange = (checked: boolean) => {
    setAgreements({
      all: checked,
      essential1: checked,
      essential2: checked,
      essential3: checked,
      optionalAll: checked,
    })
  }

  //** 약관 동의 개별 체크박스 변경 함수 */
  const handleAgreementChange = (name: keyof Agreements, checked: boolean) => {
    setAgreements((prev) => {
      const updatedAgreements = {
        ...prev,
        [name]: checked,
      }
      // 모든 필수 및 선택항목이 체크되었는지 확인
      const allChecked =
        updatedAgreements.essential1 &&
        updatedAgreements.essential2 &&
        updatedAgreements.essential3
      updatedAgreements.all = allChecked

      return updatedAgreements
    })
  }
  //** 필수 체크박스가 모두 체크되었는지 확인 */
  const allEssentialsChecked =
    agreements.essential1 && agreements.essential2 && agreements.essential3

  return (
    <>
      <SeoHelmet
        title="리뷰클릭-User Authentication"
        description="리뷰클릭은 제품과 서비스 전반에 걸친 다양한 사용자 리뷰를 한곳에서 제공합니다. 믿을 수 있는 평가와 상세한 리뷰로 현명한 소비를 지원합니다."
      />
      <AgreementContainer>
        <ReuseHeader
          title="약관동의"
          onBack={() => {
            navigate(-1)
          }}
        />
        <AgreementTitle>
          리뷰클릭 <br />
          <em>약관 동의</em>가 필요해요
        </AgreementTitle>
        <NoticeText>
          본 서비스를 이용하기 위해서는 이메일과 휴대폰 번호 인증이 필수입니다.
        </NoticeText>
        <AgreementSection>
          <Checkbox
            label="서비스 이용약관 전체동의"
            checked={agreements.all}
            onChange={(e) => handleAgreementAllChange(e.target.checked)}
            $isTitle={true}
          />

          <AgreementList>
            <CheckboxItem>
              <CheckboxWrapper>
                <Checkbox
                  label="만 14세 이상입니다. (필수)"
                  checked={agreements.essential1}
                  onChange={(e) =>
                    handleAgreementChange("essential1", e.target.checked)
                  }
                />
              </CheckboxWrapper>
            </CheckboxItem>
            <CheckboxItem>
              <CheckboxWrapper>
                <Checkbox
                  label="서비스 이용 약관에 동의합니다. (필수)"
                  checked={agreements.essential2}
                  onChange={(e) =>
                    handleAgreementChange("essential2", e.target.checked)
                  }
                />
              </CheckboxWrapper>
              <AgreeTerms to={RoutePath.JoinServiceTerms}>
                자세히보기
              </AgreeTerms>
            </CheckboxItem>
            <CheckboxItem>
              <CheckboxWrapper>
                <Checkbox
                  label="개인 정보 수집 및 이용에 동의합니다. (필수)"
                  checked={agreements.essential3}
                  onChange={(e) =>
                    handleAgreementChange("essential3", e.target.checked)
                  }
                />
              </CheckboxWrapper>
              <AgreeTerms to={RoutePath.JoinPersonalTerms}>
                자세히보기
              </AgreeTerms>
            </CheckboxItem>
          </AgreementList>
        </AgreementSection>

        <BottomSubmit $visible={allEssentialsChecked}>
          <Button
            $variant="red"
            onClick={() => navigate(RoutePath.JoinVerify)}
            disabled={!allEssentialsChecked}
          >
            동의하고 시작하기
          </Button>
        </BottomSubmit>
      </AgreementContainer>
    </>
  )
}

export default AgreementPage

const AgreementContainer = styled.div`
  padding: 5.2rem 0 0;
  height: 100vh;
`

const AgreementTitle = styled.h2`
  margin-top: 2.4rem;
  color: var(--N600);
  em {
    color: var(--L400);
  }
`

const AgreementSection = styled.div`
  margin: 2.4rem 0 0;
`

const AgreementList = styled.ul`
  margin-top: 3.6rem;
`

const CheckboxItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.2rem;
`

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
`

const AgreeTerms = styled(Link)`
  font-size: var(--caption-small-size);
  color: var(--N500);
`

const NoticeText = styled.p`
  margin-top: 1.2rem;
  color: var(--RevBlack);
  font-size: var(--caption-size);
`

const BottomSubmit = styled.div<{ $visible: boolean }>`
  position: fixed;
  padding: 1.6rem 1.5rem 4.1rem;
  width: 100%;
  bottom: 0;
  left: 0;
  background-color: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.08);
  transform: ${({ $visible }) =>
    $visible ? "translateY(0)" : "translateY(100%)"};
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition:
    transform 0.2s ease-in-out,
    opacity 0.1s ease-in-out;
  z-index: 100;
`
