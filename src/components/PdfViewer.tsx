import { useCallback, useEffect, useRef, useState, TouchEvent } from "react"
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

  // scale을 외부 버튼 + 핀치 제스처로 모두 조절
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

  // ------------------------------------------------------------------
  // 기존 +, - 버튼으로 zoom
  // ------------------------------------------------------------------
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.5, 5))
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.5, 0.5))

  // ------------------------------------------------------------------
  // (추가) 터치 이벤트로 핀치 줌
  // ------------------------------------------------------------------
  // 현재 활성화된 터치(두 손가락) 정보
  const touchesRef = useRef<TouchData[]>([])
  // 두 손가락 사이의 이전 거리
  const prevDiffRef = useRef<number>(-1)

  const containerRef = useRef<HTMLDivElement>(null)

  // 기본 브라우저 핀치 줌 방지 (전체화면 확대 막기)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // DOM 이벤트 리스너에서 사용하는 콜백
    function handleTouchMove(e: globalThis.TouchEvent) {
      if (e.touches.length > 1) {
        e.preventDefault()
      }
    }

    el.addEventListener("touchmove", handleTouchMove, { passive: false })
    return () => {
      el.removeEventListener("touchmove", handleTouchMove)
    }
  }, [])

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
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

    // 두 손가락이 있을 때만 핀치 계산
    if (touchesRef.current.length === 2) {
      const [t1, t2] = touchesRef.current
      const xDiff = t1.clientX - t2.clientX
      const yDiff = t1.clientY - t2.clientY
      const curDiff = Math.sqrt(xDiff * xDiff + yDiff * yDiff)

      if (prevDiffRef.current > 0) {
        const zoomDelta = curDiff - prevDiffRef.current
        // zoomDelta 양수면 확대, 음수면 축소
        const factor = 0.02
        const direction = zoomDelta > 0 ? 1 : -1
        setScale((prev) => {
          const newScale = prev + direction * factor
          // 최소/최대값 제한
          return Math.max(0.5, Math.min(5, newScale))
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
        (t) => t.identifier !== endTouch.identifier
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
        // 스크롤 가능, 터치 핀치를 수신할 컨테이너
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.7rem",
        overflowY: "auto",
        padding: "0.7rem",
        backgroundColor: "#f0f0f0",
        // 모바일 터치 제스처 제어
        touchAction: "none",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {/* Zoom 버튼 */}
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

      {/* PDF 페이지들 */}
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
