import { useTheme } from "@react-navigation/native"
import { useStores } from "app/models"
import { IExercise } from "app/models/ProgramStore"
import { colors, spacing, typography } from "app/theme"
import { ColorsInterface } from "app/theme/colorsInterface"
import { generateUUID } from "app/utils/uuid"
import { observer } from "mobx-react-lite"
import React, { useEffect, useRef } from "react"
import {
  Animated,
  LayoutChangeEvent,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"

interface IEvaluationData {
  mark: number
  text: string
  emoji: string
}

const evaluationData: IEvaluationData[] = [
  {
    mark: 1,
    text: "I dont want to talk about it",
    emoji: "☠️",
  },
  {
    mark: 2,
    text: "Not bad, But not good",
    emoji: "🫠",
  },
  {
    mark: 3,
    text: "As expected",
    emoji: "🙂",
  },
  {
    mark: 4,
    text: "Happy with that",
    emoji: "😄",
  },
  {
    mark: 5,
    text: "Smashed it",
    emoji: "😍",
  },
]

const emojiSize = 35

interface EmodjyBarProps {
  disabled: boolean
  evaluated: boolean
  currentEvaluation: IEvaluationData
  chooseEvaluation: (arg: number) => void
}

const EmojiBar: React.FC<EmodjyBarProps> = ({
  disabled,
  evaluated,
  currentEvaluation,
  chooseEvaluation,
}) => {
  const { colors: themeColors } = useTheme() as ColorsInterface
  const emojiPosition = useRef(new Animated.Value(0)).current
  const containerWidth = useRef(0)
  const stepsAmount = evaluationData.length - 1

  const handleChangeEvaluation = (item: IEvaluationData) => {
    const evaluation = (item.mark - 1) * 25
    chooseEvaluation(evaluation)
  }

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout
    containerWidth.current = width
    Animated.timing(emojiPosition, {
      toValue: (currentEvaluation.mark - 1) * ((containerWidth.current - emojiSize) / stepsAmount),
      duration: 300,
      useNativeDriver: false,
    }).start()
  }

  useEffect(() => {
    Animated.timing(emojiPosition, {
      toValue: (currentEvaluation.mark - 1) * ((containerWidth.current - emojiSize) / stepsAmount),
      duration: 300,
      useNativeDriver: false,
    }).start()
  }, [currentEvaluation])

  return (
    <View style={[$container, { backgroundColor: themeColors.primary }]} onLayout={handleLayout}>
      {evaluationData.map((item) => {
        const handleChoseEvaluation = () => {
          handleChangeEvaluation(item)
        }

        return (
          <TouchableOpacity
            disabled={disabled}
            key={generateUUID()}
            onPress={handleChoseEvaluation}
            style={[$button, { backgroundColor: themeColors.alternativeText }]}
            hitSlop={20}
          />
        )
      })}

      {evaluated && (
        <Animated.View
          key={generateUUID()}
          style={[
            $emojiContainer,
            {
              left: emojiPosition,
              backgroundColor: themeColors.alternativeText,
              borderColor: themeColors.primary,
            },
          ]}
        >
          <Text style={$active}>{currentEvaluation.emoji}</Text>
        </Animated.View>
      )}
    </View>
  )
}

interface EvaluationSectionProps {
  workoutId: number
  exercise: IExercise
}

export const EvaluationSection: React.FC<EvaluationSectionProps> = observer(
  function EvaluationSection({ workoutId, exercise }) {
    const {
      programStore: { setEvaluation, currentCycleOpened },
    } = useStores()

    const actualEvaluation =
      exercise.actual?.ease === undefined || exercise.actual?.ease === null
        ? 2
        : Math.round(+exercise.actual?.ease / 25)

    const evaluated = exercise.actual !== null && exercise.actual?.ease !== null

    const currentEvaluation = evaluationData[actualEvaluation]

    const handleChoseEvaluation = (evaluation: number) => {
      setEvaluation(workoutId, exercise.workoutexerciseid, evaluation)
    }
    const { colors: themeColors } = useTheme() as ColorsInterface
    return (
      <View style={$evaluationSectioncContainer}>
        <EmojiBar
          disabled={!currentCycleOpened}
          evaluated={evaluated}
          currentEvaluation={currentEvaluation}
          chooseEvaluation={handleChoseEvaluation}
        />
        {evaluated ? (
          <Text style={[$subtitle, { color: themeColors.primary }]}>{currentEvaluation.text}</Text>
        ) : (
          <Text style={[$subtitle, { color: themeColors.primary }]}>Difficulty rating</Text>
        )}
      </View>
    )
  },
)

const $container: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  height: 4,
  backgroundColor: colors.palette.primary,
  marginVertical: spacing.md,
}

const $evaluationSectioncContainer: ViewStyle = {
  gap: spacing.md,
}

const $subtitle: TextStyle = {
  fontFamily: typography.fonts.manrope.normal,
  color: colors.palette.primary,
  textAlign: "center",
  fontSize: 16,
}

const $shadow: ViewStyle = {
  shadowColor: "#000000",
  shadowOffset: {
    width: 0,
    height: 3,
  },
  shadowOpacity: 0.17,
  shadowRadius: 3.05,
  elevation: 4,
}

const $button: ViewStyle = {
  alignItems: "center",
  backgroundColor: colors.palette.white,
  height: spacing.md,
  width: spacing.md,
  borderRadius: spacing.md,
  ...$shadow,
}

const $emojiContainer: ViewStyle = {
  position: "absolute",
  height: emojiSize,
  width: emojiSize,
  backgroundColor: colors.palette.white,
  borderColor: colors.palette.primary,
  borderWidth: 1,
  borderRadius: 20,
  justifyContent: "center",
  alignItems: "center",
  ...$shadow,
}

const $active: TextStyle = {
  fontSize: 24,
  textAlign: "center",
}
