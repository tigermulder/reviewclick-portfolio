import { Viewer, Worker } from "@react-pdf-viewer/core"
import {
  pageNavigationPlugin,
  RenderCurrentPageLabelProps,
} from "@react-pdf-viewer/page-navigation"
import {
  zoomPlugin,
  RenderCurrentScaleProps,
  RenderZoomInProps,
  RenderZoomOutProps,
} from "@react-pdf-viewer/zoom"
import "@react-pdf-viewer/core/lib/styles/index.css"
import "@react-pdf-viewer/zoom/lib/styles/index.css"
import "@react-pdf-viewer/page-navigation/lib/styles/index.css"
import styled from "styled-components"
import { PDFViewerProps } from "@/types/component-types/pdf-viewr-type"
import Button from "./Button"
import GlobalLoading from "./GlobalLoading"
import { useState } from "react"

const PDFViewer = ({ fileUrl }: PDFViewerProps) => {
  const [isLoading, setIsLoading] = useState(true)
  // Zoom 플러그인 인스턴스
  const zoomPluginInstance = zoomPlugin()
  const { CurrentScale, ZoomIn, ZoomOut } = zoomPluginInstance

  // 페이지 네비게이션 플러그인 인스턴스
  const pageNavigationPluginInstance = pageNavigationPlugin()
  const { CurrentPageLabel } = pageNavigationPluginInstance

  const handleDocumentLoad = () => {
    setIsLoading(false)
  }

  return (
    <PDFContainer>
      {/* 3. 로딩 중일 때 스피너 표시 */}
      {isLoading && <GlobalLoading />}

      <ToolBox>
        {/* 현재 페이지 / 전체 페이지 */}
        <CurrentPageLabel>
          {(props: RenderCurrentPageLabelProps) => (
            <PageLabelWrapper>
              {`${props.currentPage + 1} / ${props.numberOfPages}`}
            </PageLabelWrapper>
          )}
        </CurrentPageLabel>
        {/* Zoom 기능 */}
        <ZoomTool>
          <CurrentScaleBox>
            <CurrentScale>
              {(props: RenderCurrentScaleProps) => (
                <>{`${Math.round(props.scale * 100)}%`}</>
              )}
            </CurrentScale>
          </CurrentScaleBox>
          <ZoomOut>
            {(props: RenderZoomOutProps) => (
              <Button
                $variant="outlined"
                onClick={props.onClick}
                $padding="1.4rem"
              >
                <ZoomMinusBtn />
              </Button>
            )}
          </ZoomOut>
          <ZoomIn>
            {(props: RenderZoomInProps) => (
              <Button
                $variant="outlined"
                onClick={props.onClick}
                $padding="1.4rem"
              >
                <ZoomPlusBtn />
              </Button>
            )}
          </ZoomIn>
        </ZoomTool>
      </ToolBox>

      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
        <Viewer
          fileUrl={fileUrl}
          plugins={[zoomPluginInstance, pageNavigationPluginInstance]}
          onDocumentLoad={handleDocumentLoad}
        />
      </Worker>
    </PDFContainer>
  )
}

export default PDFViewer

const PDFContainer = styled.div`
  padding: 11rem 0 13rem;
`

const ToolBox = styled.div`
  position: fixed;
  width: 100%;
  top: 5.2rem;
  left: 0;
  padding: 1.6rem 2.6rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 999;
`

const CurrentScaleBox = styled.div`
  padding: 0;
`

const ZoomTool = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const PageLabelWrapper = styled.span`
  display: inline-block;
  background-color: rgba(0, 0, 0, 0.08);
  width: 5rem;
  text-align: center;
  padding: 0.2rem 0;
  border-radius: 0.4rem;
  color: var(--RevBlack);
`

const ZoomMinusBtn = styled.div`
  position: relative;
  &::before {
    content: "";
    position: absolute;
    width: 12px;
    height: 2px;
    background-color: #333;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`

const ZoomPlusBtn = styled.div`
  position: relative;
  &::before {
    content: "";
    position: absolute;
    width: 12px;
    height: 2px;
    background-color: #333;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  &::after {
    content: "";
    position: absolute;
    width: 2px;
    height: 12px;
    background-color: #333;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`
