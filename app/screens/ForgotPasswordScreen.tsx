/* eslint-disable react/display-name */
import { AuthTitle } from "app/components/AuthTitle"
import { colors, spacing, typography } from "app/theme"
import React, { useMemo, useState } from "react"
import { Dimensions, TextStyle, View, ViewStyle } from "react-native"
import { PrivacyPolityButton } from "app/components/PrivacyPolicyButton"
import { Button, Icon, Screen, Text, TextField, TextFieldAccessoryProps } from "app/components"
import { observer } from "mobx-react-lite"
import { useStores } from "app/models"
import { OtpInput } from "react-native-otp-entry"
import { useNavigation } from "@react-navigation/native"
import * as yup from "yup"
import { errorsText, findError } from "app/utils/validationTexts"

interface ForgotPasswordScreenProps {}

const { height: screenHeight } = Dimensions.get("window")

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = observer(
  function ForgotPasswordScreen() {
    const {
      authenticationStore: {
        username,
        setUserName,
        resetPassword,
        setOTPcode,
        password,
        setPassword,
        setNewPassword,
      },
    } = useStores()
    const [codeSent, setCodeSent] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState("")
    const [OTPError, setOTPError] = useState("")
    const [isPasswordHidden, setIsPasswordHidden] = useState(true)
    const navigation = useNavigation()
    const [validationError, setValidationError] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false)

    const usernameValidationSchema = yup.object().shape({
      username: yup.string().required(errorsText.usernameForRecovery[0]),
    })

    const passwordValidationSchema = yup.object().shape({
      password: yup
        .string()
        .required(errorsText.newPassword[0])
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, errorsText.newPassword[1]),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], errorsText.confirmPassword[0])
        .nullable(),
    })

    const usernameForRecoveryError = findError("usernameForRecovery", validationError)
    const newPasswordError = findError("newPassword", validationError)
    const confirmPasswordError = findError("confirmPassword", validationError)

    const handleSendCode = async () => {
      try {
        setIsLoading(true)
        await usernameValidationSchema.validate(
          {
            username,
          },
          { abortEarly: false },
        )

        setValidationError("")

        const response = await resetPassword()
        if (response.success) {
          setCodeSent(true)
        } else {
          const message = response.error
          setValidationError(message)
        }
      } catch (error) {
        if (error instanceof yup.ValidationError) {
          const message = error.inner[0].message
          setValidationError(message)
        }
      } finally {
        setIsLoading(false)
      }
    }

    const handleRecetCode = async () => {
      try {
        setIsLoading(true)
        await passwordValidationSchema.validate(
          {
            password,
            confirmPassword,
          },
          { abortEarly: false },
        )

        setValidationError("")

        const response = await setNewPassword()
        if (response.success) {
          setPassword("")
          navigation.navigate("Login" as never)
        } else {
          setOTPError(response.error)
        }
      } catch (error) {
        if (error instanceof yup.ValidationError) {
          const message = error.inner[0].message
          setValidationError(message)
        }
      } finally {
        setIsLoading(false)
      }
    }

    const handleChangeOTPCode = (text: string) => {
      if (OTPError && text) {
        setOTPError("")
      } else if (!text) {
        setOTPError("Required")
      }
      setOTPcode(text)
    }

    const PasswordRightAccessory: React.FC<TextFieldAccessoryProps> = useMemo(() => {
      return ({ style }) => (
        <Icon
          icon={isPasswordHidden ? "hidden" : "view"}
          color={colors.palette.primary}
          containerStyle={style}
          size={20}
          onPress={() => setIsPasswordHidden((prev) => !prev)}
        />
      )
    }, [isPasswordHidden])

    return (
      <Screen
        preset="fixed"
        backgroundColor={colors.palette.primary}
        contentContainerStyle={$contentContainer}
      >
        <View style={$inputsContainer}>
          <AuthTitle
            title="forgotPasswordScreen.title"
            subtitle={
              codeSent ? "forgotPasswordScreen.description2" : "forgotPasswordScreen.description1"
            }
            subtitleStyle={$subtitle}
          />
          <TextField
            editable={!codeSent}
            value={username}
            onChangeText={setUserName}
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            keyboardType="email-address"
            labelTx="forgotPasswordScreen.fieldPlaceholder.username"
            helper={usernameForRecoveryError}
            status={usernameForRecoveryError ? "error" : undefined}
          />
          {codeSent && (
            <>
              <View>
                <Text
                  testID="login-heading"
                  tx={"forgotPasswordScreen.fieldPlaceholder.code"}
                  preset="subheading"
                  style={$codeTitle}
                />
                <OtpInput
                  numberOfDigits={6}
                  hideStick
                  onTextChange={handleChangeOTPCode}
                  theme={{
                    pinCodeContainerStyle: {
                      backgroundColor: colors.palette.white,
                      width: 40,
                      height: 50,
                      borderRadius: spacing.xs,
                    },
                  }}
                  autoFocus={false}
                />
                {OTPError && <Text preset="formHelper" text={OTPError} style={$helperStyle} />}
              </View>
              <TextField
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="default"
                RightAccessory={PasswordRightAccessory}
                secureTextEntry={isPasswordHidden}
                labelTx="forgotPasswordScreen.fieldPlaceholder.newPassword"
                helper={newPasswordError}
                status={newPasswordError ? "error" : undefined}
              />
              <TextField
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="default"
                RightAccessory={PasswordRightAccessory}
                secureTextEntry={isPasswordHidden}
                labelTx="forgotPasswordScreen.fieldPlaceholder.confirmPassford"
                helper={confirmPasswordError}
                status={confirmPasswordError ? "error" : undefined}
              />
            </>
          )}
          {codeSent ? (
            <Button
              tx={"forgotPasswordScreen.buttons.resetPassword"}
              preset="reversed"
              onPress={handleRecetCode}
              textStyle={$tapButtonText}
              style={$tapButton}
              isLoading={isLoading}
              disabled={isLoading}
            />
          ) : (
            <Button
              tx={"forgotPasswordScreen.buttons.send"}
              preset="reversed"
              onPress={handleSendCode}
              textStyle={$tapButtonText}
              style={$tapButton}
              isLoading={isLoading}
              disabled={isLoading}
            />
          )}
        </View>
        <PrivacyPolityButton />
      </Screen>
    )
  },
)

const $contentContainer: ViewStyle = {
  paddingTop: spacing.xxxl,
  flex: 1,
  height: screenHeight,
  justifyContent: "space-between",
  backgroundColor: colors.palette.primary,
}

const $inputsContainer: ViewStyle = {
  gap: 20,
}

const $tapButtonText: TextStyle = {
  color: colors.palette.primary,
}

const $tapButton: ViewStyle = {
  marginTop: spacing.md,
}

const $codeTitle: TextStyle = {
  color: colors.palette.white,
  lineHeight: 25,
  fontSize: 12,
}

const $subtitle: TextStyle = {
  fontSize: 16,
  fontFamily: typography.fonts.manrope.medium,
}

const $helperStyle: TextStyle = {
  fontSize: 12,
  marginBottom: -spacing.xs,
  color: colors.error,
  // marginTop: spacing.xs,
}
