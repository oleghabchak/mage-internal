import React, { useContext } from "react"
import { View, ViewStyle } from "react-native"
import { Screen } from "../Screen"
import { CycleHeader } from "../ExerciseComponents/CycleHeader"
import { colors, spacing } from "app/theme"
import { ExerciseList } from "../ExerciseComponents/ExerciseList"
import { SessionSection } from "../ExerciseComponents/SessionSection"
import { observer } from "mobx-react-lite"
import { useStores } from "app/models"
import { useNavigation, useTheme } from "@react-navigation/native"
import { useHeader } from "app/utils/useHeader"
import { Button } from "../Button"
import { ColorsInterface } from "app/theme/colorsInterface"
import { AppContext } from "app/context/AppContext"

interface PrimaryExerciseContentProps {}

export const PrimaryExerciseContent: React.FC<PrimaryExerciseContentProps> = observer(() => {
  const {
    programStore: {
      programData,
      currentSession,
      currentCycleIndex,
      currentCycleOpened,
      currentSessionFinished,
      currentCycleIsLast,
      currentSessionIsLast,
    },
  } = useStores()
  const navigation = useNavigation()
  const { colors: themeColors } = useTheme() as ColorsInterface
  const { theme } = useContext(AppContext)
  useHeader(
    {
      title: programData.name,
      titleContainerStyle: {
        alignItems: "center",
        justifyContent: "flex-start",
        height: "70%",
      },
      titleStyle: {
        fontSize: 16,
        color: themeColors.text,
      },

      backgroundColor: themeColors.background,
    },
    [theme],
  )

  const currentWorkout = programData.cyclelist[currentCycleIndex]?.workouts[currentSession - 1]

  const isCurrentCycleAndSessionLast = currentCycleIsLast && currentSessionIsLast

  return (
    <View style={$mainContainer}>
      <Screen statusBarStyle="dark" preset="scroll">
        <View style={$screenContentContainer}>
          <CycleHeader />
          <SessionSection sessions={programData.cyclelist[currentCycleIndex]?.workouts} />
          <ExerciseList workoutId={currentWorkout?.id} exercises={currentWorkout?.exercises} />
          {currentCycleOpened && !currentSessionFinished && (
            <Button
              text={isCurrentCycleAndSessionLast ? "End program" : "Complete Cycle"}
              style={{ backgroundColor: themeColors.primary, borderColor: themeColors.border }}
              textStyle={{ color: themeColors.alternativeText }}
              onPress={() => navigation.navigate("WeekComplete" as never)}
            />
          )}
        </View>

        {currentCycleOpened && currentSessionFinished && (
          <Button
            text={"Complete Session"}
            onPress={() => navigation.navigate("WeekComplete" as never)}
            style={{
              backgroundColor: themeColors.primary,
              borderColor: themeColors.border,
              marginTop: spacing.xl,
            }}
            textStyle={{ color: themeColors.alternativeText }}
          />
        )}
      </Screen>
    </View>
  )
})

const $mainContainer: ViewStyle = {
  flex: 1,
  justifyContent: "space-between",
  backgroundColor: colors.palette.white,
}

const $screenContentContainer: ViewStyle = {
  marginTop: spacing.sm,
  display: "flex",
  flex: 1,
  gap: spacing.lg,
}
