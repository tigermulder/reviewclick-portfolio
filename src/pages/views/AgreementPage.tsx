import { useState } from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import Checkbox from "@/components/CheckBox"
import ReuseHeader from "@/components/ReuseHeader"
import { Agreements } from "@/types/component-types/check-box-type"
import Button from "@/components/Button"
import { RoutePath } from "@/types/route-path"

const AgreementPage = () => {
  const navigate = useNavigate()
  const [agreements, setAgreements] = useState<Agreements>({
    all: false,
    essential1: false,
    essential2: false,
    essential3: false,
    optionalAll: false,
    optional1: false,
  })

  // 약관 동의 전체 체크박스 변경 함수
  const handleAgreementAllChange = (checked: boolean) => {
    setAgreements({
      all: checked,
      essential1: checked,
      essential2: checked,
      essential3: checked,
      optionalAll: checked,
      optional1: checked,
    })
  }

  // 선택 약관 전체 체크박스 변경 함수
  const handleOptionalAllChange = (checked: boolean) => {
    setAgreements((prev) => {
      const updatedAgreements = {
        ...prev,
        optionalAll: checked,
        optional1: checked,
      }

      // 모든 체크박스가 체크되었는지 확인 (전체 체크박스 업데이트)
      const allChecked = Object.keys(updatedAgreements).every((key) => {
        if (key === "all") return true // 'all'은 제외
        return updatedAgreements[key as keyof Agreements]
      })

      updatedAgreements.all = allChecked

      return updatedAgreements
    })
  }

  // 약관 동의 개별 체크박스 변경 함수
  const handleAgreementChange = (name: keyof Agreements, checked: boolean) => {
    setAgreements((prev) => {
      const updatedAgreements = {
        ...prev,
        [name]: checked,
      }

      // 모든 체크박스가 체크되었는지 확인 (전체 체크박스 업데이트)
      const allChecked = Object.keys(updatedAgreements).every((key) => {
        if (key === "all") return true // 'all'은 제외
        return updatedAgreements[key as keyof Agreements]
      })

      updatedAgreements.all = allChecked

      return updatedAgreements
    })
  }
  // 필수 체크박스가 모두 체크되었는지 확인
  const allEssentialsChecked =
    agreements.essential1 && agreements.essential2 && agreements.essential3

  return (
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
      <AgreementSection>
        <Checkbox
          label="서비스 이용약관 전체동의"
          checked={agreements.all}
          onChange={(e) => handleAgreementAllChange(e.target.checked)}
          $isTitle={true}
        />

        <NoticeText>
          <p>유의사항</p>
          <span>
            이메일/SMS수신에 동의하지 않으실 경우 캠페인 알림, 계정 찾기 등 관련
            알림을 받아볼 수 없습니다.
          </span>
        </NoticeText>
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
          </CheckboxItem>
          <CheckboxItem>
            <CheckboxWrapper>
              <Checkbox
                label="이벤트 및 혜택 (이메일/SMS/알림톡) 수신 동의(선택)"
                checked={agreements.optionalAll}
                onChange={(e) => handleOptionalAllChange(e.target.checked)}
              />
            </CheckboxWrapper>
          </CheckboxItem>
        </AgreementList>
      </AgreementSection>

      <BottomSubmit visible={allEssentialsChecked}>
        <Button
          $variant="red"
          onClick={() => navigate(RoutePath.JoinVerify)}
          disabled={!allEssentialsChecked}
        >
          동의하고 시작하기
        </Button>
      </BottomSubmit>
    </AgreementContainer>
  )
}

export default AgreementPage

const AgreementContainer = styled.div`
  padding: 6rem 0 10rem;
`

const AgreementTitle = styled.h2`
  margin-top: 2.8rem;
  font-size: var(--font-h2-size);
  font-weight: var(--font-h2-weight);
  letter-spacing: var(--font-h2-letter-spacing);
  color: var(--n600-color);
  em {
    color: var(--revu-color);
  }
`

const AgreementSection = styled.div`
  margin: 2.8rem 0 0;
`

const AgreementList = styled.ul`
  margin-top: 5rem;
`

const CheckboxItem = styled.li`
  margin-top: 1.2rem;
`

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
`

const NoticeText = styled.p`
  margin-top: 2.4rem;
  p {
    margin-bottom: 0.4rem;
    font-size: var(--font-title-size);
    font-weight: var(--font-title-weight);
    letter-spacing: var(--font-title-letter-spacing);
  }
  span {
    color: var(--n200-color);
    font-size: var(--font-caption-size);
    font-weight: var(--font-caption-weight);
    letter-spacing: var(--font-caption-letter-spacing);
  }
`

const BottomSubmit = styled.div<{ visible: boolean }>`
  position: fixed;
  padding: 1.5rem;
  width: 100%;
  bottom: 0;
  left: 0;
  background-color: #fff;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.08);
  transform: ${({ visible }) =>
    visible ? "translateY(0)" : "translateY(100%)"};
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transition:
    transform 0.3s ease-out,
    opacity 0.3s ease-out;
  z-index: 1000; /* 다른 요소보다 위에 표시되도록 설정 */
`
