export const RoutePath = {
  Home: "",
  Login: "/login",
  Join: "/join",
  JoinVerify: "/join/verify",
  FindId: "/find_id",
  FindPassword: "/find_password",
  ResetPassword: "/reset_password",
  MyCart: "/my_cart",
  MyCampaign: "/my_campaign",
  Notification: "/notification",
  Alert: "/alert",
  ContactAdd: "/alert/contactadd",
  UserProfile: "/user",
  UserPointLog: "/user/my_pointlog",
  UserServiceGuide: "/user/my_serviceguide",
  UserEditProfile: "/user/my_editprofile",
  UserAccountSetting: "/user/my_accountsetting",
  UserAccountDeletion: "/user/my_accountsetting/userdeletion",
  MyReviewDetail: (reviewId: string) => `/my_campaign/${reviewId}`,
  CampaignDetail: (campaignCode: string) => `/campaign/${campaignCode}`,
  NoticeDetail: (noticeId: string) => `/alert/notice/${noticeId}`,
  NotificationDetail: (notificationId: string) =>
    `/alert/notification/${notificationId}`,
  TermsOfService: "/terms_service",
  PrivacyPolicy: "/privacy_policy",
  Introduce: "/introduce_service",
  NotFound: "/404",
} as const

export type RoutePath = (typeof RoutePath)[keyof typeof RoutePath]

export interface ContentProps {
  $isSpecialPage: boolean
  $isCampaignDetail: boolean
  $isMyCampaignPage: boolean
  $isUserPointLogPage: boolean
  $UserServiceGuidePage: boolean
  $TermsOfServicePage: boolean
  $PrivacyPolicyPage: boolean
  $UserAccountDeletionPage: boolean
  $ContactAddPage: boolean
  $isNoticeDetail: boolean
  $isNotificationDetail: boolean
  $isIntroducePage: boolean
  $isNotFound: boolean
}
