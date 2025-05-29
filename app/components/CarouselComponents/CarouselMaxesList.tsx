import { IWorkout } from "app/models/ProgramStore"
import { generateUUID } from "app/utils/uuid"
import React from "react"
import { ScrollView, ViewStyle } from "react-native"
import { spacing } from "app/theme"
import { CarouselMaxesWRSItem } from "./CarouselMaxesWRSItem"
import { CarouselMaxeBodyItem } from "./CarouselMaxeBodyItem"
import { useTheme } from "@react-navigation/native"
import { ColorsInterface } from "app/theme/colorsInterface"

interface CarouselMaxesListProps {
  workout: IWorkout
}

export const CarouselMaxesList: React.FC<CarouselMaxesListProps> = ({ workout }) => {
  const { colors: themeColors } = useTheme() as ColorsInterface
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={$list}
      contentContainerStyle={$container}
    >
      {workout.exercises.map((exercise) => {
        if (exercise.exerciseclass === "wrs")
          return <CarouselMaxesWRSItem key={generateUUID()} exercise={exercise} />

        if (exercise.exerciseclass === "body")
          return <CarouselMaxeBodyItem key={generateUUID()} exercise={exercise} />

        return null
      })}
    </ScrollView>
  )
}

const $container: ViewStyle = { gap: spacing.md }
const $list: ViewStyle = { height: 280 }
