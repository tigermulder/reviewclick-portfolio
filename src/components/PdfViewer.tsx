import { Viewer, Worker, SpecialZoomLevel } from "@react-pdf-viewer/core"
import {
  pageNavigationPlugin,
  RenderCurrentPageLabelProps,
} from "@react-pdf-viewer/page-navigation"
import { zoomPlugin } from "@react-pdf-viewer/zoom"
import "@react-pdf-viewer/core/lib/styles/index.css"
import "@react-pdf-viewer/zoom/lib/styles/index.css"
import "@react-pdf-viewer/page-navigation/lib/styles/index.css"
import styled from "styled-components"

interface PDFViewerProps {
  fileUrl: string
}

const PDFViewer = ({ fileUrl }: PDFViewerProps) => {
  // Zoom 플러그인 인스턴스
  const zoomPluginInstance = zoomPlugin()
  const { ZoomInButton, ZoomOutButton, ZoomPopover } = zoomPluginInstance

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
          <ZoomOutButton />
          <ZoomInButton />
        </ZoomTool>
      </ToolBox>

      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.js">
        <Viewer
          fileUrl={fileUrl}
          plugins={[zoomPluginInstance, pageNavigationPluginInstance]}
          defaultScale={SpecialZoomLevel.PageFit}
        />
      </Worker>
    </PDFContainer>
  )
}

export default PDFViewer

// ---------------- Styled Components ----------------

const PDFContainer = styled.div`
  /* 필요 시 스타일 조정 */
  padding: 11rem 0 13rem;
`

const ToolBox = styled.div`
  position: fixed;
  width: 100%;
  top: 5.2rem;
  left: 0;
  padding: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--N40);
  z-index: 999;
`

const ZoomTool = styled.div`
  display: flex;
  align-items: center;
`

const PageLabelWrapper = styled.span`
  margin-left: 1rem;
  font-size: 1.4rem;
  color: #333;
`
