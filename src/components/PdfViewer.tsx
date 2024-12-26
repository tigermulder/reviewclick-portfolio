import { useCallback, useEffect, useState } from "react"
import * as pdfjsLib from "pdfjs-dist"
import { PDFDocumentProxy } from "pdfjs-dist"
import PDFPage from "./PDFPage"
import GlobalLoading from "./GlobalLoading"
import { PDFViewerProps } from "@/types/component-types/pdf-viewr-type"
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"

const PDFViewer = ({ pdfPath }: PDFViewerProps) => {
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null)
  const [numPages, setNumPages] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // 줌 기능을 제거하므로, scale은 기본값으로만 사용
  const scale = 2

  // 워커 경로 설정
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

  if (loading) {
    return <GlobalLoading />
  }

  if (!doc) {
    return <div>문서가 로드되지 않았습니다.</div>
  }

  return (
    <TransformWrapper initialScale={1} minScale={1} maxScale={4}>
      <TransformComponent>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.7rem",
            overflowY: "auto",
            padding: "0.7rem",
            backgroundColor: "#f0f0f0",
          }}
        >
          {Array.from(new Array(numPages), (_, index) => (
            <PDFPage
              key={`page_${index + 1}`}
              doc={doc}
              pageNumber={index + 1}
              scale={scale}
            />
          ))}
        </div>
      </TransformComponent>
    </TransformWrapper>
  )
}

export default PDFViewer
