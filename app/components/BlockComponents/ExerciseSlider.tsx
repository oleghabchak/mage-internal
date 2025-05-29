import { useTheme } from "@react-navigation/native"
import { Icon } from "app/components"

import { colors, spacing, typography } from "app/theme"
import { ColorsInterface } from "app/theme/colorsInterface"
import React from "react"
import { Text, TextStyle, TouchableOpacity, View, ViewStyle, Platform } from "react-native"

interface ExerciseSliderProps {
  groups: string[]
  currentGroupIndex: number
  setCurrentGroupIndex: React.Dispatch<React.SetStateAction<number>>
}

export const ExerciseSlider: React.FC<ExerciseSliderProps> = ({
  groups,
  currentGroupIndex,
  setCurrentGroupIndex,
}) => {
  const handlPressLeft = () => {
    setCurrentGroupIndex((prev) => (prev > 0 ? prev - 1 : groups.length - 1))
  }

  const handlPressRight = () => {
    setCurrentGroupIndex((prev) => (prev < groups.length - 1 ? prev + 1 : 0))
  }

  const { colors: themeColors } = useTheme() as ColorsInterface
  return (
    <View style={[$container, { backgroundColor: themeColors.grey }]}>
      <TouchableOpacity
        onPress={handlPressLeft}
        hitSlop={{ top: 15, bottom: 15, left: 10, right: 50 }}
        style={$leftButton}
      >
        <Icon icon="caretLeft" color={colors.palette.black} size={24} />
      </TouchableOpacity>

      <Text
        style={[
          $outlinedTitle,
          Platform.OS === "android" && $androidWidth,
          { color: themeColors.text },
        ]}
      >
        {groups[currentGroupIndex]}
      </Text>

      <TouchableOpacity
        onPress={handlPressRight}
        hitSlop={{ top: 20, bottom: 20, left: 50, right: 10 }}
        style={$rightButton}
      >
        <Icon icon="caretRight" color={colors.palette.black} size={24} />
      </TouchableOpacity>
    </View>
  )
}

const $container: ViewStyle = {
  flexDirection: "row",
  backgroundColor: colors.palette.grey2,
  justifyContent: "center",
  paddingVertical: spacing.sm,
  borderRadius: spacing.xs,
  alignItems: "center",
}

const $outlinedTitle: TextStyle = {
  color: colors.palette.black,
  fontSize: 32,
  fontFamily: typography.fonts.manrope.medium,
  marginVertical: spacing.sm,
}

const $leftButton: ViewStyle = {
  position: "absolute",
  left: 20,
}

const $rightButton: ViewStyle = {
  position: "absolute",
  right: 20,
}

const $androidWidth: TextStyle = {
  maxWidth: 260,
}
