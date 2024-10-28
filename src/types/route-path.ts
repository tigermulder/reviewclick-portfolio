export const RoutePath = {
  Home: "/main",
  Login: "/login",
  Join: "/join",
  FindId: "/find_id",
  FindPassword: "/find_password",
  MyCart: "/my_cart",
  MyCampaign: "/my_campaign",
  Notification: "/notification",
  Alert: "/alert",
  MyReivewDetail: (reviewId: string) => `/my_campaign/${reviewId}`,
  CampaignDetail: (campaignId: string) => `/campaign/${campaignId}`,
  UserProfile: "/user",
  UserPointLog: "/user/my_pointLog",
} as const

export type RoutePath = (typeof RoutePath)[keyof typeof RoutePath]

export interface ContentProps {
  $isSpecialPage: boolean
  $isCampaignDetail: boolean
  $isMyCampaignPage: boolean
  $isUserPointLog: boolean
}
