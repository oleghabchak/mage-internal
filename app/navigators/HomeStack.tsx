import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { FinishedBlockScreen, HomeScreen, PreBlockMaxesScreen } from "app/screens"
import { AppStackParamList } from "./AppNavigator"

const Stack = createNativeStackNavigator<AppStackParamList>()

export const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="HomeScreen">
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="PreBlockMaxes" component={PreBlockMaxesScreen} />
      <Stack.Screen name="FinishedBlock" component={FinishedBlockScreen} />
    </Stack.Navigator>
  )
}
