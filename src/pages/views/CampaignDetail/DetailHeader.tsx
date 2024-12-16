import { DetailHeaderProps } from "@/types/component-types/detail-header-type"
import styled from "styled-components"

function DetailHeader({ imageUrl, scale }: DetailHeaderProps) {
  return (
    <HeaderContainer>
      <Background $imageUrl={imageUrl} $scale={scale} />
    </HeaderContainer>
  )
}

export default DetailHeader

const HeaderContainer = styled.div`
  position: relative;
  aspect-ratio: 78 / 100;
`

const Background = styled.div<{
  $imageUrl: string
  $scale: number
}>`
  position: fixed;
  max-width: 768px;
  min-width: 280px;
  top: 0;
  left: 0;
  background-image: url(${(props) => props.$imageUrl});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  width: 100%;
  aspect-ratio: 78 / 95;
  z-index: -10;
  transform: scale(${(props) => props.$scale});
  transition: transform 0.2s ease-in-out;
`
