import React from "react"
import { Text } from "./Text"
import { TxKeyPath } from "app/i18n"
import { TextStyle, View, ViewStyle } from "react-native"
import { colors, spacing, typography } from "app/theme"

interface Props {
  title?: TxKeyPath
  titleStyle?: TextStyle
  subtitle?: TxKeyPath
  subtitleStyle?: TextStyle
}

export const AuthTitle: React.FC<Props> = ({ title, titleStyle, subtitle, subtitleStyle }) => {
  return (
    <View style={$container}>
      {title && (
        <Text testID="login-heading" tx={title} preset="heading" style={[$title, titleStyle]} />
      )}
      {subtitle && (
        <Text tx={subtitle} size="lg" preset="subheading" style={[$subtitle, subtitleStyle]} />
      )}
    </View>
  )
}

const $container: ViewStyle = {
  gap: spacing.md,
}

const $title: TextStyle = {
  color: colors.palette.accent200,
  fontSize: 30,
  fontFamily: typography.fonts.manrope.medium,
}

const $subtitle: TextStyle = {
  marginBottom: spacing.sm,
  color: colors.palette.white,
  lineHeight: 25,
}
