import { ButtonProps } from "./button-type"

export const buttonConfig: Record<
  string,
  { variant: ButtonProps["$variant"]; text: string }
> = {
  join: { variant: "default", text: "상품구매" },
  purchase: { variant: "default", text: "상품구매" },
  confirm: { variant: "default", text: "리뷰검수" },
  upload: { variant: "default", text: "리뷰등록" },
  reward: { variant: "success", text: "지급완료" },
  giveup: { variant: "failed", text: "미션중단" },
  timeout: { variant: "failed", text: "미션중단" },
}
