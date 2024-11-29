import { useRecoilState } from "recoil"
import { selectedCategoryState } from "store/mainpage-recoil"
import { categories } from "utils/util"
import styled from "styled-components"

const CategoryMenu = () => {
  const [selectedCategory, setSelectedCategory] = useRecoilState(
    selectedCategoryState
  )

  return (
    <Container>
      {categories.map((category) => (
        <CategoryItem key={category.id}>
          <IconWrapper
            $isActive={selectedCategory === category.id}
            onClick={() => setSelectedCategory(category.id)}
          >
            {/* 아이콘 이미지 추가 가능 */}
          </IconWrapper>
          <CategoryText>{category.name}</CategoryText>
        </CategoryItem>
      ))}
    </Container>
  )
}

export default CategoryMenu

const Container = styled.div`
  display: flex;
  width: 100%;
  height: auto;
  justify-content: flex-start;
  align-items: center;
  padding: 16px 0;
  gap: 8px;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`

const CategoryItem = styled.div`
  width: 60px;
  height: auto;
  position: relative;
  flex-shrink: 0;
`

const IconWrapper = styled.div<{ $isActive?: boolean }>`
  width: 60px;
  height: 60px;
  margin-bottom: 8px;
  background: ${({ $isActive }) => ($isActive ? "#E9EBEC" : "transparent")};
  border-radius: 18px;
  border: ${({ $isActive }) => ($isActive ? "none" : "1.04px solid #F4F5F5")};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`

const CategoryText = styled.div`
  white-space: nowrap; /* 텍스트가 한 줄에 표시되도록 설정 */
  text-align: center;
  color: #415058;
  font-size: 14px;
  font-family: "SUIT", sans-serif;
  font-weight: 500;
  line-height: 1.3;
`
