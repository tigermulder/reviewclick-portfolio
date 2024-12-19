import { useSetRecoilState } from "recoil"
import { isShareModalOpenState } from "store/modal-recoil"
import styled from "styled-components"
import IconShare from "assets/ico-campaign-detail-share.svg?react" // SVG를 React 컴포넌트로 임포트

const ShareButton = () => {
  const setIsModalOpen = useSetRecoilState(isShareModalOpenState)

  // 버튼 클릭 시 모달을 열기
  const openModal = () => {
    setIsModalOpen(true)
  }

  return (
    <StyledShareButton onClick={openModal}>
      <IconShare aria-hidden="true" /> {/* SVG 아이콘 사용 */}
    </StyledShareButton>
  )
}

export default ShareButton

const StyledShareButton = styled.button`
  position: fixed;
  top: 15px;
  right: 15px;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  opacity: 0.7;
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
  z-index: 999;
  cursor: pointer;

  &:hover {
    opacity: 1;
  }
`
