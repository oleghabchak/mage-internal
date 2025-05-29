/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { NavigationContainer, NavigatorScreenParams, useTheme } from "@react-navigation/native"
import { createDarkTheme } from "app/theme/darkTheme"
import { createLightTheme } from "app/theme/lightTheme"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
// import {
//   createStackNavigator,
//   CardStyleInterpolators,
// } from '@react-navigation/stack';
import { observer } from "mobx-react-lite"
import React, { useEffect, useMemo, useState } from "react"

import * as Screens from "app/screens"
import Config from "../config"
import { useInitialRootStore, useStores } from "../models"
import { TabNavigator, DemoTabParamList } from "./TabNavigator"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { ColorsInterface } from "app/theme/colorsInterface"
import { palette } from "app/theme"
import userService from "app/services/user/userService"
import { changeIcon, getIcon } from "react-native-change-icon"
import { Platform, StatusBar } from "react-native"
import { ChangeIconModal } from "app/components/ChangeIconModal"
import { AppContext } from "app/context/AppContext"
import AsyncStorage from "@react-native-async-storage/async-storage"

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  Welcome: undefined
  Login: undefined
  SignUp: undefined
  Demo: NavigatorScreenParams<DemoTabParamList>
  Profile: undefined
  // 🔥 Your screens go here
  Chat: undefined
  Settings: undefined
  Home: undefined
  HomeScreen: undefined
  EditProfile: undefined
  AthleteProfile: undefined
  Maxes: undefined
  Exercise: undefined
  Exercises: undefined
  Measurements: undefined
  LifeContinued: undefined
  Equipment: undefined
  Goals: undefined
  FinishedBlock: undefined

  WeekComplete: undefined
  ForgotPassword: undefined
  ChangePassword: undefined
  ReportProblem: undefined
  PreBlockMaxes: undefined
  Coach: undefined
  BlockData: undefined
  Notification: undefined
  // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()

const AppStack = observer(function AppStack() {
  const {
    authenticationStore: { isAuthenticated },
  } = useStores()

  const { colors } = useTheme() as ColorsInterface

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: "horizontal",
        // animation:'slide_from_bottom', TODO: will posible to add animation
        navigationBarColor: colors.background,
      }}
      initialRouteName={isAuthenticated ? "Home" : "Login"}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Home" component={TabNavigator} />
          <Stack.Screen name="Welcome" component={Screens.WelcomeScreen} />
          <Stack.Screen name="Measurements" component={Screens.MeasurementsScreen} />
          <Stack.Screen name="LifeContinued" component={Screens.LifeContinuedScreen} />
          <Stack.Screen name="Equipment" component={Screens.EquipmentScreen} />
          <Stack.Screen name="Goals" component={Screens.GoalsScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Screens.LoginScreen} />
          <Stack.Screen name="SignUp" component={Screens.SignUpScreen} />
          <Stack.Screen name="ForgotPassword" component={Screens.ForgotPasswordScreen} />
        </>
      )}
    </Stack.Navigator>
  )
})

export interface NavigationProps extends Partial<React.ComponentProps<typeof NavigationContainer>> {
  hideSplashScreen: () => void
}

