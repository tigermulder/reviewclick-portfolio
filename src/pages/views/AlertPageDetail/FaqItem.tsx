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
      <button onClick={toggleOpen}>
        <NotifyMessage>
          <IconNew />
          <p>{faqItem.title}</p>
          <ArrowIcon
            className={isOpen ? "active" : ""}
            src={IconNoticeArrow}
            alt="Toggle FAQ"
          />
        </NotifyMessage>
      </button>
      {isOpen && (
        <NoticeContent>
          <p>{faqItem.content}</p>
        </NoticeContent>
      )}
    </FAQListItem>
  )
}

export default FaqItem

const FAQListItem = styled.li`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const NotifyMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 1.9rem;

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
  background-color: var(--WWood);
  border-radius: 1rem;
  margin-top: 2rem;
  animation: fadeIn 0.1s ease-in-out;

  p {
    font-size: 1.4rem;
    color: var(--Gray02);
    white-space: pre-line;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`
