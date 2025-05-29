import { ColorsInterface } from "./colorsInterface"

export const createDarkTheme = (
  primaryColor: string,
  secondaryColor: string,
  backgroundColor: string,
  textColor: string,
  cardColor: string,
  greyColor: string,
  alternativeText: string,
  focusedTabBg: string,
  tabColor: string,
): ColorsInterface => ({
  dark: true,
  colors: {
    primary: primaryColor,
    secondary: secondaryColor,
    background: backgroundColor,
    border: "transparent",
    card: cardColor,
    text: textColor,
    notification: cardColor,
    accent: secondaryColor,
    grey: greyColor,
    alternativeText: alternativeText,
    focusedTabBg: focusedTabBg,
    tabColor: tabColor,
  },
})
