import { IWorkout } from "app/models/ProgramStore"
import { generateUUID } from "app/utils/uuid"
import React from "react"
import { ScrollView, TouchableOpacity, ViewStyle } from "react-native"
import { CarouselExerciseItem } from "./CarouselExerciseItem"
import { spacing } from "app/theme"

interface CarouselExercisesListProps {
  workout: IWorkout
  onPress: () => void
}

export const CarouselExercisesList: React.FC<CarouselExercisesListProps> = ({
  workout,
  onPress,
}) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={$list}>
      <TouchableOpacity onPress={onPress} style={$container}>
        {workout.exercises.map((exercise) => (
          <CarouselExerciseItem key={generateUUID()} exercise={exercise} />
        ))}
      </TouchableOpacity>
    </ScrollView>
  )
}

const $container: ViewStyle = { gap: spacing.md }
const $list: ViewStyle = { height: 280 }
