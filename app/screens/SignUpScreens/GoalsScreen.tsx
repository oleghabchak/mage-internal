/* eslint-disable @typescript-eslint/no-unused-vars */
import { observer } from "mobx-react-lite"
import React, { FC, useRef, useState } from "react"
import { TextInput, TextStyle, View, ViewStyle } from "react-native"
import { Screen, TextField } from "app/components"
import { AppStackScreenProps } from "../../navigators"
import { colors, spacing, typography } from "../../theme"
import { SignUpLayout } from "./SignUpLayout"
import { AuthTitle } from "app/components/AuthTitle"
import { SignUpButtons } from "app/components/SignUpButtons"
import Picker from "../../components/Picker"
import LinearProgressBar from "app/components/LinearProgressBar"
import { useNavigation } from "@react-navigation/native"
import { useStores } from "app/models"
import * as yup from "yup"
import { errorsText, findError } from "app/utils/validationTexts"
import { IUserData } from "app/utils/types/UserData"
import userService from "app/services/user/userService"
interface GoalsScreenProps extends AppStackScreenProps<"Goals"> {}

const inputValues = [
  { title: "kg", weight: "kg", height: "cm" },
  { title: "lbs", weight: "lbs", height: "inches" },
]

const goalsValues = [
  { title: "Powerlifting", primaryLift1: "Squat", primaryLift2: "Bench", primaryLift3: "Deadlift" },
  {
    title: "Strongman",
    primaryLift1: "Stone to 1.3m",
    primaryLift2: "Deadlift",
    primaryLift3: "Log press",
  },
  {
    title: "Olympic weightlifting",
    primaryLift1: "Snatch",
    primaryLift2: "Clean and jerk",
    primaryLift3: "Back squat",
  },
  {
    title: "Bodybuilding",
    primaryLift1: "Bench press for 5",
    primaryLift2: "Squa for 5",
    primaryLift3: "Bodyweight",
  },
  { title: "General", primaryLift1: "Squat", primaryLift2: "Bench", primaryLift3: "Deadlift" },
]

