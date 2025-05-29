import { colors, spacing, typography } from "app/theme"
import React from "react"
import { Linking, Text, TextStyle, TouchableOpacity } from "react-native"

export const PrivacyPolityButton: React.FC = () => {
  const openPrivacyPolicy = () => {
    const privacyPolicyUrl = "https://www.themageapp.com/privacypolicy"

    // Open the URL in the external browser
    Linking.openURL(privacyPolicyUrl).catch((err) => console.error("An error occurred", err))
  }

  return (
    <TouchableOpacity onPress={openPrivacyPolicy}>
      <Text style={$text}>Privacy Policy</Text>
    </TouchableOpacity>
  )
}

const $text: TextStyle = {
  color: colors.palette.white,
  fontFamily: typography.fonts.manrope.semiBold,
  fontSize: 10,
  textAlign: "center",
  marginVertical: spacing.lg,
}
