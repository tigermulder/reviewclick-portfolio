/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string
  readonly VITE_SERVER_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  Kakao: any
}

// PDF 파일을 모듈로 인식할 수 있도록 타입 정의 추가
declare module "*.pdf" {
  const src: string
  export default src
}
