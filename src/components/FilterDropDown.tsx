import { useEffect, useRef, useState } from "react"
import {
  FilterDropDownProps,
  FilterOption,
} from "@/types/component-types/filter-dropdown-type"
import IconDropDown from "assets/ico-dropdown-arrow.svg?react"
import styled from "styled-components"

const FilterDropDown = ({
  id, // 드롭다운 식별을 위한 ID 추가
  options,
  selectedFilter,
  setSelectedFilter,
  buttonWidth = "auto",
  buttonHeight = "2.8rem",
  containerWidth = "160px",
  containerHeight = "3.2rem",
  containerTop = "40px",
  marginBottom = "0",
  openDropdown,
  setOpenDropdown,
}: FilterDropDownProps) => {
  const isOpen = openDropdown === id // 현재 드롭다운이 열려 있는지 확인
  const [dynamicContainerWidth, setDynamicContainerWidth] =
    useState(containerWidth)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const toggleDropdown = () => {
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

  return (
    <DropdownWrapper ref={wrapperRef} $marginBottom={marginBottom}>
      {/* 드롭다운을 열기 위한 버튼 */}
      <DropdownButton
        onClick={toggleDropdown}
        $width={buttonWidth}
        $height={buttonHeight}
      >
        <span>{selectedFilter.label}</span>
        <IconDropDown />
      </DropdownButton>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <DropDownContainer $width={dynamicContainerWidth} $top={containerTop}>
          {options.map((option) => (
            <DropDownItem
              key={option.id}
              $highlighted={option.id === selectedFilter.id}
              onClick={() => handleOptionClick(option)}
              $height={containerHeight}
            >
              {option.label}
            </DropDownItem>
          ))}
        </DropDownContainer>
      )}
    </DropdownWrapper>
  )
}

export default FilterDropDown

const DropdownWrapper = styled.div<{ $marginBottom: string }>`
  margin-bottom: ${({ $marginBottom }) => $marginBottom};
`

const DropdownButton = styled.div<{ $width: string; $height: string }>`
  width: ${({ $width }) => $width};
  height: ${({ $height }) => $height};
  padding: 0 0.8rem;
  background: white;
  box-shadow: 0px 0px 6px rgba(41, 54, 61, 0.05);
  border-radius: 0.8rem;
  overflow: hidden;
  border: 1px solid var(--n200-color);
  justify-content: center;
  align-items: center;
  gap: 10px;
  display: inline-flex;
  cursor: pointer;

  span {
    font-size: 1.4rem;
    color: var(--gray);
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

const DropDownContainer = styled.div<{ $width: string; $top: string }>`
  width: ${({ $width }) => $width};
  height: auto;
  padding: 1rem 0.8rem;
  background: white;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  border: 1px solid #e2e4e4;
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: absolute;
  top: ${({ $top }) => $top};
  right: 1.5rem;
  z-index: 999;
`

const DropDownItem = styled.div<{ $highlighted?: boolean; $height: string }>`
  width: 100%;
  height: ${({ $height }) => $height};
  position: relative;
  border-radius: 0.6rem;
  display: flex;
  align-items: center;
  padding-left: 1rem;
  background: ${({ $highlighted }) => ($highlighted ? "#F4F5F5" : "white")};
  color: #788991;
  font-size: 14px;
  font-weight: 500;
  line-height: 18.2px;
  border: ${({ $highlighted }) =>
    $highlighted ? "none" : "1px solid transparent"};
  cursor: pointer;
  &:hover {
    background-color: #e2e4e4;
  }
`
