export const RoutePath = {
  Home: "/",
  Login: "/login",
  Join: "/join",
  FindId: "/find_id",
  FindPassword: "/find_password",
  ResetPassword: "/reset_password",
  MyCart: "/my_cart",
  MyCampaign: "/my_campaign",
  Notification: "/notification",
  Alert: "/alert",
  UserProfile: "/user",
  UserPointLog: "/user/my_pointLog",
  UserServiceGuide: "/user/my_ServiceGuide",
  UserEditProfile: "/user/my_EditProfile",
  MyReivewDetail: (reviewId: string) => `/my_campaign/${reviewId}`,
  CampaignDetail: (campaignId: string) => `/campaign/${campaignId}`,
} as const

export type RoutePath = (typeof RoutePath)[keyof typeof RoutePath]

export interface ContentProps {
  $isSpecialPage: boolean
  $isCampaignDetail: boolean
  $isMyCampaignPage: boolean
  $isUserPointLogPage: boolean
  $UserServiceGuidePage: boolean
}
