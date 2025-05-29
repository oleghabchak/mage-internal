import { IExercise } from "app/models/ProgramStore"
import React from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import { Text } from "../Text"
import { createPlannedText } from "app/utils/functions"
import { generateUUID } from "app/utils/uuid"
import { colors, spacing, typography } from "app/theme"
import { observer } from "mobx-react-lite"
import { Icon } from "../Icon"
import { ExerciseClassEnum } from "app/utils/enums/exerciseClassesEnum"
import { useTheme } from "@react-navigation/native"
import { ColorsInterface } from "app/theme/colorsInterface"

interface CarouselExerciseItemProps {
  exercise: IExercise
}

export const CarouselExerciseItem: React.FC<CarouselExerciseItemProps> = observer(
  function CarouselExerciseItem({ exercise }) {
    const { name, touched } = exercise
    const isChecked = !!+touched
    const { colors: themeColors } = useTheme() as ColorsInterface
    const plannedText = createPlannedText(exercise)

    return (
      <View key={generateUUID()} style={[$container, { backgroundColor: themeColors.grey }]}>
        <View
          style={[
            $leftIconWrapper,
            { borderColor: themeColors.primary },
            isChecked && {
              ...$checked,
              backgroundColor: themeColors.primary,
              borderColor: themeColors.border,
            },
          ]}
        >
          {isChecked && <Icon icon={"check"} color={themeColors.secondary} size={22} />}
        </View>
        <View style={$titleContainer}>
          <Text style={[$titleText, { color: themeColors.text }]}>{name} </Text>
          {exercise.exerciseclass !== ExerciseClassEnum.INSTRUCTION && (
            <Text style={[$titleText, { color: themeColors.text }]}>{plannedText}</Text>
          )}
        </View>
      </View>
    )
  },
)

const $container: ViewStyle = {
  backgroundColor: colors.palette.white,
  borderRadius: spacing.xs,
  height: 50,
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: spacing.md,
  gap: spacing.lg,
}

const $titleContainer: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  justifyContent: "space-between",
}

const $titleText: TextStyle = {
  color: colors.palette.black,
  height: 27,
  borderRadius: 10,
  fontSize: 15,
  fontFamily: typography.primary.medium,
}

const $leftIconWrapper: ViewStyle = {
  width: 32,
  height: 32,
  borderRadius: 32,
  borderWidth: 2,
  borderColor: colors.palette.turquoise,
  justifyContent: "center",
  alignItems: "center",
}

const $checked: ViewStyle = {
  backgroundColor: colors.palette.turquoise,
}
