import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { EditProfileScreen } from "app/screens/EditProfileScreen"
import { SettingsScreen } from "app/screens/SettingsScreen"
import { AthleteProfileScreen } from "app/screens/AthleteProfileScreen"
import { ChangePasswordScreen, CoachScreen, MaxesScreen, ReportProblemScreen } from "app/screens"

import { AppStackParamList } from "./AppNavigator"
import { NotificationScreen } from "app/screens/NotificationScreen"

const Stack = createNativeStackNavigator<AppStackParamList>()

export const SettingsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Settings">
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="AthleteProfile" component={AthleteProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Maxes" component={MaxesScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="ReportProblem" component={ReportProblemScreen} />
      <Stack.Screen name="Coach" component={CoachScreen} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
    </Stack.Navigator>
  )
}
