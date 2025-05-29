import React from "react"
import { observer } from "mobx-react-lite"
import { AppStackScreenProps } from "app/navigators"
import { useStores } from "app/models"
import { PrimaryExerciseContent } from "app/components/PrimaryExerciseComponents/PrimaryExerciseContent"
import { PrimaryExerciseEmptyContent } from "app/components/PrimaryExerciseComponents/PrimaryExerciseEmptyContent"

interface ExercisesScreenProps extends AppStackScreenProps<"Exercises"> {}

export const ExercisesScreen: React.FC<ExercisesScreenProps> = observer(function ExercisesScreen() {
  const {
    programStore: { activeProgram },
  } = useStores()

  return activeProgram ? <PrimaryExerciseContent /> : <PrimaryExerciseEmptyContent />
})
