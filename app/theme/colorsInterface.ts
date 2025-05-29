import { Theme } from "@react-navigation/native"

export interface ColorsInterface extends Theme {
  colors: Theme["colors"] & {
    grey: string
    secondary: string
    alternativeText: string
    focusedTabBg: string
    tabColor: string
  }
}
