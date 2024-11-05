import FilterDropDown from "@/components/FilterDropDown"
import { contactOptions } from "@/types/component-types/dropdown-type"
import ReuseHeader from "@/components/ReuseHeader"
import { RoutePath } from "@/types/route-path"
import { useNavigate } from "react-router-dom"
import { useRecoilState } from "recoil"
import { selectedContactFilterState } from "@/store/dropdown-recoil"
import IconNotice from "assets/ico_notice.svg?url"
import Button from "@/components/Button"
import styled from "styled-components"
import { useState } from "react"

const ContactSupport = () => {
  const navigate = useNavigate()
  const [reviewText, setReviewText] = useState<string>("")
  const [selectedFilter, setSelectedFilter] = useRecoilState(
    selectedContactFilterState
  )

  const maxChars = 1000
  const minChars = 10
  //** 리뷰 텍스트 변경 핸들러 */
  const handleContactChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    if (text.length <= maxChars) {
      setReviewText(text)
    } else {
      setReviewText(text.slice(0, maxChars))
    }
  }
  return (
    <>
      <ReuseHeader title="문의등록" onBack={() => navigate(RoutePath.Alert)} />
      <FilterDropDown
        options={contactOptions}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        buttonWidth="100%"
        buttonHeight="4.4rem"
        containerTop="inherit"
        containerHeight="4rem"
      />
      <NoticeBox>
        <p>문의 전 안내를 꼭 확인해주세요.</p>
        <ul>
          <li>정확한 답변을 위해 상세 내용을 입력해주세요.</li>
          <li>
            문의답변은 가입한 계정 이메일로 발송되며, 영업일 기준 3-5일 정도
            소요됩니다.
          </li>
        </ul>
      </NoticeBox>
      <TextAreaContainer>
        <textarea
          placeholder="문의하실 내용을 입력하세요."
          value={reviewText}
          onChange={handleContactChange}
        />
        <Count>
          <span>{reviewText.length}</span>&nbsp;/1000
        </Count>
      </TextAreaContainer>
      <Button $variant="red">등록하기</Button>
    </>
  )
}

export default ContactSupport

const NoticeBox = styled.div`
  margin-top: 0.9rem;
  p {
    padding-left: 1rem;
    margin-bottom: 0.4rem;
    font-size: 1.2rem;
    letter-spacing: -1px;
    font-weight: var(--font-weight-medium);
    color: var(--prim-L300);
    display: flex;
    align-items: center;
    gap: 0.2rem;
    &::before {
      content: "";
      width: 1.4rem;
      height: 1.4rem;
      background: url("${IconNotice}") no-repeat center / 100%;
    }
  }
  ul li {
    position: relative;
    padding-left: 3rem;
    font-size: 1.2rem;
    line-height: 1.4;
    font-weight: var(--font-weight-medium);
    letter-spacing: -0.25px;
    display: flex;
    align-items: flex-start;
    color: var(--n400-color);

    &::before {
      content: "";
      position: absolute;
      left: 2rem;
      margin-top: 0.7rem;
      width: 0.3rem;
      height: 0.3rem;
      border-radius: 50%;
      background: var(--gray-01);
      flex-shrink: 0;
    }
  }
`

const TextAreaContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
  height: 23.9rem;
  margin: 3.2rem 0 2rem;
  overflow: hidden;

  textarea {
    display: block;
    padding: 1rem 1.4rem;
    width: 100%;
    height: 100%;
    outline: 0;
    border: 0.1rem solid var(--n60-color);
    border-radius: 1rem 1rem;
    &::placeholder {
      font-size: var(--font-bodyM-size);
    }
  }
`

const Count = styled.div`
  position: absolute;
  right: 1.5rem;
  bottom: 1.4rem;
  font-size: 1.4rem;
  color: var(--n200-color);

  span {
    font-weight: var(--font-weight-bold);
    color: var(--primary-color);
  }
`
