import { Suspense } from "react"
import { createRoot } from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RecoilRoot } from "recoil"
import { BrowserRouter as Router } from "react-router-dom"
import GlobalLoading from "./components/GlobalLoading"
import ErrorBoundary from "components/ErrorBoundary"
import App from "./App"

const queryClient = new QueryClient()

// Vite의 BASE_URL을 활용한 basename 설정 (trailing slash 제거)
const basename = import.meta.env.BASE_URL.replace(/\/$/, "")

createRoot(document.getElementById("root")!).render(
  <RecoilRoot></RecoilRoot>
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<GlobalLoading />}>
        <Router basename={basename}>
          <ErrorBoundary>
            <App /> {/* // 라우팅 컴포넌트 */}
          </ErrorBoundary>
        </Router>
      </Suspense>
    </QueryClientProvider>
  </RecoilRoot>
)
