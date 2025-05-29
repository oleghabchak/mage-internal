import { ColorsInterface } from "./colorsInterface"

export const createLightTheme = (
  primaryColor: string,
  secondaryColor: string,
  backgroundColor: string,
  textColor: string,
  greyColor: string,
  alternativeText: string,
  focusedTabBg: string,
  tabColor: string,
): ColorsInterface => ({
  dark: false,
  colors: {
    primary: primaryColor,
    secondary: secondaryColor,
    background: backgroundColor,
    border: "transparent",
    card: backgroundColor,
    text: textColor,
    notification: backgroundColor,
    accent: primaryColor,
    grey: greyColor,
    alternativeText: alternativeText,
    focusedTabBg: focusedTabBg,
    tabColor: tabColor,
  },
})
