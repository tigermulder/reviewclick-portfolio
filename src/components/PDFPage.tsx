import { useEffect, useRef, useCallback, useState } from "react"
import { useInView } from "react-intersection-observer"
import { PDFDocumentProxy } from "pdfjs-dist"

type PDFPageProps = {
  doc: PDFDocumentProxy
  pageNumber: number
  initialScale?: number
}

const PDFPage = ({ doc, pageNumber, initialScale = 1.5 }: PDFPageProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [scale, setScale] = useState(initialScale)

  const renderPage = useCallback(
    async (scaleValue: number) => {
      if (!doc || !canvasRef.current) return

      try {
        const page = await doc.getPage(pageNumber)
        const viewport = page.getViewport({ scale: scaleValue })
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
    },
    [doc, pageNumber]
  )

  useEffect(() => {
    if (inView) {
      renderPage(scale)
    }
  }, [inView, renderPage, scale])

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.5, 5))
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.5, 0.5))

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        boxShadow: "0 0 4px 0 rgba(0, 0, 0, 0.2)",
      }}
    >
      {inView && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "0.4rem 0",
              gap: "0.8rem",
            }}
          >
            <button
              onClick={zoomOut}
              style={{
                backgroundColor: "var(--N600)",
                color: "white",
                padding: "0 0.45rem",
              }}
            >
              -
            </button>
            <span>Zoom: {scale.toFixed(1)}x</span>
            <button
              onClick={zoomIn}
              style={{
                backgroundColor: "var(--N600)",
                color: "white",
                padding: "0 0.45rem",
              }}
            >
              +
            </button>
          </div>
          <canvas
            ref={canvasRef}
            style={{ display: "block", margin: "0 auto" }}
          />
        </>
      )}
      {!inView && <div style={{ height: "487px" }}></div>}
    </div>
  )
}

export default PDFPage
