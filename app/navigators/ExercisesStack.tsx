import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { BlockDataScreen, ExercisesScreen } from "app/screens"
import { AppStackParamList } from "./AppNavigator"

const Stack = createNativeStackNavigator<AppStackParamList>()

export const ExercisesStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Exercises">
      <Stack.Screen name="Exercises" component={ExercisesScreen} />
      <Stack.Screen name="BlockData" component={BlockDataScreen} />
    </Stack.Navigator>
  )
}