export const GoalsScreen: FC<GoalsScreenProps> = observer(function GoalsScreen(_props) {
  const navigation = useNavigation()
  const {
    authenticationStore: {
      sport,
      setGoals,
      updateUser,
      setGeneralNote,
      notes,
      setUserData,
      setAthleteData,
    },
  } = useStores()

  const [weightUnit, setWeightUnit] = useState(inputValues[0]?.weight)
  const [firstGoal, setFirstGoal] = useState("")
  const [secondGoal, setSecondValue] = useState("")
  const [thirdGoal, setThirdValue] = useState("")
  const [note, setNote] = useState(notes)
  const [validationError, setValidationError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const benchInput = useRef<TextInput>(null)
  const deadliftInput = useRef<TextInput>(null)
  const generalInput = useRef<TextInput>(null)

  const validationSchema = yup.object().shape({
    firstGoal: yup.string().required(errorsText.firstGoal[0]),
    secondGoal: yup.string().required(errorsText.secondGoal[0]),
    thirdGoal: yup.string().required(errorsText.thirdGoal[0]),
  })

  const firstGoalError = findError("firstGoal", validationError)
  const secondGoalError = findError("secondGoal", validationError)
  const thirdGoalError = findError("thirdGoal", validationError)
  const currentGoalsValues = goalsValues[sport]

  const validateAndFormatValue = (text: string) => {
    const cleanedText = text.replace(/[^0-9,]/g, "")
    const parts = cleanedText.split(",")
    const formatedText = parts.length > 1 ? `${parts[0]},${parts.slice(1).join("")}` : cleanedText
    return formatedText
  }

  const handleSetFirstGoal = (text: string) => {
    const formatedText = validateAndFormatValue(text)
    setFirstGoal(formatedText)
  }

  const handleSetSecondValue = (text: string) => {
    const formatedText = validateAndFormatValue(text)
    setSecondValue(formatedText)
  }

  const handleSetThirdValue = (text: string) => {
    const formatedText = validateAndFormatValue(text)
    setThirdValue(formatedText)
  }

  const handleWeightChange = (unit: { weight: string }) => {
    setWeightUnit(unit?.weight)
  }

  const handleSetNotes = (value: string) => {
    setNote(value)
  }
  const handleLogin = async () => {
    try {
      setIsLoading(true)
      await validationSchema.validate(
        {
          firstGoal,
          secondGoal,
          thirdGoal,
        },
        { abortEarly: false },
      )

      setValidationError("")
      setGoals(
        `${currentGoalsValues.primaryLift1}: ${firstGoal}, ${currentGoalsValues.primaryLift2}: ${secondGoal}, ${currentGoalsValues.primaryLift3}: ${thirdGoal}`,
      )
      setGeneralNote(note)
      await updateUser()
      const { data }: { data: IUserData } = await userService.getProfile()

      if (data.user && data.athlete) {
        setUserData(data.user)
        setAthleteData(data.athlete)
      }

      navigation.navigate("HomeScreen" as never)
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const message = error.inner[0].message
        setValidationError(message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Screen
        backgroundColor={colors.palette.primary}
        preset="fixed"
        contentContainerStyle={$container}
      >
        <AuthTitle title="goalsScreen.title" />

        <LinearProgressBar progress={1} containerStyle={{ marginTop: spacing.xl }} />
        <SignUpLayout>
          <AuthTitle subtitle="goalsScreen.description" />

          <View style={$inputsContainer}>
            <View style={$rowInputsWrapper}>
              <TextField
                label={currentGoalsValues.primaryLift1}
                LabelTextProps={{
                  style: [$label, firstGoalError ? { color: colors.error } : null],
                }}
                onChangeText={handleSetFirstGoal}
                autoCorrect={false}
                keyboardType="numeric"
                returnKeyType="done"
                status={firstGoalError ? "error" : undefined}
                inputWrapperStyle={$inputWrapper}
                containerStyle={$rowInput}
                onSubmitEditing={() => benchInput.current?.focus()}
              />
              <Picker data={inputValues} onSelect={handleWeightChange} containerStyle={$picker} />
            </View>
            <View style={$rowInputsWrapper}>
              <TextField
                label={currentGoalsValues.primaryLift2}
                LabelTextProps={{
                  style: [$label, secondGoalError ? { color: colors.error } : null],
                }}
                onChangeText={handleSetSecondValue}
                autoCorrect={false}
                keyboardType="numeric"
                returnKeyType="done"
                status={secondGoalError ? "error" : undefined}
                containerStyle={$rowInput}
                onSubmitEditing={() => deadliftInput.current?.focus()}
              />
              <Picker data={inputValues} onSelect={handleWeightChange} containerStyle={$picker} />
            </View>

            <View style={$rowInputsWrapper}>
              <TextField
                label={currentGoalsValues.primaryLift3}
                LabelTextProps={{
                  style: [$label, thirdGoalError ? { color: colors.error } : null],
                }}
                onChangeText={handleSetThirdValue}
                autoCorrect={false}
                keyboardType="numeric"
                returnKeyType="done"
                status={thirdGoalError ? "error" : undefined}
                containerStyle={$rowInput}
                onSubmitEditing={() => generalInput.current?.focus()}
              />
              <Picker data={inputValues} onSelect={handleWeightChange} containerStyle={$picker} />
            </View>

            <TextField
              multiline
              value={note}
              labelTx="goalsScreen.category4"
              scrollEnabled
              LabelTextProps={{
                style: $label,
              }}
              onChangeText={handleSetNotes}
              autoCorrect={false}
              keyboardType="default"
              returnKeyType="done"
            />
          </View>
        </SignUpLayout>
      </Screen>
      <View style={$containerInner}>
        <SignUpButtons isLoading={isLoading} nextDisabled={isLoading} onSubmit={handleLogin} />
      </View>
    </>
  )
})

const $container: ViewStyle = {
  paddingTop: 55,
  flex: 1,
  justifyContent: "space-between",
}
const $containerInner: ViewStyle = {
  backgroundColor: colors.palette.primary,
  justifyContent: "flex-start",
  paddingBottom: spacing.xl,
  paddingHorizontal: spacing.ml,
}

const $inputsContainer: ViewStyle = {
  height: 500,
  marginTop: spacing.xs,
  gap: spacing.lg,
}

const $label: TextStyle = {
  fontSize: 20,
  fontFamily: typography.fonts.manrope.medium,
}

const $rowInputsWrapper: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-end",
  gap: spacing.xs,
}

const $picker: ViewStyle = { flex: 1, height: 50 }
const $rowInput: ViewStyle = { flex: 2 }
const $inputWrapper: ViewStyle = { backgroundColor: "white" }
