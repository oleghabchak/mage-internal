import { colors, typography, spacing, palette } from "app/theme"
import { View, ViewStyle, TextStyle } from "react-native"
import { Icon } from "../Icon"
import LinearProgressBar from "../LinearProgressBar"
import React from "react"
import { Text } from "../Text"
import { useTheme } from "@react-navigation/native"
import { ColorsInterface } from "app/theme/colorsInterface"

interface WeekCompleteBarItemProps {
  title: string
  progress: number
}

export const WeekCompleteBarItem: React.FC<WeekCompleteBarItemProps> = ({ title, progress }) => {
  const isChecked = progress > 99

  const { colors: themeColors } = useTheme() as ColorsInterface
  return (
    <View style={$container}>
      <View
        style={[
          $leftIconWrapper,
          { borderColor: themeColors.primary },
          isChecked && {
            backgroundColor:
              themeColors.primary == palette.primaryBlue
                ? themeColors.primary
                : themeColors.primary,
            borderColor: themeColors.border,
          },
        ]}
      >
        {isChecked && <Icon icon={"check"} color={themeColors.secondary} size={22} />}
      </View>
      <View style={$sliderContainer}>
        <View style={$titleContainer}>
          <Text style={[$titleText, { color: themeColors.primary }]}>{title}</Text>
          <Text style={{ color: colors.palette.grey3 }}>{Math.round(progress)}%</Text>
        </View>
        <View style={$disableAreaWrapper} />
        <LinearProgressBar
          progressStyle={{ backgroundColor: themeColors.primary }}
          containerStyle={$progresBarContainer}
          progress={progress / 100}
        />
      </View>
    </View>
  )
}

const $titleContainer: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  height: 40,
}

const $titleText: TextStyle = {
  paddingVertical: 4,
  color: colors.palette.primary,
  fontSize: 16,
  fontFamily: typography.primary.semiBold,
  textAlign: "left",
}
const $sliderContainer: ViewStyle = {
  width: "auto",
  flex: 1,
  justifyContent: "center",
  marginBottom: 10,
}

const $disableAreaWrapper: ViewStyle = {
  position: "absolute",
  top: 0,
  bottom: 0,
  left: -20,
  right: -20,
  zIndex: 999,
}

const $leftIconWrapper: ViewStyle = {
  width: 32,
  height: 32,
  borderRadius: 32,
  borderWidth: 2,
  borderColor: colors.palette.turquoise,
  justifyContent: "center",
  alignItems: "center",
  marginTop: 40,
  marginBottom: 10,
}

const $container: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  gap: spacing.ml,
  paddingRight: spacing.md,
}

const $progresBarContainer: ViewStyle = {
  height: 5,
  backgroundColor: colors.palette.grey5,
  borderRadius: 5,
}
