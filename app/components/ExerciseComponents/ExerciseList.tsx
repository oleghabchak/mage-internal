import React from "react"
import { ExerciseItem } from "./ExerciseItem"
import { View, ViewStyle } from "react-native"
import { spacing } from "app/theme"
import { generateUUID } from "app/utils/uuid"
import { IExercise } from "app/models/ProgramStore"
import { observer } from "mobx-react-lite"

interface Props {
  exercises: IExercise[]
  workoutId: number
}
export const ExerciseList: React.FC<Props> = observer(function ExerciseList({
  workoutId,
  exercises,
}) {
  return (
    <View style={$listWrapper}>
      {exercises?.map((exercise, index) => (
        <ExerciseItem
          key={generateUUID()}
          workoutId={workoutId}
          exercise={exercise}
          index={index}
        />
      ))}
    </View>
  )
})

const $listWrapper: ViewStyle = {
  gap: spacing.ml,
}
