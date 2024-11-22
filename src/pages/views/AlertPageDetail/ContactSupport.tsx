import { useState, useEffect } from "react"
import FilterDropDown from "@/components/FilterDropDown"
import { contactOptions } from "@/types/component-types/dropdown-type"
import ReuseHeader from "@/components/ReuseHeader"
import { RoutePath } from "@/types/route-path"
import { useNavigate } from "react-router-dom"
import { useRecoilState } from "recoil"
import { selectedContactFilterState } from "@/store/dropdown-recoil"
import IconNotice from "assets/ico_notice.svg?url"
import Button from "@/components/Button"
import { addQna } from "@/services/qna"
import { getReviewList } from "@/services/review"
import Modal from "@/components/Modal"
import useToast from "@/hooks/useToast"
import styled from "styled-components"
import { ReviewItem } from "@/types/api-types/review-type"
import { FilterOption } from "@/types/component-types/filter-dropdown-type"

const ContactSupport = () => {
  const navigate = useNavigate()
  const [reviewTitle, setReviewTitle] = useState<string>("")
  const [reviewText, setReviewText] = useState<string>("")
  const [selectedFilter, setSelectedFilter] = useRecoilState(
    selectedContactFilterState
  )
  const [campaignList, setCampaignList] = useState<ReviewItem[]>([])
  const [selectedCampaign, setSelectedCampaign] = useState<FilterOption | null>(
    null
  )
  const { addToast } = useToast()
  //** 모달 상태 관리 */
  const [isResultModalOpen, setResultModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState<string>("")
  const [modalContent, setModalContent] = useState<string | React.ReactNode>("")
  const [modalConfirmText, setModalConfirmText] = useState<string>("확인")
  const [modalCancelText, setModalCancelText] = useState<string | undefined>(
    undefined
  )
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  //** selectedFilter가 변경될 때 캠페인 리스트 가져오기 */
  const fetchCampaignList = async () => {
    try {
      const requestData = {
        pageSize: 20,
        pageIndex: 1,
      }
      const response = await getReviewList(requestData)
      return response.list && response.list.length > 0 ? response.list : []
    } catch (error) {
      return []
    }
  }
  useEffect(() => {
    const loadCampaignList = async () => {
      if (selectedFilter.value === "campaign") {
        const list = await fetchCampaignList()
        setCampaignList(list)
      } else {
        setCampaignList([])
        setSelectedCampaign(null)
      }
    }

    loadCampaignList()
  }, [selectedFilter])

  //** 리뷰 타이틀 변경 핸들러 */
  const maxTitleChars = 32
  const minTitleChars = 2
  const handleTitleContactChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const text = e.target.value
    if (text.length <= maxTitleChars) {
      setReviewTitle(text)
    } else {
      setReviewTitle(text.slice(0, maxTitleChars))
    }
  }
  //** 리뷰 텍스트 변경 핸들러 */
  const maxChars = 1000
  const minChars = 10
  const handleContactChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    if (text.length <= maxChars) {
      setReviewText(text)
    } else {
      setReviewText(text.slice(0, maxChars))
    }
  }

  //** 버튼 활성화 조건 */
  const isButtonEnabled =
    selectedFilter &&
    reviewTitle.length >= minTitleChars &&
    reviewText.length >= minChars &&
    (selectedFilter.value !== "campaign" || selectedCampaign)

  //** 문의 등록 핸들러 */
  const handleSubmit = async () => {
    try {
      const requestData: any = {
        qnaCategory: selectedFilter.value,
        title: reviewTitle,
        question: reviewText,
      }

      // 선택된 캠페인이 있을 경우 추가
      if (selectedCampaign) {
        requestData.reviewId = selectedCampaign.value
      }
      const response = await addQna(requestData)
      if (response.statusCode === 0) {
        setModalTitle("👏 문의 등록 완료!")
        setModalContent(
          <>
            문의가 정상적으로 접수됐어요.
            <br />
            답변은 가입한 계정 이메일로 발송되며,
            <br />
            영업일 기준 3-5일 정도 소요됩니다.
          </>
        )
        setModalConfirmText("확인")
        setModalCancelText("확인")
        setResultModalOpen(true)
      } else {
        throw new Error()
      }
    } catch (error) {
      addToast("다시 시도해주세요.", "warning", 1000, "qna")
    }
  }

  //** 모달 확인 버튼 핸들러 */
  const handleModalConfirm = () => {
    setResultModalOpen(false)
    if (modalCancelText === "확인") {
      navigate(RoutePath.Alert)
    }
  }
  return (
    <>
      <ReuseHeader title="문의등록" onBack={() => navigate(RoutePath.Alert)} />
      <FilterDropDown
        id="contact"
        options={contactOptions}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        buttonWidth="100%"
        buttonHeight="4.4rem"
        containerTop="inherit"
        containerHeight="4rem"
        marginBottom="0.9rem"
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
      />
      {/* 캠페인 리스트가 있을 경우 추가적인 FilterDropDown 표시 */}
      {campaignList.length > 0 && (
        <FilterDropDown
          id="campaign"
          options={campaignList.map((campaign, idx) => ({
            id: idx,
            label: campaign.title,
            value: campaign.reviewId,
          }))}
          selectedFilter={
            selectedCampaign || { id: 0, label: "선택해주세요", value: 0 }
          }
          setSelectedFilter={setSelectedCampaign}
          buttonWidth="100%"
          buttonHeight="4.4rem"
          containerTop="inherit"
          containerHeight="4rem"
          marginBottom="0.9rem"
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
        />
      )}
      <NoticeBox>
        <p>문의 전 안내를 꼭 확인해주세요.</p>
        <ul>
          <li>정확한 답변을 위해 상세 내용을 입력해주세요.</li>
          <li>
            문의에 대한 답변은 인증한 계정 이메일 및 알림으로 발송되며, 문의
            등록 후 익일 내로 답변 드릴 예정입니다.
          </li>
        </ul>
      </NoticeBox>
      <TitleAreaContainer>
        <textarea
          placeholder="제목을 입력해주세요."
          value={reviewTitle}
          onChange={handleTitleContactChange}
        />
      </TitleAreaContainer>
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
      <Button
        type="button"
        disabled={!isButtonEnabled}
        $variant="red"
        onClick={handleSubmit}
      >
        등록하기
      </Button>
      {/* 결과 모달 */}
      <Modal
        isOpen={isResultModalOpen}
        title={modalTitle}
        content={modalContent}
        confirmText={modalConfirmText}
        cancelText={modalCancelText}
        onCancel={handleModalConfirm}
        showRouteLink={true}
      />
    </>
  )
}

export default ContactSupport

const NoticeBox = styled.div`
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

const TitleAreaContainer = styled.div`
  height: 4.4rem;
  margin-top: 3.2rem;
  border-radius: 1rem 1rem 0 0;
  overflow: hidden;

  textarea {
    display: block;
    padding: 1.1rem 1.4rem 1.4rem;
    width: 100%;
    height: 100%;
    overflow: hidden;
    outline: 0;
    border: 0.1rem solid var(--n60-color);
    border-radius: 1rem 1rem 0 0;
    &::placeholder {
      font-size: var(--font-bodyM-size);
      letter-spacing: var(--font-bodyM-letter-spacing);
      color: var(--n200-color);
    }
  }
`

const TextAreaContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
  height: 23.9rem;
  margin: 0 0 2rem;
  overflow: hidden;

  textarea {
    display: block;
    padding: 1.4rem;
    width: 100%;
    height: 100%;
    outline: 0;
    border: 0.1rem solid var(--n60-color);
    border-radius: 0 0 1rem 1rem;
    border-top: none;
    &::placeholder {
      font-size: var(--font-bodyM-size);
      color: var(--n200-color);
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
