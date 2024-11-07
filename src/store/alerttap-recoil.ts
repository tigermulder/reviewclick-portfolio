import { atom } from "recoil"

export const alertSelectedTabState = atom<string>({
  key: "alertSelectedTabState",
  default: "news",
})
