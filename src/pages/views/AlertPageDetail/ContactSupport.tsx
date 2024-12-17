import { useState, useRef, Suspense, ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { useRecoilState } from "recoil"
import styled from "styled-components"
import { useSuspenseQuery } from "@tanstack/react-query"
import imageCompression from "browser-image-compression"
import FilterDropDown from "@/components/FilterDropDown"
import ReuseHeader from "@/components/ReuseHeader"
import Button from "@/components/Button"
import Modal from "@/components/Modal"
import useToast from "@/hooks/useToast"
import { selectedContactFilterState } from "@/store/dropdown-recoil"
import { contactOptions } from "@/types/component-types/dropdown-type"
import { RoutePath } from "@/types/route-path"
import { ReviewItem } from "@/types/api-types/review-type"
import { FilterOption } from "@/types/component-types/filter-dropdown-type"
import { getReviewList } from "@/services/review"
import { addQna } from "@/services/qna"
import IconNotice from "assets/ico_notice.svg?url"

const ContactSupportInner = () => {
  const navigate = useNavigate()
  const [reviewText, setReviewText] = useState<string>("")
  const [selectedFilter, setSelectedFilter] = useRecoilState(
    selectedContactFilterState
  )
  const [selectedCampaign, setSelectedCampaign] = useState<FilterOption | null>(
    null
  )
  const { addToast } = useToast()
  const [isLoadingModalOpen, setLoadingModalOpen] = useState(false)
  const [isResultModalOpen, setResultModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState<string>("")
  const [modalContent, setModalContent] = useState<string | ReactNode>("")
  const [modalConfirmText, setModalConfirmText] = useState<string>("확인")
  const [modalCancelText, setModalCancelText] = useState<string | undefined>(
    undefined
  )
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [uploadedImages, setUploadedImages] = useState<
    { file: File; previewUrl: string }[]
  >([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const MAX_IMAGES = 2
  const fetchCampaignList = async () => {
    const requestData = {
      pageSize: 20,
      pageIndex: 1,
    }
    const response = await getReviewList(requestData)
    return response.list && response.list.length > 0 ? response.list : []
  }

  const { data: campaignList } = useSuspenseQuery({
    queryKey: ["campaignList", selectedFilter.value],
    queryFn: async () => {
      if (
        selectedFilter.value === "campaign" ||
        selectedFilter.value === "point"
      ) {
        return await fetchCampaignList()
      } else {
        return []
      }
    },
  })

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

  const isButtonEnabled =
    selectedFilter &&
    reviewText.length >= minChars &&
    (selectedFilter.value !== "campaign" || selectedCampaign)

  const handleSubmit = async () => {
    try {
      setLoadingModalOpen(true)
      const requestData: any = {
        qnaCategory: selectedFilter.value,
        question: reviewText,
      }

      if (selectedCampaign) {
        requestData.reviewId = selectedCampaign.value
      }

      let response
      if (uploadedImages.length > 0) {
        const formData = new FormData()
        formData.append("qnaCategory", requestData.qnaCategory)
        formData.append("question", requestData.question)
        if (requestData.reviewId) {
          formData.append("reviewId", requestData.reviewId)
        }
        uploadedImages.forEach((img, idx) => {
          const fieldName = `file_img${idx + 1}`
          formData.append(fieldName, img.file)
        })

        response = await addQna(formData)
      } else {
        response = await addQna(requestData)
      }

      if (response.statusCode === 0) {
        setLoadingModalOpen(false)
        showSuccessModal()
      } else {
        throw new Error()
      }
    } catch (error) {
      setLoadingModalOpen(false)
      addToast("다시 시도해주세요.", 3000, "qna")
    }
  }

  const showSuccessModal = () => {
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
  }

  const handleModalConfirm = () => {
    setResultModalOpen(false)
    if (modalCancelText === "확인") {
      navigate(RoutePath.Alert)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const selectedFiles = Array.from(files)
    const remainingSlots = MAX_IMAGES - uploadedImages.length
    const filesToUpload = selectedFiles.slice(0, remainingSlots)

    const options = {
      maxSizeMB: 0.9,
      maxWidthOrHeight: 1000,
      useWebWorker: true,
    }

    setLoadingModalOpen(true)

    try {
      // 압축 없이 바로 사용 (필요시 주석 제거 후 압축 로직 사용)
      // const compressedFiles = await Promise.all(
      //   filesToUpload.map(async (file) => {
      //     const compressedFile = await imageCompression(file, options)
      //     return compressedFile
      //   })
      // )
      const compressedFiles = filesToUpload.map((file) => file)

      const newUploaded = compressedFiles.map((file) => {
        return {
          file,
          previewUrl: URL.createObjectURL(file),
        }
      })

      setUploadedImages((prev) => [...prev, ...newUploaded])
    } catch (error) {
      console.error("이미지 압축 오류:", error)
      addToast("이미지 압축 중 오류가 발생했습니다.", 3000, "qna")
    } finally {
      setLoadingModalOpen(false)
    }

    e.target.value = ""
  }

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => {
      const updated = [...prev]
      updated.splice(index, 1)
      return updated
    })
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
        placeholder="질문 유형을 선택해주세요"
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
      />
      {campaignList && campaignList.length > 0 && (
        <FilterDropDown
          id="campaign"
          options={campaignList.map((campaign: ReviewItem, idx: number) => ({
            id: idx,
            label: campaign.title,
            value: campaign.reviewId,
          }))}
          selectedFilter={
            selectedCampaign || {
              id: 0,
              label: "문의할 캠페인을 선택해주세요",
              value: 0,
            }
          }
          setSelectedFilter={setSelectedCampaign}
          buttonWidth="100%"
          buttonHeight="4.4rem"
          containerTop="inherit"
          containerHeight="4rem"
          marginBottom="0.9rem"
          placeholder="문의할 캠페인을 선택해주세요"
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
      <Heading>문의내용</Heading>
      <TextAreaContainer>
        <TextAreaSection>
          <textarea
            placeholder="문의하실 내용을 입력하세요. (10글자 이상 입력하세요)"
            value={reviewText}
            onChange={handleContactChange}
          />
        </TextAreaSection>
        <Count>
          <span>{reviewText.length}</span>&nbsp;/&nbsp;
          {Number(1000).toLocaleString()}
        </Count>
        <ImageUploadBox>
          <Button
            $variant="uploadImage"
            onClick={handleUploadClick}
            disabled={uploadedImages.length >= MAX_IMAGES}
          >
            이미지 첨부하기 ({uploadedImages.length}/{MAX_IMAGES})
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
          <ImageSection>
            {uploadedImages.map((img, idx) => (
              <ImageItem key={idx}>
                <div>
                  <img
                    src={img.previewUrl}
                    alt={`업로드이미지 썸네일-${idx}`}
                  />
                </div>
                <DeleteButton onClick={() => handleRemoveImage(idx)} />
              </ImageItem>
            ))}
          </ImageSection>
        </ImageUploadBox>
      </TextAreaContainer>
      <Button
        type="button"
        disabled={!isButtonEnabled}
        $variant="red"
        onClick={handleSubmit}
      >
        등록하기
      </Button>
      <Modal
        isOpen={isResultModalOpen}
        title={modalTitle}
        content={modalContent}
        confirmText={modalConfirmText}
        cancelText={modalCancelText}
        onCancel={handleModalConfirm}
      />
      <Modal
        isOpen={isLoadingModalOpen}
        isLoading={true}
        onConfirm={function (): void {
          throw new Error("Function not implemented.")
        }}
        onCancel={function (): void {
          throw new Error("Function not implemented.")
        }}
        title={"1:1문의 등록중입니다"}
        content={
          <>
            <p>
              조금만 기다려주세요.
              <br /> 처리가 곧 끝나요!
            </p>
          </>
        }
      />
    </>
  )
}

// Suspense로 감싼 상위 컴포넌트
const ContactSupport = () => {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <ContactSupportInner />
    </Suspense>
  )
}

export default ContactSupport

const NoticeBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  p {
    font-size: var(--caption-size);
    letter-spacing: var(--L-spacing-M);
    font-weight: var(--font-medium);
    color: var(--L300);
    display: flex;
    align-items: center;
    gap: 0.2rem;
    &::before {
      content: "";
      width: 1.4rem;
      height: 1.4rem;
      background: url("${IconNotice}") no-repeat center / 100%;
      filter: invert(47%) sepia(85%) saturate(1338%) hue-rotate(324deg)
        brightness(97%) contrast(101%);
    }
  }
  ul {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    list-style-type: disc;
    padding-left: 2rem;

    li {
      font-size: var(--caption-size);
      font-weight: var(--font-medium);
      line-height: 1.25;
      color: var(--Gray02);
    }
    li::marker {
      font-size: 0.9rem;
    }
  }
`

const Heading = styled.h5`
  margin-top: 2.4rem;
  color: var(--N500);
`

const TextAreaContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
  margin: 0.8rem 0 2rem;
  overflow: hidden;
  outline: 0;
  background-color: white;
  border: 0.1rem solid var(--N60);
  border-radius: 1rem;
  padding: 1.5rem;

  textarea {
    display: block;
    width: 100%;
    height: 100%;
    resize: none;
    outline: 0;
    border: none;
    border-radius: 0 0 1rem 1rem;
    &::placeholder {
      font-size: var(--font-body-size);
      color: var(--N200);
    }
  }
`

const TextAreaSection = styled.div`
  height: 10.9rem;
`

const Count = styled.div`
  margin: 1rem 0;
  text-align: right;
  font-size: var(--font-body-size);
  color: var(--N200);

  span {
    font-weight: var(--font-bold);
    color: var(--RevBlack);
  }
`

const ImageUploadBox = styled.div`
  padding: 0.75rem;
  border-radius: 1rem;
  background-color: var(--N40);
`

const ImageSection = styled.ul`
  display: flex;
  gap: 1.4rem;
  list-style: none;
  padding: 0;
`

const ImageItem = styled.li`
  position: relative;
  width: 6rem;
  height: 6rem;
  border-radius: 0.6rem;
  border: 1.5px solid var(--N300);
  box-shadow: 2px 2px 12px 0px rgba(33, 37, 41, 0.16);
  margin-top: 2rem;
  overflow: visible;

  div {
    border-radius: 0.6rem;
    height: -webkit-fill-available;
    overflow: hidden;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const DeleteButton = styled.button`
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  background: rgba(0, 0, 0, 0.65);
  border: none;
  width: 1.4rem;
  height: 1.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0.7rem;
    height: 0.15rem;
    background: white;
    transform-origin: center;
  }

  &::before {
    transform: translate(-50%, -50%) rotate(45deg);
  }

  &::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
`
