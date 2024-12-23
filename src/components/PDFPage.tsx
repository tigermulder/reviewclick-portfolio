import { useEffect, useRef, useCallback } from "react"
import { useInView } from "react-intersection-observer"
import { PDFDocumentProxy } from "pdfjs-dist"

type PDFPageProps = {
  doc: PDFDocumentProxy
  pageNumber: number
  scale?: number
}

const PDFPage = ({ doc, pageNumber, scale = 1.5 }: PDFPageProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const renderPage = useCallback(async () => {
    if (!doc || !canvasRef.current) return

    try {
      const page = await doc.getPage(pageNumber)
      const viewport = page.getViewport({ scale })
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = viewport.width
        canvas.height = viewport.height

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        }

        await page.render(renderContext).promise
        console.log(`페이지 ${pageNumber} 렌더링 성공`)
      }
    } catch (error) {
      console.error(`페이지 ${pageNumber} 렌더링 중 오류 발생:`, error)
    }
  }, [doc, pageNumber, scale])

  useEffect(() => {
    if (inView) {
      renderPage()
    }
  }, [inView, renderPage])

  return (
    <div
      ref={ref}
      style={{ height: "auto", boxShadow: "0 0 4px 0 rgba(0, 0, 0, 0.2)" }}
    >
      {inView && (
        <canvas
          ref={canvasRef}
          style={{ display: "block", margin: "0 auto" }}
        />
      )}
      {!inView && <div style={{ height: "487px" }}></div>}
    </div>
  )
}

export default PDFPage
