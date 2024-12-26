import { Viewer, Worker } from "@react-pdf-viewer/core"
import {
  pageNavigationPlugin,
  RenderCurrentPageLabelProps,
} from "@react-pdf-viewer/page-navigation"
import {
  zoomPlugin,
  RenderZoomInProps,
  RenderZoomOutProps,
} from "@react-pdf-viewer/zoom"
import "@react-pdf-viewer/core/lib/styles/index.css"
import "@react-pdf-viewer/zoom/lib/styles/index.css"
import "@react-pdf-viewer/page-navigation/lib/styles/index.css"
import styled from "styled-components"
import { PDFViewerProps } from "@/types/component-types/pdf-viewr-type"
import Button from "./Button"

const PDFViewer = ({ fileUrl }: PDFViewerProps) => {
  // Zoom 플러그인 인스턴스
  const zoomPluginInstance = zoomPlugin()
  const { ZoomIn, ZoomOut, ZoomPopover } = zoomPluginInstance

  // 페이지 네비게이션 플러그인 인스턴스
  const pageNavigationPluginInstance = pageNavigationPlugin()
  const { CurrentPageLabel } = pageNavigationPluginInstance

  return (
    <PDFContainer>
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
          <ZoomPopover />
          <ZoomOut>
            {(props: RenderZoomOutProps) => (
              <Button $variant="outlined" onClick={props.onClick}>
                축소
              </Button>
            )}
          </ZoomOut>
          <ZoomIn>
            {(props: RenderZoomInProps) => (
              <Button $variant="outlined" onClick={props.onClick}>
                확대
              </Button>
            )}
          </ZoomIn>
        </ZoomTool>
      </ToolBox>

      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
        <Viewer
          fileUrl={fileUrl}
          plugins={[zoomPluginInstance, pageNavigationPluginInstance]}
        />
      </Worker>
    </PDFContainer>
  )
}

export default PDFViewer

const PDFContainer = styled.div`
  padding: 13.5rem 0;
`

const ToolBox = styled.div`
  position: fixed;
  width: 100%;
  top: 5.2rem;
  left: 0;
  padding: 0.6rem 2.6rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--N40);
  z-index: 999;
`

const ZoomTool = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`

const PageLabelWrapper = styled.span`
  color: #333;
`
