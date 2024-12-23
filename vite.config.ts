import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react-swc"
import tsconfigPaths from "vite-tsconfig-paths"
import svgr from "vite-plugin-svgr"
import { createHtmlPlugin } from "vite-plugin-html"
import path from "path"
import { visualizer } from "rollup-plugin-visualizer"

export default defineConfig(({ mode }) => {
  // 환경 변수를 로드
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  return {
    base: "/", // 기본 경로 설정
    plugins: [
      react(),
      tsconfigPaths(),
      svgr(),
      createHtmlPlugin({ minify: true }),
      visualizer({ open: true, gzipSize: true, brotliSize: true }), // 청크 시각화 도구 추가
    ], // Vite 플러그인
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"), // 'src' 폴더를 '@'로 매핑
        pages: path.resolve(__dirname, "./src/pages"),
        components: path.resolve(__dirname, "./src/components"),
        assets: path.resolve(__dirname, "./src/assets"),
        store: path.resolve(__dirname, "./src/store"),
        utils: path.resolve(__dirname, "./src/utils"),
        types: path.resolve(__dirname, "./src/types"),
        services: path.resolve(__dirname, "./src/services"),
        hooks: path.resolve(__dirname, "./src/hooks"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: "https://dev-api.revuclick.io",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    build: {
      outDir: "dist",
      emptyOutDir: true,
      sourcemap: false,
      minify: "esbuild",
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          // 청크 분할 전략 개선
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("styled-components")) {
                return "styled-components"
              }
              if (id.includes("swiper")) {
                return "swiper"
              }
              if (id.includes("axios")) {
                return "axios"
              }
              if (id.includes("recoil")) {
                return "recoil"
              }
              if (
                id.includes("react") ||
                id.includes("react-dom") ||
                id.includes("react-router-dom")
              ) {
                return "react-vendors"
              }
              return "vendor"
            }
            // PDF.js 워커 처리
            if (id.includes("pdfjs-dist/build/pdf.worker.entry")) {
              return "pdf-worker"
            }
            // 페이지 기반 코드 스플리팅
            if (id.includes(path.resolve(__dirname, "src/pages"))) {
              const parts = id.split(path.sep)
              const pageName = parts[parts.indexOf("pages") + 1]
              return `page-${pageName}`
            }
            // 컴포넌트 공통 청크
            if (id.includes(path.resolve(__dirname, "src/components"))) {
              return "components-common"
            }
            // 유틸리티, 훅 등 공통 모듈
            if (
              id.includes(path.resolve(__dirname, "src/utils")) ||
              id.includes(path.resolve(__dirname, "src/hooks")) ||
              id.includes(path.resolve(__dirname, "src/services")) ||
              id.includes(path.resolve(__dirname, "src/store"))
            ) {
              return "common"
            }
          },
          assetFileNames: (assetInfo) => {
            let extType: string = assetInfo?.name?.split(".").pop() || "misc"
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              extType = "img"
            } else if (/css|scss|less/i.test(extType)) {
              extType = "css"
            } else if (/woff2?|eot|ttf|otf/i.test(extType)) {
              extType = "fonts"
            } else {
              extType = "misc"
            }
            return `assets/${extType}/[name]-[hash][extname]`
          },
          chunkFileNames: "assets/js/[name]-[hash].js",
          entryFileNames: "assets/js/[name]-[hash].js",
        },
        external: ["pdfjs-dist/build/pdf.worker.entry"],
      },
      assetsInlineLimit: 4096, // 기본값(4KB)
    },
  }
})
