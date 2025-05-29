import { useTheme } from "@react-navigation/native"
import { Icon, IconTypes } from "app/components"
import { colors, spacing } from "app/theme"
import { ColorsInterface } from "app/theme/colorsInterface"
import React from "react"
import { TouchableOpacity, ViewStyle } from "react-native"

interface Props {
  icon: IconTypes
  onPress: () => void
}

export const ExerciseHelpButton: React.FC<Props> = ({ icon, onPress }) => {
  const { colors: themeColors } = useTheme() as ColorsInterface
  return (
    <TouchableOpacity
      style={[$itemWrapper, { backgroundColor: themeColors.alternativeText }]}
      onPress={onPress}
    >
      <Icon icon={icon} size={20} color={themeColors.text} />
    </TouchableOpacity>
  )
}

const $itemWrapper: ViewStyle = {
  flex: 1,
  backgroundColor: colors.palette.white,
  height: 25,
  borderRadius: spacing.xs,
  justifyContent: "center",
  alignItems: "center",
}
