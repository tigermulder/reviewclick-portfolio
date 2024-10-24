import { ReactNode } from "react"
import { RoutePath } from "./route-path"

// ** useRouter type */
export type SearchParams = Record<string, string | string[]>

// ** ErrorBoundary type */
export interface ErrorBoundaryProps {
  children: ReactNode
}
export interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

// ** 인증타입 */
export interface AuthType {
  isLoggedIn: boolean
  token: string | null
}

export type RoutePathHook =
  | typeof RoutePath.Home
  | typeof RoutePath.Login
  | typeof RoutePath.Join
  | typeof RoutePath.FindId
  | typeof RoutePath.FindPassword
  | typeof RoutePath.MyCart
  | typeof RoutePath.MyCampaign
  | ReturnType<typeof RoutePath.MyReivewDetail>
  | ReturnType<typeof RoutePath.CampaignDetail>
  | ReturnType<typeof RoutePath.UserProfile>

// ** 남은일자계산 */
export interface RemainingTime {
  remainingTime: string
  isEnded: boolean
}
