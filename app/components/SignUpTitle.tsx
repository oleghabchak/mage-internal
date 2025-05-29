import { TxKeyPath } from "app/i18n"
import { colors, spacing } from "app/theme"
import React from "react"
import { TextStyle } from "react-native"
import { Text } from "./Text"

interface Props {
  title: TxKeyPath
  text?: TxKeyPath
}

export const SignUpTitle: React.FC<Props> = ({ title, text }) => {
  return (
    <>
      <Text testID="welcome-heading" style={$heading} tx={title} preset="heading" />
      {text && <Text style={$heading} size="sm" tx={text} preset="subheading" />}
    </>
  )
}

const $heading: TextStyle = {
  marginBottom: spacing.sm,
  color: colors.palette.white,
}
