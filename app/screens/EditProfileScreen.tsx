import React, { useState } from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { TextField, Button, Text, Screen } from "../components"
import { colors, spacing, typography } from "../theme"
import { AppStackScreenProps } from "app/navigators"
import { useHeader } from "app/utils/useHeader"
import Avatar from "app/components/Avatar"
import { useStores } from "app/models"
import { useNavigation, useTheme } from "@react-navigation/native"
import * as yup from "yup"
import * as FileSystem from "expo-file-system"
import { errorsText, findError } from "app/utils/validationTexts"
import { IUserData } from "app/utils/types/UserData"
import userService from "app/services/user/userService"
import { ColorsInterface } from "app/theme/colorsInterface"

interface EditProfileScreenProps extends AppStackScreenProps<"EditProfile"> {}

export const EditProfileScreen: React.FC<EditProfileScreenProps> = observer(
  function EditProfileScreen() {
    const {
      authenticationStore: {
        userId,
        photo,
        email,
        firstName,
        lastName,
        username,
        setPhoto,
        setFirstName,
        setLastName,
        setEmail,
        updateUser,
        setUserData,
        setAthleteData,
      },
    } = useStores()

    const [formPhoto, setFormPhoto] = useState(photo)
    const [formEmail, setFormEmail] = useState(email)
    const [formFirstName, setFormFirstName] = useState(firstName)
    const [formLastName, setFormLastName] = useState(lastName)
    const [isLoading, setIsLoading] = useState(false)
    const [validationError, setValidationError] = useState<string>("")
    const { colors: themeColors } = useTheme() as ColorsInterface
    const schema = yup.object().shape({
      email: yup.string().required(errorsText.email[0]).email(errorsText.email[1]),
      firstName: yup.string().required(errorsText.firstName[0]),
      lastName: yup.string().required(errorsText.lastName[0]),
    })

    const emailError = findError("email", validationError)
    const firstNameError = findError("firstName", validationError)
    const lastNameError = findError("lastName", validationError)

    useHeader(
      {
        title: "Edit Profile",
        titleContainerStyle: {
          alignItems: "center",
          justifyContent: "flex-start",
          height: "70%",
        },
        titleStyle: {
          fontSize: spacing.lg,
          color: themeColors.text,
        },
        hideRightIcon: true,
        backgroundColor: themeColors.background,
      },
      [],
    )

    const handleInputChange =
      (setter: React.Dispatch<React.SetStateAction<string>>) => (value: string) => {
        const formattedValue = value.replace(/[ ,]/g, "")
        setter(formattedValue)
      }

    const handleRefreshData = async () => {
      const { data }: { data: IUserData } = await userService.getProfile()

      if (data.user && data.athlete) {
        setUserData(data.user)
        setAthleteData(data.athlete)
      }
    }

    const onSubmit = async () => {
      try {
        setIsLoading(true)
        await schema.validate(
          {
            email: formEmail,
            firstName: formFirstName,
            lastName: formLastName,
          },
          { abortEarly: false },
        )

        setValidationError("")

        const fileUri = `${FileSystem.documentDirectory}profilePhoto${userId}.jpg`

        await FileSystem.copyAsync({
          from: formPhoto,
          to: fileUri,
        })

        setPhoto(fileUri)
        setFirstName(formFirstName)
        setLastName(formLastName)
        setEmail(formEmail)
        await updateUser()
        handleRefreshData()

        goBack()
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

    const navigation = useNavigation()

    const goBack = () => {
      navigation.canGoBack() ? navigation.goBack() : navigation.navigate("Settings" as never)
    }

    const onChangePassword = () => {
      navigation.navigate("ChangePassword" as never)
    }

    return (
      <Screen preset="scroll" statusBarStyle="dark" backgroundColor={themeColors.background}>
        <View style={$formWrapper}>
          <View style={$avatarContainer}>
            <Avatar image={formPhoto} setImage={setFormPhoto} />
          </View>

          {["First Name", "Last Name", "Username", "Email"].map((label) => (
            <TextField
              editable={label !== "Username"}
              key={label}
              style={{ color: themeColors.text }}
              label={label}
              value={
                label === "First Name"
                  ? formFirstName
                  : label === "Last Name"
                  ? formLastName
                  : label === "Username"
                  ? username
                  : formEmail
              }
              onChangeText={handleInputChange(
                label === "First Name"
                  ? setFormFirstName
                  : label === "Last Name"
                  ? setFormLastName
                  : label === "Username"
                  ? () => console.info("Username")
                  : setFormEmail,
              )}
              placeholder={`Enter ${label}`}
              inputWrapperStyle={
                label === "First Name"
                  ? [$fieldInputWrapper, !!firstNameError && { borderColor: colors.error }]
                  : label === "Last Name"
                  ? [$fieldInputWrapper, !!lastNameError && { borderColor: colors.error }]
                  : label === "Username"
                  ? $fieldInputWrapper
                  : [$fieldInputWrapper, !!emailError && { borderColor: colors.error }]
              }
              inputTextStyle={{ color: themeColors.text }}
              helper={
                label === "First Name"
                  ? firstNameError
                  : label === "Last Name"
                  ? lastNameError
                  : label === "Username"
                  ? ""
                  : emailError
              }
              status={
                label === "First Name"
                  ? firstNameError
                    ? "error"
                    : undefined
                  : label === "Last Name"
                  ? lastNameError
                    ? "error"
                    : undefined
                  : label === "Username"
                  ? undefined
                  : emailError
                  ? "error"
                  : undefined
              }
              LabelTextProps={{
                preset: "bold",
                style: [$inputLabel, { color: themeColors.text }],
              }}
              keyboardType={label === "Email" ? "email-address" : undefined}
            />
          ))}

          <View style={$changePasswordConteiner}>
            <Text style={[$changePasswordTitle, { color: themeColors.text }]}>Password</Text>
            <View style={$shadow}>
              <Button
                preset="grey"
                text="Change password"
                onPress={onChangePassword}
                style={{ backgroundColor: themeColors.grey }}
                textStyle={{ color: themeColors.primary }}
              />
            </View>
          </View>
        </View>

        <Button
          style={[$save, { backgroundColor: themeColors.primary, borderColor: themeColors.border }]}
          textStyle={{ color: themeColors.alternativeText }}
          text="Save changes"
          onPress={onSubmit}
          disabled={isLoading}
          isLoading={isLoading}
        />
      </Screen>
    )
  },
)

const $shadow: ViewStyle = {
  shadowColor: colors.palette.black,
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.17,
  shadowRadius: 2.05,
}

const $inputLabel: TextStyle = {
  color: "black",
  fontSize: 16,
  fontFamily: typography.fonts.manrope.bold,
  marginBottom: spacing.xs,
}

const $save: ViewStyle = {
  marginTop: spacing.md,
  marginHorizontal: "15%",
}

const $avatarContainer: ViewStyle = {
  width: "100%",
  display: "flex",
  alignItems: "center",
}

const $formWrapper: ViewStyle = {
  gap: spacing.xxxs,
  marginVertical: spacing.xxs,
}

const $fieldInputWrapper: ViewStyle = {
  backgroundColor: "transparent",
  borderColor: colors.palette.grey2,
}

const $changePasswordConteiner: ViewStyle = {
  gap: spacing.md,
}

const $changePasswordTitle: TextStyle = {
  fontSize: 16,
  fontFamily: typography.fonts.manrope.bold,
}
