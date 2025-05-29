/* eslint-disable react/display-name */
import { useNavigation, useTheme } from "@react-navigation/native"
import { Button, Icon, Screen, Text, TextField, TextFieldAccessoryProps } from "app/components"
import { useStores } from "app/models"
import { colors, spacing, typography } from "app/theme"
import { useHeader } from "app/utils/useHeader"
import React, { useMemo, useRef, useState } from "react"
import { TextInput, TextStyle, View, ViewStyle } from "react-native"
import * as yup from "yup"
import * as SecureStore from "expo-secure-store"
import { errorsText, findError } from "app/utils/validationTexts"
import { ColorsInterface } from "app/theme/colorsInterface"

interface ChangePasswordScreenProps {}

export const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = () => {
  const {
    authenticationStore: { changePassword },
  } = useStores()
  const oldPasswordInput = useRef<TextInput>(null)
  const newPasswordInput = useRef<TextInput>(null)
  const checkedPasswordInput = useRef<TextInput>(null)

  const { colors: themeColors } = useTheme() as ColorsInterface
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [checkedPassword, setCheckedPassword] = useState("")
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [validationError, setValidationError] = useState<string>("")

  const navigator = useNavigation()

  useHeader(
    {
      title: "Change password",
      titleContainerStyle: {
        alignItems: "center",
        justifyContent: "flex-start",
        height: "70%",
      },
      titleStyle: {
        fontSize: spacing.lg,
        color: themeColors.text,
      },
      backgroundColor: themeColors.background,
      hideRightIcon: true,
    },
    [colors],
  )

  const validationSchema = yup.object().shape({
    oldPassword: yup.string().required(errorsText.oldPassword[0]),
    newPassword: yup
      .string()
      .required(errorsText.newPassword[0])
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, errorsText.newPassword[1]),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword")], errorsText.confirmPassword[0])
      .nullable(),
  })

  const oldPasswordError = findError("oldPassword", validationError)
  const newPasswordError = findError("newPassword", validationError)
  const setNewPasswordError = findError("confirmPassword", validationError)
  const changePasswordError = findError("changePassword", validationError)

  const handleSaveChanges = async () => {
    try {
      await validationSchema.validate(
        {
          oldPassword,
          newPassword,
          checkedPassword,
        },
        { abortEarly: false },
      )

      setValidationError("")

      const storedPassword = await SecureStore.getItem("password")
      if (oldPassword !== storedPassword) {
        setValidationError(errorsText.oldPassword[1])
        return
      }

      const requestStatus = await changePassword(newPassword)
      if (requestStatus) {
        navigator.goBack()
      } else {
        setValidationError(errorsText.changePassword[0])
      }
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const message = error.inner[0].message
        setValidationError(message)
      } else {
        console.error("Validation error:", error)
      }
    }
  }

  const PasswordRightAccessory: React.FC<TextFieldAccessoryProps> = useMemo(() => {
    return ({ style }) => (
      <Icon
        icon={isAuthPasswordHidden ? "hidden" : "view"}
        color={themeColors.primary}
        containerStyle={style}
        size={20}
        onPress={() => setIsAuthPasswordHidden((prev) => !prev)}
      />
    )
  }, [isAuthPasswordHidden])

  return (
    <Screen preset="scroll" statusBarStyle="dark">
      <View style={$formWrapper}>
        <TextField
          ref={oldPasswordInput}
          value={oldPassword}
          label={"Current password"}
          onChangeText={setOldPassword}
          containerStyle={$textField}
          autoCapitalize="none"
          autoComplete="password"
          keyboardType="default"
          autoCorrect={false}
          inputTextStyle={{ color: themeColors.text }}
          secureTextEntry={isAuthPasswordHidden}
          RightAccessory={PasswordRightAccessory}
          onSubmitEditing={() => newPasswordInput.current?.focus()}
          inputWrapperStyle={[
            $fieldInputWrapper,
            !!oldPasswordError && { borderColor: colors.error },
          ]}
          placeholderTextColor={$placeholderTextColor}
          helper={oldPasswordError}
          status={oldPasswordError ? "error" : undefined}
          LabelTextProps={{
            preset: "bold",
            style: [$inputLabel, { color: themeColors.text }],
          }}
        />
        <TextField
          ref={newPasswordInput}
          value={newPassword}
          label="New password"
          onChangeText={setNewPassword}
          containerStyle={$textField}
          autoCapitalize="none"
          autoComplete="password"
          keyboardType="default"
          autoCorrect={false}
          secureTextEntry={isAuthPasswordHidden}
          RightAccessory={PasswordRightAccessory}
          onSubmitEditing={() => checkedPasswordInput.current?.focus()}
          inputWrapperStyle={[
            $fieldInputWrapper,
            !!newPasswordError && { borderColor: colors.error },
          ]}
          inputTextStyle={{ color: themeColors.text }}
          placeholderTextColor={$placeholderTextColor}
          helper={newPasswordError}
          status={"error"}
          LabelTextProps={{
            preset: "bold",
            style: [$inputLabel, { color: themeColors.text }],
          }}
        />
        <TextField
          ref={checkedPasswordInput}
          value={checkedPassword}
          label="Confirm new password"
          onChangeText={setCheckedPassword}
          containerStyle={$textField}
          autoCapitalize="none"
          autoComplete="password"
          keyboardType="default"
          inputTextStyle={{ color: themeColors.text }}
          autoCorrect={false}
          secureTextEntry={isAuthPasswordHidden}
          RightAccessory={PasswordRightAccessory}
          inputWrapperStyle={[
            $fieldInputWrapper,
            !!setNewPasswordError && { borderColor: colors.error },
          ]}
          placeholderTextColor={$placeholderTextColor}
          helper={setNewPasswordError}
          status={"error"}
          LabelTextProps={{
            preset: "bold",
            style: [$inputLabel, { color: themeColors.text }],
          }}
        />
      </View>

      <Text style={{ color: colors.error }}>{changePasswordError}</Text>

      <Button
        style={[$save, { backgroundColor: themeColors.primary }]}
        textStyle={{ color: themeColors.alternativeText }}
        text="Save changes"
        onPress={handleSaveChanges}
      />
    </Screen>
  )
}

const $save: ViewStyle = {
  marginTop: spacing.lg,
  marginHorizontal: "15%",
}

const $formWrapper: ViewStyle = {
  gap: spacing.xxxs,
  marginVertical: spacing.xxs,
}

const $textField: ViewStyle = {
  marginBottom: spacing.xs,
}

const $inputLabel: TextStyle = {
  color: colors.palette.black,
  fontSize: 16,
  fontFamily: typography.fonts.manrope.bold,
  marginBottom: spacing.xs,
}

const $fieldInputWrapper: ViewStyle = {
  backgroundColor: "transparent",
  borderColor: colors.palette.grey2,
}

const $placeholderTextColor = colors.palette.grey2
