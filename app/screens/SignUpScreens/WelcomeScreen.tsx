import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useState } from "react"
import { View, ViewStyle } from "react-native"
import { TextField } from "app/components"
import { AppStackScreenProps } from "../../navigators"
import { colors, spacing } from "../../theme"
import Picker from "../../components/Picker"
import { SignUpLayout } from "./SignUpLayout"
import { AuthTitle } from "app/components/AuthTitle"
import { SignUpButtons } from "app/components/SignUpButtons"
import LinearProgressBar from "app/components/LinearProgressBar"
import { useStores } from "app/models"
import { genderData } from "app/utils/types/PickersData"

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

const heightInputValues = [{ title: "cm" }, { title: "inches" }]
const widthInputValues = [{ title: "kg" }, { title: "lbs" }]

export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen(_props) {
  const { navigation } = _props
  const {
    authenticationStore: {
      dob,
      height,
      weight,
      gender,
      setDob,
      setHeight,
      setWeight,
      setGender,
      fetchEquipmentsList,
      fetchSportsList,
      updateUser,
    },
  } = useStores()
  const [isLoading, setIsLoading] = useState(false)

  const [weightUnit, setWeightUnit] = useState(widthInputValues[0])
  const [heightUnit, setHeightUnit] = useState(heightInputValues[0])

  const handleWeightChange = (unit: { title: string }) => {
    setWeightUnit(unit)
  }

  const handleHeightChange = (unit: { title: string }) => {
    setHeightUnit(unit)
  }

  const day = dob.split("-")[2] || ""
  const month = dob.split("-")[1] || ""
  const year = dob.split("-")[0] || ""

  const setDay = (value: string) => {
    let checkedDay = value

    if (value === "0") checkedDay = ""
    if (+value > 31) checkedDay = "31"

    let resultDate = ""
    if (!dob) {
      resultDate = ["", "", checkedDay].join("-")
    } else {
      resultDate = dob
        .split("-")
        .map((item, id) => (id === 2 ? (item = checkedDay) : item))
        .join("-")
    }
    setDob(resultDate)
  }
  const setMonth = (value: string) => {
    let checkedMonth = value

    if (value === "0") checkedMonth = ""
    if (+value > 12) checkedMonth = "12"

    let resultDate = ""
    if (!dob) {
      resultDate = ["", checkedMonth, ""].join("-")
    } else {
      resultDate = dob
        .split("-")
        .map((item, id) => (id === 1 ? (item = checkedMonth) : item))
        .join("-")
    }
    setDob(resultDate)
  }

  const setYear = (value: string) => {
    let checkedYear = value

    if (value === "0") checkedYear = ""
    if (+value > 2024) checkedYear = "2024"

    let resultDate = ""
    if (!dob) {
      resultDate = ["", "", checkedYear].join("-")
    } else {
      resultDate = dob
        .split("-")
        .map((item, id) => (id === 0 ? (item = checkedYear) : item))
        .join("-")
    }
    setDob(resultDate)
  }

  const handleGenderChange = (value: any) => {
    if (value.option) setGender(value.option)
  }

  const nextButtonDisabled = !(day && month && year && height && weight && gender)

  const handleSubmitBasic = async () => {
    try {
      setIsLoading(true)
      await updateUser()
      navigation.navigate("Measurements")
    } catch (error) {
      console.error(handleSubmitBasic, "Submit error")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const defauldGender = genderData.find((genderValue) => genderValue.option === gender)

  useEffect(() => {
    fetchEquipmentsList()
    fetchSportsList()
  }, [])

  useEffect(() => {
    if (!+height) setHeight("")
    if (!+weight) setWeight("")
  }, [])

  return (
    <View style={$container}>
      <AuthTitle title="welcomeScreen.title" />
      <LinearProgressBar progress={0.2} containerStyle={{ marginTop: spacing.xl }} />
      <SignUpLayout>
        <AuthTitle subtitle="welcomeScreen.titleDescription" />
        <View style={$mainInputsWrapper}>
          <View style={$birthDateContainer}>
            <TextField
              value={day}
              onChangeText={setDay}
              autoCapitalize="none"
              autoComplete="birthdate-day"
              autoCorrect={false}
              keyboardType="numeric"
              labelTx="welcomeScreen.dateOfBirth"
              placeholderTx="signUpScreen.day"
              preset="default"
              inputWrapperStyle={$inputWrapper}
              containerStyle={$birthDateInput}
              status={!day ? "error" : undefined}
              returnKeyType="done"
            />
            <TextField
              value={month}
              onChangeText={setMonth}
              autoCapitalize="none"
              autoComplete="birthdate-day"
              autoCorrect={false}
              keyboardType="numeric"
              placeholderTx="signUpScreen.month"
              preset="default"
              inputWrapperStyle={$inputWrapper}
              containerStyle={$birthDateInput}
              status={!month ? "error" : undefined}
              returnKeyType="done"
            />
            <TextField
              value={year}
              onChangeText={setYear}
              autoCapitalize="none"
              autoComplete="birthdate-day"
              autoCorrect={false}
              keyboardType="numeric"
              placeholderTx="signUpScreen.year"
              preset="default"
              inputWrapperStyle={$inputWrapper}
              containerStyle={$birthDateInput}
              status={!year ? "error" : undefined}
              returnKeyType="done"
            />
          </View>
          <View style={$rowInputsWrapper}>
            <TextField
              value={height.toString()}
              onChangeText={setHeight}
              autoCapitalize="none"
              autoComplete="birthdate-day"
              autoCorrect={false}
              keyboardType="numeric"
              labelTx="welcomeScreen.height"
              returnKeyType="done"
              placeholderString={heightUnit.title}
              preset="default"
              inputWrapperStyle={$inputWrapper}
              containerStyle={$rowInput}
              status={!height ? "error" : undefined}
            />
            <Picker
              data={heightInputValues}
              onSelect={handleHeightChange}
              containerStyle={$picker}
            />
          </View>
          <View style={$rowInputsWrapper}>
            <TextField
              value={weight.toString()}
              onChangeText={setWeight}
              autoCapitalize="none"
              autoComplete="birthdate-day"
              autoCorrect={false}
              keyboardType="numeric"
              labelTx="welcomeScreen.weight"
              placeholderString={weightUnit.title}
              preset="default"
              inputWrapperStyle={$inputWrapper}
              containerStyle={$rowInput}
              status={!weight ? "error" : undefined}
              returnKeyType="done"
            />
            <Picker
              data={widthInputValues}
              onSelect={handleWeightChange}
              containerStyle={$picker}
            />
          </View>
          <View style={$genderSectionContainer}>
            <Picker
              data={genderData}
              defaultValue={defauldGender}
              onSelect={handleGenderChange}
              subtitle="welcomeScreen.gender"
              sliceSelector={1}
            />
          </View>
        </View>
      </SignUpLayout>
      <SignUpButtons
        nextDisabled={nextButtonDisabled || isLoading}
        onSubmit={handleSubmitBasic}
        isLoading={isLoading}
      />
    </View>
  )
})

const $picker: ViewStyle = { flex: 1, height: 50 }

const $container: ViewStyle = {
  paddingTop: spacing.xxxl,
  paddingBottom: spacing.xl,
  paddingHorizontal: spacing.lg,
  justifyContent: "space-around",
  flex: 1,
  backgroundColor: colors.palette.primary,
}

const $mainInputsWrapper: ViewStyle = { gap: spacing.md }

const $birthDateContainer: ViewStyle = {
  flexDirection: "row",
  gap: spacing.xs,
  alignItems: "flex-end",
}

const $birthDateInput: ViewStyle = { flex: 1 }

const $rowInputsWrapper: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-end",
  gap: spacing.xs,
}

const $rowInput: ViewStyle = { flex: 2 }

const $inputWrapper: ViewStyle = { backgroundColor: "white" }

const $genderSectionContainer: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  marginBottom: spacing.md,
  gap: 32,
}
