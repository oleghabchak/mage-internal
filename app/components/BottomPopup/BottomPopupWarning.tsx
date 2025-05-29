import { colors, typography, spacing } from "app/theme"
import React from "react"
import { View, TouchableOpacity, ViewStyle, TextStyle } from "react-native"
import { Text } from "../Text"

interface BottomPopupWarningProps {
  description: string
  onClose: () => void
  onSubmit: () => void
}

export const BottomPopupWarning: React.FC<BottomPopupWarningProps> = ({
  description,
  onClose,
  onSubmit,
}) => {
  const handleSubmit = () => {
    onSubmit()
    onClose()
  }

  return (
    <View style={$container}>
      <View style={$contentContainer}>
        <Text style={$text}>{description}</Text>
      </View>
      <View style={$buttonsContainer}>
        <TouchableOpacity style={[$button, $leftButton]} onPress={handleSubmit}>
          <Text style={$buttonText}>OK</Text>
        </TouchableOpacity>
        <TouchableOpacity style={$button} onPress={onClose}>
          <Text style={$buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const $container: ViewStyle = { flex: 1, justifyContent: "space-between" }

const $contentContainer: ViewStyle = {
  flex: 1,
  alignItems: "center",
  justifyContent: "space-evenly",
  marginHorizontal: spacing.md
}

const $border: ViewStyle = {
  borderColor: colors.palette.white,
}

const $button: ViewStyle = {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: 8,
}

const $leftButton: ViewStyle = {
  ...$border,
  borderRightWidth: 1,
}

const $buttonText: TextStyle = {
  color: colors.palette.primary,
  fontFamily: typography.fonts.manrope.medium,
  fontSize: 16,
}

const $buttonsContainer: ViewStyle = {
  flexDirection: "row",
  borderTopWidth: 1,
  ...$border,
}

const $text: TextStyle = {
  fontFamily: typography.fonts.manrope.normal,
  lineHeight: spacing.lg,
  fontSize: 14,
}
