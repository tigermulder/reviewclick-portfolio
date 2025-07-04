import { useEffect, useRef, useState } from "react"
import {
  FilterDropDownProps,
  FilterOption,
} from "@/types/component-types/filter-dropdown-type"
import IconDropDown from "assets/ico-notice-arrow.svg?react"
import styled from "styled-components"

const FilterDropDown = ({
  id,
  options,
  selectedFilter,
  setSelectedFilter,
  placeholder = "선택해주세요",
  buttonWidth = "auto",
  buttonHeight = "2.8rem",
  containerWidth = "160px",
  containerHeight = "3.2rem",
  marginBottom = "0",
  openDropdown,
  setOpenDropdown,
}: FilterDropDownProps) => {
  const isOpen = openDropdown === id // 현재 드롭다운이 열려 있는지 확인
  const [dynamicContainerWidth, setDynamicContainerWidth] =
    useState(containerWidth)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [initialLoad, setInitialLoad] = useState(true) // 처음에는 플레이스 홀더 강제 노출

  const toggleDropdown = () => {
    if (initialLoad) {
      // 드롭다운을 처음 연 순간 초기 로드 상태 해제
      setInitialLoad(false)
    }
    setOpenDropdown(isOpen ? null : id) // 드롭다운 열림 상태 토글
  }

  const handleOptionClick = (option: FilterOption) => {
    setSelectedFilter(option) // 선택된 필터 업데이트
    setOpenDropdown(null) // 드롭다운 닫기
  }

  // 드롭다운 외부 클릭 시 닫힘 처리
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, setOpenDropdown])

  useEffect(() => {
    if (buttonWidth === "100%" && wrapperRef.current) {
      setDynamicContainerWidth(`${wrapperRef.current.offsetWidth}px`)
    } else {
      setDynamicContainerWidth(containerWidth)
    }
  }, [buttonWidth, containerWidth])

  const displayText = initialLoad
    ? placeholder
    : selectedFilter
      ? selectedFilter.label
      : placeholder
  const isPlaceholder = initialLoad || !selectedFilter
  return (
    <DropdownWrapper ref={wrapperRef} $marginBottom={marginBottom}>
      {/* 드롭다운을 열기 위한 버튼 */}
      <DropdownButton
        onClick={toggleDropdown}
        $width={buttonWidth}
        $height={buttonHeight}
        $isOpen={isOpen}
        $isPlaceholder={isPlaceholder}
      >
        <span>{displayText}</span>
        <IconDropDown aria-hidden="true" />
      </DropdownButton>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <DropDownContainer $width={dynamicContainerWidth}>
          {options.map((option) => (
            <DropDownItem
              key={option.id}
              $highlighted={option.id === selectedFilter.id}
              onClick={() => handleOptionClick(option)}
              $height={containerHeight}
            >
              <p>{option.label}</p>
            </DropDownItem>
          ))}
        </DropDownContainer>
      )}
    </DropdownWrapper>
  )
}

export default FilterDropDown

const DropdownWrapper = styled.div<{ $marginBottom: string }>`
  position: relative;
  margin-bottom: ${({ $marginBottom }) => $marginBottom};
`

const DropdownButton = styled.div<{
  $width: string
  $height: string
  $isOpen: boolean
  $isPlaceholder: boolean
}>`
  width: ${({ $width }) => $width};
  height: ${({ $height }) => $height};
  border: 1px solid
    ${({ $isOpen }) => ($isOpen ? "var(--L400)" : "var(--N200)")};
  box-shadow: 0px 0px 0px 2px
    ${({ $isOpen }) => ($isOpen ? "var(--L40)" : "none")};
  svg {
    transform: rotate(${({ $isOpen }) => ($isOpen ? "180deg" : "0")});
    transition: transform 0.05s ease-in-out;
  }

  padding: 0 2rem;
  background: white;
  border-radius: 0.8rem;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  display: inline-flex;
  cursor: pointer;
  transition:
    border 0.1s ease-in-out,
    box-shadow 0.1s ease-in-out;

  span {
    color: ${({ $isPlaceholder }) =>
      $isPlaceholder ? "var(--N100)" : "var(--Gray01)"};
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

const DropDownContainer = styled.div<{ $width: string }>`
  width: ${({ $width }) => $width};
  height: auto;
  padding: 0.6rem 0.75rem;
  background-color: white;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.05);
  border-radius: 0.8rem;
  border: 1px solid var(--WGray);
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  position: absolute;
  top: calc(100% + 6px);
  z-index: 99;
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

const DropDownItem = styled.div<{ $highlighted?: boolean; $height: string }>`
  width: 100%;
  height: ${({ $height }) => $height};
  position: relative;
  border-radius: 0.6rem;
  display: flex;
  align-items: center;
  padding-left: 1rem;
  background: ${({ $highlighted }) =>
    $highlighted ? "var(--WWood)" : "white"};
  border: ${({ $highlighted }) =>
    $highlighted ? "none" : "1px solid transparent"};
  cursor: pointer;
  &:hover {
    background-color: var(--WGray);
  }
  p {
    font-size: var(--font-body-size);
    color: var(--N300);
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`
