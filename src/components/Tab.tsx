import { TabsProps } from "@/types/component-types/tap-type"
import styled from "styled-components"

// ** ContentTab 컴포넌트 */
const ContentTab = ({ tabs, selectedTab, onTabSelect }: TabsProps) => {
  if (tabs.length === 0) return null // 탭이 없으면 아무것도 렌더링하지 않음

  return (
    <TabsContainer>
      {tabs.map((tab) => (
        <TabItem
          key={tab.value}
          className={selectedTab === tab.value ? "selected" : ""}
          onClick={() => tabs.length !== 1 && onTabSelect(tab.value)}
          disabled={tabs.length === 1}
        >
          {tab.label}
        </TabItem>
      ))}
    </TabsContainer>
  )
}

export default ContentTab

const TabsContainer = styled.ul`
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  overflow-x: auto;
  border-bottom: 1px solid var(--N80);
  margin-top: 3.2rem;
  padding: 0;
  list-style: none;
`

const TabItem = styled.li.attrs<{ disabled: boolean }>(({ disabled }) => ({
  "aria-disabled": disabled,
  tabIndex: disabled ? -1 : 0,
  style: {
    cursor: disabled ? "default" : "pointer",
    pointerEvents: disabled ? "none" : "auto",
  },
}))<{ disabled: boolean }>`
  padding: 1.35rem 0px;
  font-size: var(--font-h3-size);
  color: var(--N200);
  font-weight: var(--font-medium);
  white-space: nowrap;

  &.selected {
    position: relative;
    color: var(--L400);

    &:after {
      content: "";
      position: absolute;
      bottom: 0;
      left: 0;
      background-color: var(--L400);
      width: 100%;
      height: 2px;
    }
  }

  &:hover {
    color: ${({ disabled }) => (disabled ? "var(--N200)" : "var(--L400)")};
  }
`
