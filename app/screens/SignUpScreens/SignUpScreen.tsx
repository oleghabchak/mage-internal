import { observer } from "mobx-react-lite"
import React, { FC, useMemo, useRef, useState } from "react"
import { TextInput, ViewStyle, TextStyle, View } from "react-native"
import { Button, Icon, Screen, Text, TextField, TextFieldAccessoryProps } from "../../components"
import { useStores } from "../../models"
import { AppStackScreenProps } from "../../navigators"
import { colors, spacing } from "../../theme"
import { useNavigation } from "@react-navigation/native"
import { AuthTitle } from "app/components/AuthTitle"
import { PrivacyPolityButton } from "app/components/PrivacyPolicyButton"
import NetInfo from "@react-native-community/netinfo"
import { SignUpLayout } from "./SignUpLayout"
import * as yup from "yup"
import { errorsText, findError } from "app/utils/validationTexts"

interface SignUpScreenProps extends AppStackScreenProps<"SignUp"> {}

export const SignUpScreen: FC<SignUpScreenProps> = observer(function SignUpScreen(_props) {
  const navigation = useNavigation()

  const fitstNameInput = useRef<TextInput>(null)
  const lastNameInput = useRef<TextInput>(null)
  const userNameInput = useRef<TextInput>(null)
  const emailInput = useRef<TextInput>(null)
  const passwordInput = useRef<TextInput>(null)
  const confirmPasswordInput = useRef<TextInput>(null)
  const { authenticationStore } = useStores()

  const {
    email,
    firstName,
    lastName,
    password,
    username,
    setFirstName,
    setEmail,
    setLastName,
    setPassword,
    setUserName,
    signUp,
    login,
    setFirstVisit,
  } = authenticationStore

  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [confirmPassword, setConfirmPassword] = useState("")
  const [validationError, setValidationError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const validationSchema = yup.object().shape({
    firstName: yup.string().required(errorsText.firstName[0]),
    lastName: yup.string().required(errorsText.lastName[0]),
    username: yup.string().required(errorsText.username[0]),
    email: yup.string().required(errorsText.email[0]).email(errorsText.email[1]),
    password: yup.string().required(errorsText.password[0]),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], errorsText.confirmPassword[0])
      .nullable(),
  })

  const firstNameError = findError("firstName", validationError)
  const lastNameError = findError("lastName", validationError)
  const usernameError = findError("username", validationError)
  const emailError = findError("email", validationError)
  const passwordError = findError("password", validationError)
  const confirmPasswordError = findError("confirmPassword", validationError)

  const signUpError =
    !firstNameError &&
    !lastNameError &&
    !usernameError &&
    !emailError &&
    !passwordError &&
    !confirmPasswordError &&
    validationError

  const onSignUp = async () => {
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
          email,
          firstName,
          lastName,
          password,
          username,
          confirmPassword,
        },
        { abortEarly: false },
      )

      setValidationError("")

      const signUpResponse = await signUp()
      if (!signUpResponse.success) {
        setValidationError(signUpResponse.error)
        throw new Error(signUpResponse.error)
      }
      setFirstVisit(true)
      await login(username, password)

      navigation.navigate("Welcome" as never)
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const message = error.inner[0].message
        setValidationError(message)
      } else {
        console.error("Validation error:", error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const onLoginButton = () => {
    navigation.navigate("Login" as never)
  }

  const PasswordRightAccessory: FC<TextFieldAccessoryProps> = useMemo(() => {
    // eslint-disable-next-line react/display-name
    return ({ style }) => (
      <Icon
        icon={isAuthPasswordHidden ? "hidden" : "view"}
        color={colors.palette.primary}
        containerStyle={style}
        size={20}
        onPress={() => setIsAuthPasswordHidden((prev) => !prev)}
      />
    )
  }, [isAuthPasswordHidden])

  return (
    <Screen
      backgroundColor={colors.palette.primary}
      preset="fixed"
      contentContainerStyle={$contentContainer}
    >
      <AuthTitle title="signUpScreen.welcome" />
      <SignUpLayout>
        <TextField
          ref={fitstNameInput}
          value={firstName}
          onChangeText={(text) => setFirstName(text)}
          containerStyle={$textField}
          autoCapitalize="none"
          autoComplete="additional-name"
          autoCorrect={false}
          keyboardType="email-address"
          labelTx="signUpScreen.first"
          helper={firstNameError}
          status={firstNameError ? "error" : undefined}
          onSubmitEditing={() => lastNameInput.current?.focus()}
        />
        <TextField
          ref={lastNameInput}
          value={lastName}
          onChangeText={(text) => setLastName(text)}
          containerStyle={$textField}
          autoCapitalize="none"
          autoComplete="additional-name"
          autoCorrect={false}
          keyboardType="email-address"
          labelTx="signUpScreen.last"
          helper={lastNameError}
          status={lastNameError ? "error" : undefined}
          onSubmitEditing={() => userNameInput.current?.focus()}
        />
        <TextField
          ref={userNameInput}
          value={username}
          onChangeText={(text) => setUserName(text)}
          containerStyle={$textField}
          autoCapitalize="none"
          autoComplete="additional-name"
          keyboardType="email-address"
          autoCorrect={false}
          labelTx="signUpScreen.userName"
          helper={usernameError}
          status={usernameError ? "error" : undefined}
          onSubmitEditing={() => emailInput.current?.focus()}
        />
        <TextField
          ref={emailInput}
          value={email}
          onChangeText={(text) => setEmail(text)}
          containerStyle={$textField}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          autoCorrect={false}
          labelTx="signUpScreen.email"
          helper={emailError}
          status={emailError ? "error" : undefined}
          onSubmitEditing={() => passwordInput.current?.focus()}
        />
        <TextField
          ref={passwordInput}
          value={password}
          onChangeText={(text) => setPassword(text)}
          containerStyle={$textField}
          autoCapitalize="none"
          autoComplete="password"
          keyboardType="default"
          autoCorrect={false}
          secureTextEntry={isAuthPasswordHidden}
          labelTx="signUpScreen.passwordFieldLabel"
          RightAccessory={PasswordRightAccessory}
          helper={passwordError}
          status={passwordError ? "error" : undefined}
          onSubmitEditing={() => confirmPasswordInput.current?.focus()}
        />
        <TextField
          ref={confirmPasswordInput}
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
          containerStyle={$textField}
          autoCapitalize="none"
          autoComplete="password"
          keyboardType="default"
          autoCorrect={false}
          secureTextEntry={isAuthPasswordHidden}
          labelTx="signUpScreen.passwordConf"
          helper={confirmPasswordError}
          status={confirmPasswordError ? "error" : undefined}
          onSubmitEditing={() => {
            if (!confirmPasswordError) {
              onSignUp()
            }
          }}
          RightAccessory={PasswordRightAccessory}
        />
        <Text style={{ color: colors.error }}>{signUpError}</Text>
      </SignUpLayout>
      <View style={$buttonsContainer}>
        <Button
          preset="reversed"
          testID="signup-button"
          tx="signUpScreen.signUp"
          textStyle={$tapButtonText}
          onPress={onSignUp}
          isLoading={isLoading}
          disabled={isLoading}
        />
        <Button
          testID="login-button"
          tx="loginScreen.login"
          preset="grey"
          textStyle={$tapButtonText}
          onPress={onLoginButton}
        />
      </View>
      <PrivacyPolityButton />
    </Screen>
  )
})

const $contentContainer: ViewStyle = {
  paddingTop: spacing.xxxl,
  flex: 1,
  justifyContent: "flex-start",
  paddingBottom: spacing.lg,
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
