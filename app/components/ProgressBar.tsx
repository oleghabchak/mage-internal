/* eslint-disable react-native/no-inline-styles */
import { useTheme } from "@react-navigation/native"
import { IWorkout } from "app/models/ProgramStore"
import { colors, spacing } from "app/theme"
import { ColorsInterface } from "app/theme/colorsInterface"
import { generateUUID } from "app/utils/uuid"
import React from "react"
import { View, ViewStyle } from "react-native"

interface ProgressBarProps {
  progress: number
  all: IWorkout[]
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, all }) => {
  const { colors: themeColors } = useTheme() as ColorsInterface
  return (
    <>
      <View style={$container}>
        {all.map((_, step) => (
          <View
            key={generateUUID()}
            style={{
              height: 3,
              width: `${100 / all?.length - 3}%`,
              backgroundColor: progress < step ? colors.palette.white : themeColors.secondary,
            }}
          ></View>
        ))}
      </View>
    </>
  )
}

const $container: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  paddingVertical: spacing.md,
  paddingHorizontal: spacing.xxxs,
  width: "100%",
}

export default ProgressBar
