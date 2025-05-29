import { IExercise } from "app/models/ProgramStore"
import React from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import { Text } from "../Text"
import { createPlannedText } from "app/utils/functions"
import { colors, spacing, typography } from "app/theme"
import { observer } from "mobx-react-lite"

interface CarouselMaxeBodyItemProps {
  exercise: IExercise
}

export const CarouselMaxeBodyItem: React.FC<CarouselMaxeBodyItemProps> = observer(
  function CarouselExerciseItem({ exercise }) {
    const { name } = exercise

    const plannedText = createPlannedText(exercise)

    return (
      <View style={$container}>
        <View style={$titleContainer}>
          <Text style={$titleText}>{name} </Text>
          <Text style={$plannedText}>{plannedText}</Text>
        </View>
        <View style={$e1rmContainer}>
          <Text style={$e1rmText}>{`Bodyweight`}</Text>
        </View>
      </View>
    )
  },
)

const $container: ViewStyle = {
  gap: spacing.md,
}

const $titleContainer: ViewStyle = {
  backgroundColor: colors.palette.white,
  borderRadius: spacing.xs,
  height: 30,
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: spacing.md,
  gap: spacing.lg,
}

const $titleText: TextStyle = {
  color: colors.palette.black,
  fontSize: 16,
  fontFamily: typography.primary.semiBold,
}

const $plannedText: TextStyle = {
  color: colors.palette.black,
  fontSize: 14,
  fontFamily: typography.primary.normal,
}

const $e1rmContainer: ViewStyle = {
  borderRadius: spacing.xxs,
  backgroundColor: colors.palette.white,
  alignSelf: "flex-start",
  paddingHorizontal: spacing.md,
  height: 30,
  alignItems: "center",
}

const $e1rmText: TextStyle = {
  ...$titleText,
  lineHeight: 30,
}
