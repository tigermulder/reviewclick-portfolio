import { useState } from "react"
import IconNew from "assets/ico-new.svg?react"
import IconNoticeArrow from "assets/ico-notice-arrow.svg?url"
import styled from "styled-components"

const FaqItem = ({ faqItem }: any) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = () => {
    setIsOpen((prev) => !prev)
  }

  return (
    <FAQListItem>
      <Button onClick={toggleOpen}>
        <NotifyMessage>
          <IconNew />
          {faqItem.title}
          <ArrowIcon
            className={isOpen ? "active" : ""}
            src={IconNoticeArrow}
            alt="Toggle FAQ"
          />
        </NotifyMessage>
      </Button>
      {isOpen && <NoticeContent>{faqItem.content}</NoticeContent>}
    </FAQListItem>
  )
}

export default FaqItem

const FAQListItem = styled.li`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const Button = styled.button`
  background: none;
  border: none;
  padding: 0;
  width: 100%;
  text-align: left;
  cursor: pointer;
  position: relative;
`

const NotifyMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  position: relative;
  width: 100%;
  font-size: var(--font-h5-size);
  font-weight: var(--font-h5-weight);
  line-height: var(--font-h5-line-height);
  letter-spacing: var(--font-h5-letter-spacing);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  img {
    margin-left: auto;
    transition: transform 0.1s ease-in-out;
  }

  img.active {
    transform: rotate(180deg);
  }
`

const ArrowIcon = styled.img`
  width: 2.4rem;
  height: 2.4rem;
`

const NoticeContent = styled.div`
  padding: 1.6rem;
  font-size: 1.4rem;
  color: var(--gray-01);
  background: var(--whitewood);
  border-radius: 1rem;
  margin-top: 2rem;
  animation: fadeIn 0.1s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`
