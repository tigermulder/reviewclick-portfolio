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
  | typeof RoutePath.ResetPassword
  | typeof RoutePath.MyCart
  | typeof RoutePath.MyCampaign
  | typeof RoutePath.Notification
  | typeof RoutePath.Alert
  | typeof RoutePath.ContactAdd
  | ReturnType<typeof RoutePath.MyReviewDetail>
  | ReturnType<typeof RoutePath.CampaignDetail>
  | ReturnType<typeof RoutePath.NotificationDetail>
  | ReturnType<typeof RoutePath.NoticeDetail>
  | typeof RoutePath.UserProfile
  | typeof RoutePath.UserPointLog
  | typeof RoutePath.UserServiceGuide
  | typeof RoutePath.UserEditProfile
  | typeof RoutePath.UserAccountSetting
  | typeof RoutePath.UserAccountDeletion
  | typeof RoutePath.TermsOfService
  | typeof RoutePath.PrivacyPolicy

// ** 남은일자계산 */
export interface RemainingTime {
  remainingTime: string
  isEnded: boolean
}

export interface currentRemainingTime {
  currTime: string
}

export const spaceCodeMapping: { [key: string]: string } = {
  cashwalk: "캐시워크",
}