export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
  const [theme, setTheme] = useState("light")
  const [primaryColor, setPrimaryColor] = useState("036666")
  const [showModal, setShowModal] = useState(false)
  const [iconName, setIconName] = useState("Default")
  const { hideSplashScreen } = props
  const appContext = useMemo(() => {
    return { theme, setTheme }
  }, [theme, setTheme])
  async function getData() {
    try {
      return await userService.getProfile()
    } catch (error) {
      return
    }
  }

  useInitialRootStore(() => {
    getData()
      .then(async ({ data }: any) => {
        const theme = await getCurrentTheme(data.athlete.colormode)
        setPrimaryColor(data.athlete.accentcolor)
        setTheme(theme)
        if (Platform.OS === "android") {
          StatusBar.setBackgroundColor(theme === "dark" ? palette.grey8 : palette.white)
        }
        const currentIcon = await getIcon()
        if (data.athlete.iconname && currentIcon === "Default" && Platform.OS === "ios") {
          changeIcon(data.athlete.iconname[0].toUpperCase() + data.athlete.iconname.slice(1)).catch(
            () => changeIcon("Default"),
          )
        } else if (data.athlete.iconname && currentIcon === "Default") {
          setIconName(data.athlete.iconname[0].toUpperCase() + data.athlete.iconname.slice(1))
          setShowModal(true)
        }
      })
      .catch(() => {
        setIsLoading(false)
      })
      .finally(() => {
        setTimeout(hideSplashScreen, 500)
        setIsLoading(false)
      })
  })
  const {
    authenticationStore: { isAuthenticated },
  } = useStores()

  async function getCurrentTheme(theme: string) {
    try {
      const storedTheme = await AsyncStorage.getItem("theme")
      const themeValue = storedTheme ? JSON.parse(storedTheme) : null
      if (!themeValue) {
        return theme
      }
      return themeValue
    } catch (error) {
      console.error("Error getting theme:", error)
      return null
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      getData()
        .then(async ({ data }: any) => {
          const myTheme = await getCurrentTheme(data.athlete.colormode)
          setTheme(myTheme || "light")
          if (Platform.OS === "android") {
            StatusBar.setBackgroundColor(myTheme === "dark" ? palette.grey8 : palette.white)
          }
          setPrimaryColor(data.athlete.accentcolor)

          const hexPrimary = primaryColor.includes("#")
            ? data.athlete.accentcolor
            : `#${data.athlete.accentcolor}`

          LightTheme = createLightTheme(
            hexPrimary || palette.primary,
            hexPrimary === palette.primary ? palette.primaryBlue : palette.grey2,
            palette.white,
            palette.black,
            palette.grey2,
            palette.white,
            hexPrimary === palette.primary ? palette.primaryBlue : palette.grey2,
            hexPrimary === palette.primary ? palette.primary : hexPrimary,
          )

          DarkTheme = createDarkTheme(
            hexPrimary || palette.primaryBlue,
            hexPrimary === palette.primaryBlue ? palette.primary : palette.grey8,
            palette.grey8,
            palette.white,
            palette.black,
            palette.grey9,
            palette.black,
            hexPrimary === palette.primaryBlue ? palette.primary : hexPrimary,
            hexPrimary === palette.primaryBlue ? palette.primaryBlue : palette.black,
          )

          setLight(LightTheme)
          setDark(DarkTheme)
          setIsLoading(false)

          const currentIcon = await getIcon()
          if (data.athlete.iconname && currentIcon === "Default" && Platform.OS === "ios") {
            changeIcon(
              data.athlete.iconname[0].toUpperCase() + data.athlete.iconname.slice(1),
            ).catch(() => changeIcon("Default"))
          } else if (data.athlete.iconname && currentIcon === "Default") {
            setIconName(data.athlete.iconname[0].toUpperCase() + data.athlete.iconname.slice(1))
            setShowModal(true)
          }
        })
        .catch((error) => {
          setTheme("light")
          setPrimaryColor(palette.primary)
        })
    }
  }, [isAuthenticated])
  const [isLoading, setIsLoading] = useState(true)
  let LightTheme = createLightTheme(
    palette.primary,
    palette.primaryBlue,
    palette.white,
    palette.black,
    palette.grey2,
    palette.white,
    palette.grey2,
    palette.primary,
  )

  let DarkTheme = createDarkTheme(
    palette.primary,
    palette.primaryBlue,
    palette.white,
    palette.black,
    palette.grey2,
    palette.white,
    palette.grey2,
    palette.primary,
    palette.primary,
  )
  const [light, setLight] = useState(LightTheme)
  const [dark, setDark] = useState(DarkTheme)

  useEffect(() => {
    const loadThemeSettings = async () => {
      if (!isAuthenticated) {
        setLight(LightTheme)
        setDark(DarkTheme)
        setTheme("light")
        setIsLoading(false)
        return
      }

      const hexPrimary = primaryColor.includes("#") ? primaryColor : `#${primaryColor}`

      LightTheme = createLightTheme(
        hexPrimary || palette.primary,
        hexPrimary === palette.primary ? palette.primaryBlue : palette.grey2,
        palette.white,
        palette.black,
        palette.grey2,
        palette.white,
        hexPrimary === palette.primary ? palette.primaryBlue : palette.grey2,
        hexPrimary === palette.primary ? palette.primary : hexPrimary,
      )

      DarkTheme = createDarkTheme(
        hexPrimary || palette.primaryBlue,
        hexPrimary === palette.primaryBlue ? palette.primary : palette.grey8,
        palette.grey8,
        palette.white,
        palette.black,
        palette.grey9,
        palette.black,
        hexPrimary === palette.primaryBlue ? palette.primary : hexPrimary,
        hexPrimary === palette.primaryBlue ? palette.primaryBlue : palette.black,
      )

      setLight(LightTheme)
      setDark(DarkTheme)
      setIsLoading(false)
    }

    loadThemeSettings()
    setIsLoading(false)
  }, [primaryColor])

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <>
      {!isLoading && (
        <NavigationContainer ref={navigationRef} theme={theme === "dark" ? dark : light}>
          <AppContext.Provider value={appContext}>
            <AppStack />
          </AppContext.Provider>
        </NavigationContainer>
      )}
      {Platform.OS === "android" && (
        <ChangeIconModal
          theme={theme}
          setShowModal={setShowModal}
          showModal={showModal}
          iconName={iconName}
        />
      )}
    </>
  )
})
