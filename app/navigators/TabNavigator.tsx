import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { CompositeScreenProps, useTheme } from "@react-navigation/native"
import { TextStyle, View, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Icon } from "../components"
import { translate } from "../i18n"
import { spacing, typography } from "../theme"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"
import { SettingsStack } from "./SettingsStack"
import { ExercisesStack } from "./ExercisesStack"
import { HomeStack } from "./HomeStack"
import React from "react"
import { WeekCompleteScreen } from "app/screens"
import { ColorsInterface } from "app/theme/colorsInterface"

export type DemoTabParamList = {
  DemoCommunity: undefined
  DemoHomeScreen: undefined
  DemoShowroom: { queryIndex?: string; itemIndex?: string }
  SettingsTab: undefined
  WeekComplete: undefined
  DemoPodcastList: undefined
}

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type DemoTabScreenProps<T extends keyof DemoTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<DemoTabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

const Tab = createBottomTabNavigator<DemoTabParamList>()

/**
 * This is the main navigator for the demo screens with a bottom tab bar.
 * Each tab is a stack navigator with its own set of screens.
 *
 * More info: https://reactnavigation.org/docs/bottom-tab-navigator/
 * @returns {JSX.Element} The rendered `DemoNavigator`.
 */
export function TabNavigator() {
  const { bottom } = useSafeAreaInsets()

  const { colors } = useTheme() as ColorsInterface

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          height: bottom + 70,
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text,
        tabBarLabelStyle: $tabBarLabel,
        tabBarItemStyle: $tabBarItem,
      }}
    >
      <Tab.Screen
        name="DemoHomeScreen"
        component={HomeStack}
        options={{
          tabBarLabel: () => <></>,
          tabBarIcon: ({ focused }) => (
            <View
              style={[$tabBarContainer, focused ? { backgroundColor: colors.focusedTabBg } : null]}
            >
              <Icon icon="home" color={focused ? colors.tabColor : colors.primary} size={30} />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="DemoCommunity"
        component={ExercisesStack}
        options={{
          tabBarLabel: () => <></>,
          tabBarIcon: ({ focused }) => (
            <>
              <View
                style={[
                  $tabBarContainer,
                  focused ? { backgroundColor: colors.focusedTabBg } : null,
                ]}
              >
                <Icon
                  icon="exercise"
                  color={focused ? colors.tabColor : colors.primary}
                  size={30}
                />
              </View>
            </>
          ),
        }}
      />

      <Tab.Screen
        name="WeekComplete"
        component={WeekCompleteScreen}
        // component={ChatScreen}
        options={{
          tabBarAccessibilityLabel: translate("demoNavigator.chatTab"),
          tabBarLabel: () => <></>,
          tabBarIcon: ({ focused }) => (
            <>
              <View
                style={[
                  $tabBarContainer,
                  focused ? { backgroundColor: colors.focusedTabBg } : null,
                ]}
              >
                <Icon
                  icon="progress"
                  color={focused ? colors.tabColor : colors.primary}
                  size={30}
                />
              </View>
            </>
          ),
        }}
      />

      <Tab.Screen
        name="SettingsTab"
        component={SettingsStack}
        options={{
          tabBarLabel: () => <></>,
          tabBarIcon: ({ focused }) => (
            <>
              <View
                style={[
                  $tabBarContainer,
                  focused ? { backgroundColor: colors.focusedTabBg } : null,
                ]}
              >
                <Icon
                  icon="settings"
                  color={focused ? colors.tabColor : colors.primary}
                  size={30}
                />
              </View>
            </>
          ),
        }}
      />
    </Tab.Navigator>
  )
}

// const $tabBar: ViewStyle = {
//   backgroundColor: colors.background,
//   borderTopColor: colors.transparent,
// }

const $tabBarItem: ViewStyle = {
  paddingTop: spacing.md,
}

const $tabBarLabel: TextStyle = {
  fontSize: 12,
  fontFamily: typography.primary.medium,
  lineHeight: 16,
}
const $tabBarContainer: TextStyle = {
  borderRadius: spacing.xs,
  width: 55,
  height: 55,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}
