import styled from "styled-components"
import { useRecoilState } from "recoil"
import { campaignFilterState } from "store/mainpage-recoil"

// ** FilterBar 컴포넌트입니다 */
export const FilterBar = () => {
  const [filter, setFilter] = useRecoilState(campaignFilterState)

  return (
    <ButtonContainer>
      <Chip
        label="최신순"
        isActive={filter === "최신순"}
        onClick={() => setFilter("최신순")}
      />
      <Chip
        label="마감순"
        isActive={filter === "마감순"}
        onClick={() => setFilter("마감순")}
      />
      <Chip
        label="인기순"
        isActive={filter === "인기순"}
        onClick={() => setFilter("인기순")}
      />
    </ButtonContainer>
  )
}

// ** Chip 컴포넌트입니다 */
export const Chip = ({
  label,
  isActive,
  onClick,
}: {
  label: string
  isActive: boolean
  onClick: () => void
}) => {
  return (
    <StyledButton $isActive={isActive} onClick={onClick}>
      {label}
    </StyledButton>
  )
}

const ButtonContainer = styled.div`
  display: flex;
  gap: 0.8rem;
  padding: 0.8rem 0;
`

const StyledButton = styled.button.attrs<{ $isActive: boolean }>(
  ({ $isActive }) => ({
    style: {
      backgroundColor: $isActive ? "var(--L400)" : "white",
      color: $isActive ? "white" : "var(--N300)",
    },
  })
)<{ $isActive: boolean }>`
  padding: 0.5rem 1.1rem;
  border-radius: 999px;
  border: 1px solid var(--WSmoke);
  font-weight: var(--font-medium);
  cursor: pointer;

  &:hover {
    background-color: ${({ $isActive }) =>
      $isActive ? "var(--L400)" : "var(--WWood)"};
    border-color: ${({ $isActive }) =>
      $isActive ? "var(--L400)" : "var(--WSmoke)"};
    font-weight: ${({ $isActive }) =>
      $isActive ? "var(--font-bold)" : "var(--font-medium)"};
  }
`
