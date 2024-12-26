import { useCallback, useEffect, useRef, useState } from "react"
import * as pdfjsLib from "pdfjs-dist"
import { PDFDocumentProxy } from "pdfjs-dist"
import PDFPage from "./PDFPage"
import GlobalLoading from "./GlobalLoading"
import { PDFViewerProps } from "@/types/component-types/pdf-viewr-type"

type TouchData = {
  identifier: number
  clientX: number
  clientY: number
}

const PDFViewer = ({ pdfPath }: PDFViewerProps) => {
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null)
  const [numPages, setNumPages] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [scale, setScale] = useState<number>(2)

  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js`

  const loadPDF = useCallback(async (path: string) => {
    setLoading(true)
    setError(null)
    try {
      const loadingTask = pdfjsLib.getDocument(path)
      const loadedDoc = await loadingTask.promise
      setDoc(loadedDoc)
      setNumPages(loadedDoc.numPages)
      console.log(`PDF 로드 완료: Total ${loadedDoc.numPages} page`)
    } catch (err) {
      console.error("PDF 로드 중 오류 발생:", err)
      setError("PDF 문서 로드에 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (pdfPath) {
      loadPDF(pdfPath)
    }
  }, [pdfPath, loadPDF])

  // 확대/축소 버튼
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.5, 5))
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.5, 0.5))

  // ---------------------------
  // 터치 핸들링
  // ---------------------------
  const containerRef = useRef<HTMLDivElement>(null)
  const touchesRef = useRef<TouchData[]>([])
  const prevDiffRef = useRef<number>(-1)

  // (참고) touchAction: "auto"로 두고,
  // onTouchMove()에서 조건부로 preventDefault()를 호출
  // => 한 손가락 스크롤은 가능, 두 손가락 핀치 시 기본동작 차단
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    // 터치 시작된 손가락들 저장
    const { changedTouches } = e
    for (let i = 0; i < changedTouches.length; i++) {
      const t = changedTouches[i]
      if (touchesRef.current.length < 2) {
        touchesRef.current.push({
          identifier: t.identifier,
          clientX: t.clientX,
          clientY: t.clientY,
        })
      }
    }
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const { changedTouches } = e

    // 현재 활성화 중인 터치 업데이트
    for (let i = 0; i < changedTouches.length; i++) {
      const t = changedTouches[i]
      const idx = touchesRef.current.findIndex(
        (x) => x.identifier === t.identifier
      )
      if (idx !== -1) {
        touchesRef.current[idx] = {
          identifier: t.identifier,
          clientX: t.clientX,
          clientY: t.clientY,
        }
      }
    }

    // === 1. 한 손가락인 경우 -> 스크롤 허용 (기본동작)
    if (touchesRef.current.length === 1) {
      // 스크롤하려면 preventDefault()를 호출하지 않는다
      return
    }

    // === 2. 두 손가락인 경우 -> 핀치 줌
    if (touchesRef.current.length === 2) {
      // 브라우저 기본 스크롤/확대 방지
      e.preventDefault()

      const [t1, t2] = touchesRef.current
      const xDiff = t1.clientX - t2.clientX
      const yDiff = t1.clientY - t2.clientY
      const curDiff = Math.sqrt(xDiff * xDiff + yDiff * yDiff)

      if (prevDiffRef.current > 0) {
        const zoomDelta = curDiff - prevDiffRef.current
        const factor = 0.02
        setScale((prev) => {
          const next = zoomDelta > 0 ? prev + factor : prev - factor
          return Math.max(0.5, Math.min(5, next))
        })
      }

      prevDiffRef.current = curDiff
    }
  }

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const { changedTouches } = e
    for (let i = 0; i < changedTouches.length; i++) {
      const endTouch = changedTouches[i]
      touchesRef.current = touchesRef.current.filter(
        (x) => x.identifier !== endTouch.identifier
      )
    }
    if (touchesRef.current.length < 2) {
      prevDiffRef.current = -1
    }
  }

  if (loading) {
    return <GlobalLoading />
  }

  if (!doc) {
    return <div>문서가 로드되지 않았습니다.</div>
  }

  return (
    <div
      ref={containerRef}
      style={{
        // 스크롤 가능
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.7rem",
        padding: "0.7rem",
        backgroundColor: "#f0f0f0",
        // pan-y: 세로 스크롤 허용, pinch-zoom: 일부 브라우저에서 핀치도 허용
        // (아직 호환성 이슈가 많으므로, 여기서는 onTouchMove에서 직접 preventDefault() 제어)
        touchAction: "auto",
        height: "100vh",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {/* Zoom 버튼 UI */}
      <div style={{ display: "flex", gap: "0.8rem", justifyContent: "center" }}>
        <button
          onClick={zoomOut}
          style={{
            backgroundColor: "#333",
            color: "white",
            padding: "0 0.45rem",
          }}
        >
          -
        </button>
        <span>Zoom: {scale.toFixed(2)}x</span>
        <button
          onClick={zoomIn}
          style={{
            backgroundColor: "#333",
            color: "white",
            padding: "0 0.45rem",
          }}
        >
          +
        </button>
      </div>

      {/* PDF pages */}
      {Array.from(new Array(numPages), (_, index) => (
        <PDFPage
          key={`page_${index + 1}`}
          doc={doc}
          pageNumber={index + 1}
          scale={scale}
        />
      ))}
    </div>
  )
}

export default PDFViewer
