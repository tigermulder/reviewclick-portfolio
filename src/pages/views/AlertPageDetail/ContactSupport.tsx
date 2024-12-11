import { useState, useEffect, useRef } from "react"
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
import imageCompression from "browser-image-compression"

const MAX_IMAGES = 2

const ContactSupport = () => {
  const navigate = useNavigate()
  const [reviewText, setReviewText] = useState<string>("")
  const [selectedFilter, setSelectedFilter] = useRecoilState(
    selectedContactFilterState
  )
  const [campaignList, setCampaignList] = useState<ReviewItem[]>([])
  const [selectedCampaign, setSelectedCampaign] = useState<FilterOption | null>(
    null
  )
  const { addToast } = useToast()

  const [isResultModalOpen, setResultModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState<string>("")
  const [modalContent, setModalContent] = useState<string | React.ReactNode>("")
  const [modalConfirmText, setModalConfirmText] = useState<string>("확인")
  const [modalCancelText, setModalCancelText] = useState<string | undefined>(
    undefined
  )
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const [uploadedImages, setUploadedImages] = useState<
    { file: File; previewUrl: string }[]
  >([])

  const fileInputRef = useRef<HTMLInputElement | null>(null)

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
      if (
        selectedFilter.value === "campaign" ||
        selectedFilter.value === "point"
      ) {
        const list = await fetchCampaignList()
        setCampaignList(list)
      } else {
        setCampaignList([])
        setSelectedCampaign(null)
      }
    }
    loadCampaignList()
  }, [selectedFilter])

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
      const requestData: any = {
        qnaCategory: selectedFilter.value,
        question: reviewText,
      }

      if (selectedCampaign) {
        requestData.reviewId = selectedCampaign.value
      }

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

        const response = await addQna(formData)
        if (response.statusCode === 0) {
          showSuccessModal()
        } else {
          throw new Error()
        }
      } else {
        const response = await addQna(requestData)
        if (response.statusCode === 0) {
          showSuccessModal()
        } else {
          throw new Error()
        }
      }
    } catch (error) {
      addToast("다시 시도해주세요.", "warning", 3000, "qna")
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
      maxSizeMB: 0.05,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    }

    try {
      const compressedFiles = await Promise.all(
        filesToUpload.map(async (file) => {
          // 압축 전 파일 크기 로그
          console.log("압축 전 파일 크기:", file.size, "bytes")

          const compressedFile = await imageCompression(file, options)

          // 압축 후 파일 크기 로그
          console.log("압축 후 파일 크기:", compressedFile.size, "bytes")

          return compressedFile
        })
      )

      const newUploaded = compressedFiles.map((file) => {
        return {
          file,
          previewUrl: URL.createObjectURL(file),
        }
      })

      setUploadedImages((prev) => [...prev, ...newUploaded])
    } catch (error) {
      console.error("이미지 압축 오류:", error)
      addToast("이미지 압축 중 오류가 발생했습니다.", "warning", 3000, "qna")
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
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
      />
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
      <Heading>문의내용</Heading>
      <TextAreaContainer>
        <TextAreaSection>
          <textarea
            placeholder="문의하실 내용을 입력하세요."
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
        showRouteLink={true}
      />
    </>
  )
}

export default ContactSupport

const NoticeBox = styled.div`
  p {
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
      filter: invert(47%) sepia(85%) saturate(1338%) hue-rotate(324deg)
        brightness(97%) contrast(101%);
    }
  }
  ul li {
    position: relative;
    padding-left: 1.5rem;
    font-size: var(--font-caption-size);
    font-weight: var(--font-weight-medium);
    letter-spacing: -0.25px;
    line-height: 1.25;
    display: flex;
    align-items: flex-start;
    color: var(--gray-01);

    &::before {
      content: "";
      position: absolute;
      left: 0.5rem;
      top: 6px;
      width: 0.25rem;
      height: 0.25rem;
      border-radius: 50%;
      background: var(--gray-01);
      flex-shrink: 0;
    }
  }
`

const Heading = styled.h5`
  margin-top: 2rem;
  font-size: var(--font-h5-size);
  font-weight: 500;
  color: var(--n500-color);
`

const TitleAreaContainer = styled.div`
  height: 4.4rem;
  margin-top: 3.2rem;
  border-radius: 1rem 1rem 0 0;
  overflow: hidden;

  textarea {
    display: block;
    padding: 1.1rem 1.4rem;
    width: 100%;
    height: 100%;
    overflow: hidden;
    outline: 0;
    border: 0.1rem solid var(--n60-color);
    border-radius: 1rem 1rem 0 0;
    resize: none;
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
  margin: 0.8rem 0 2rem;
  overflow: hidden;
  outline: 0;
  background: white;
  border: 0.1rem solid var(--n60-color);
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
      font-size: var(--font-bodyM-size);
      color: var(--n200-color);
    }
  }
`

const TextAreaSection = styled.div`
  height: 10.9rem;
`

const Count = styled.div`
  margin: 1rem 0;
  text-align: right;
  font-size: 1.4rem;
  color: var(--n200-color);

  span {
    font-weight: var(--font-weight-bold);
    color: var(--primary-color);
  }
`

const ImageUploadBox = styled.div`
  padding: 0.75rem;
  border-radius: 1rem;
  background: var(--n40-color);
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
  border: 1.5px solid var(--n300-color);
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
