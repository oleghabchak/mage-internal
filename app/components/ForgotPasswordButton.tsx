import { useNavigation } from "@react-navigation/native"
import { colors, typography } from "app/theme"
import React from "react"
import { Text, TextStyle, TouchableOpacity } from "react-native"

export const ForgotPasswordButton: React.FC = () => {
  const navigation = useNavigation()

  return (
    <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword" as never)}>
      <Text style={$text}>Forgot password?</Text>
    </TouchableOpacity>
  )
}

const $text: TextStyle = {
  color: colors.palette.white,
  fontFamily: typography.fonts.manrope.semiBold,
  fontSize: 10,
}
