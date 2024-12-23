import { useCallback, useEffect, useState } from "react"
import * as pdfjsLib from "pdfjs-dist"
import { PDFDocumentProxy } from "pdfjs-dist"
import PDFPage from "./PDFPage"
import GlobalLoading from "./GlobalLoading"
import { PDFViewerProps } from "@/types/component-types/pdf-viewr-type"

const PDFViewer = ({ pdfPath }: PDFViewerProps) => {
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null)
  const [numPages, setNumPages] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [scale, setScale] = useState<number>(2) // 확대/축소 상태 추가

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

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.5, 5))
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.5, 0.5))

  if (loading) {
    return <GlobalLoading />
  }

  if (!doc) {
    return <div>문서가 로드되지 않았습니다.</div>
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.7rem",
        overflowY: "auto",
        padding: "0.7rem",
        backgroundColor: "var(--N40)",
      }}
    >
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
