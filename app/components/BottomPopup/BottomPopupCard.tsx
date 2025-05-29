import { useTheme } from "@react-navigation/native"
import { colors, spacing, typography } from "app/theme"
import { ColorsInterface } from "app/theme/colorsInterface"
import React from "react"
import { Text, TextStyle, View, ViewStyle } from "react-native"

interface Props {
  title: string
  children?: React.ReactNode
}

export const BottomPopupCard: React.FC<Props> = ({ title, children }) => {
  const { colors } = useTheme() as ColorsInterface
  return (
    <View style={[$contentContainer, { backgroundColor: colors.grey }]}>
      <View style={$textContainer}>
        <Text style={[$header, { color: colors.text }]}>{title}</Text>
      </View>
      {children}
    </View>
  )
}

const $header: TextStyle = {
  color: "black",
  textAlign: "center",
  fontFamily: typography.fonts.manrope.medium,
  fontSize: 17,
}

const $textContainer: ViewStyle = {
  paddingVertical: spacing.xs,
  marginHorizontal: spacing.sm,
  borderBottomWidth: 1,
  borderColor: colors.palette.white,
}

const $contentContainer: ViewStyle = {
  backgroundColor: colors.palette.grey2,
  borderRadius: 20,
  minHeight: 200,
  marginHorizontal: spacing.md,
}
