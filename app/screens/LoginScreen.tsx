import { observer } from "mobx-react-lite"
import React, { ComponentType, FC, useEffect, useMemo, useRef, useState } from "react"
import { TextInput, ViewStyle, TextStyle, Dimensions, View } from "react-native"
import { Button, Icon, Screen, Text, TextField, TextFieldAccessoryProps } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import { useNavigation } from "@react-navigation/native"
import userService from "app/services/user/userService"
import { AuthTitle } from "app/components/AuthTitle"
import { PrivacyPolityButton } from "app/components/PrivacyPolicyButton"
import { IUserData } from "app/utils/types/UserData"
import { ForgotPasswordButton } from "app/components/ForgotPasswordButton"
import NetInfo from "@react-native-community/netinfo"
import * as yup from "yup"
import { errorsText, findError } from "app/utils/validationTexts"

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

const { height: screenHeight } = Dimensions.get("window")

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  const navigation = useNavigation()

  const authPasswordInput = useRef<TextInput>(null)

  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [validationError, setValidationError] = useState("")
  const [attemptsCount, setAttemptsCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const {
    authenticationStore: {
      username,
      setUserName,
      login,
      setAthleteData,
      setUserData,
      password,
      setPassword,
    },
  } = useStores()

  const validationSchema = yup.object().shape({
    username: yup.string().required(errorsText.username[0]),
    password: yup.string().required(errorsText.password[0]),
  })

  const passwordError = findError("password", validationError)
  const usernameError = findError("username", validationError)
  const loginError = findError("login", validationError)

  const loginNetworkError = !passwordError && !usernameError && !loginError && validationError

  useEffect(() => {
    return () => {
      setPassword("")
    }
  }, [])

  async function handleLogin() {
    try {
      setIsLoading(true)

      const state = await NetInfo.fetch()
      if (!state.isConnected) {
        setValidationError(
          "No internet connection. Please check your network settings and try again.",
        )
        return
      }

      await validationSchema.validate(
        {
          username,
          password,
        },
        { abortEarly: false },
      )

      setValidationError("")
      setAttemptsCount(attemptsCount + 1)

      await login(username, password)

      const { data }: { data: IUserData } = await userService.getProfile()

      if (data.user && data.athlete) {
        setUserData(data.user)
        setAthleteData(data.athlete)

        setPassword("")
      }
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const message = error.inner[0].message
        setValidationError(message)
      } else {
        setValidationError(errorsText.login[0])
      }
    } finally {
      setIsLoading(false)
    }
  }

  function goNext() {
    navigation.navigate("SignUp" as never)
  }

  const PasswordRightAccessory: ComponentType<TextFieldAccessoryProps> = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <Icon
            icon={isAuthPasswordHidden ? "hidden" : "view"}
            color={colors.palette.primary}
            containerStyle={props.style}
            size={20}
            onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
          />
        )
      },
    [isAuthPasswordHidden],
  )

  return (
    <Screen
      preset="fixed"
      backgroundColor={colors.palette.primary}
      contentContainerStyle={$contentContainer}
    >
      <View>
        <AuthTitle title="loginScreen.welcome" subtitle="loginScreen.loginToYourAccournt" />
        <TextField
          value={username}
          onChangeText={setUserName}
          containerStyle={$textField}
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          keyboardType="email-address"
          labelTx="loginScreen.emailFieldLabel"
          helper={usernameError}
          status={usernameError || loginError ? "error" : undefined}
          onSubmitEditing={() => authPasswordInput.current?.focus()}
        />

        <TextField
          ref={authPasswordInput}
          value={password}
          onChangeText={setPassword}
          containerStyle={$textField}
          autoCapitalize="none"
          keyboardType="default"
          autoComplete="password"
          autoCorrect={false}
          secureTextEntry={isAuthPasswordHidden}
          labelTx="loginScreen.passwordFieldLabel"
          helper={passwordError || loginError}
          status={passwordError || loginError ? "error" : undefined}
          onSubmitEditing={handleLogin}
          RightAccessory={PasswordRightAccessory}
        />
        <Text style={{ color: colors.error }}>{loginNetworkError}</Text>
        <ForgotPasswordButton />
        <View style={$buttonsContainer}>
          <Button
            testID="login-button"
            tx="loginScreen.login"
            preset="reversed"
            onPress={handleLogin}
            textStyle={$tapButtonText}
            isLoading={isLoading}
            disabled={isLoading}
          />
          <Button
            testID="signup-button"
            tx="loginScreen.signUp"
            preset="grey"
            onPress={goNext}
            textStyle={$tapButtonText}
          />
        </View>
      </View>

      <PrivacyPolityButton />
    </Screen>
  )
})

const $contentContainer: ViewStyle = {
  paddingTop: spacing.xxxl,
  flex: 1,
  height: screenHeight,
  justifyContent: "space-between",
  backgroundColor: colors.palette.primary,
}

const $textField: ViewStyle = {
  marginBottom: spacing.xs,
}

const $buttonsContainer: ViewStyle = {
  gap: spacing.sm,
  paddingTop: spacing.sm,
}

const $tapButtonText: TextStyle = {
  color: colors.palette.primary,
}
