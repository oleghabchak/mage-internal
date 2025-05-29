import { observer } from "mobx-react-lite"
import React, { FC, useState } from "react"
import { View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "../../navigators"
import { colors, spacing } from "../../theme"
import Picker from "../../components/Picker"
import { SignUpLayout } from "./SignUpLayout"
import { AuthTitle } from "app/components/AuthTitle"
import { SignUpButtons } from "app/components/SignUpButtons"
import LinearProgressBar from "app/components/LinearProgressBar"
import { useStores } from "app/models"
import { activityData, dietData, experienceData, sleepData } from "app/utils/types/PickersData"
import * as yup from "yup"
import { errorsText, findError } from "app/utils/validationTexts"

interface MeasurementsScreenProps extends AppStackScreenProps<"Measurements"> {}

export const MeasurementsScreen: FC<MeasurementsScreenProps> = observer(function MeasurementsScreen(
  _props,
) {
  const [validationError, setValidationError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { navigation } = _props
  const {
    authenticationStore: {
      experience,
      setExperience,
      diet,
      setDiet,
      sleep,
      setSleep,
      activity,
      setActivity,
      updateUser,
    },
  } = useStores()

  const experienceError = findError("experience", validationError)
  const dietError = findError("diet", validationError)
  const sleepError = findError("sleep", validationError)
  const activityError = findError("activity", validationError)

  const validationSchema = yup.object().shape({
    experience: yup.number().notOneOf([0], errorsText.experience[0]),
    diet: yup.number().notOneOf([0], errorsText.diet[0]),
    sleep: yup.number().notOneOf([0], errorsText.sleep[0]),
    activity: yup.number().notOneOf([0], errorsText.activity[0]),
  })

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      await validationSchema.validate(
        {
          experience,
          diet,
          sleep,
          activity,
        },
        { abortEarly: false },
      )

      setValidationError("")
      await updateUser()
      navigation.navigate("LifeContinued")
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

  return (
    <View style={$container}>
      <AuthTitle title="measurementsScreen.title" />
      <LinearProgressBar progress={0.4} containerStyle={{ marginTop: spacing.xl }} />
      <SignUpLayout>
        <View style={$pickersContainer}>
          <Picker
            data={experienceData}
            defaultValue={experienceData[+experience]}
            onSelect={(value) => setExperience(value.id)}
            title="measurementsScreen.subtitle1"
            subtitle="measurementsScreen.question1"
            sliceSelector={1}
            status={experienceError ? "error" : undefined}
          />

          <Picker
            data={dietData}
            defaultValue={dietData[+diet]}
            onSelect={(value) => setDiet(value.id)}
            title="measurementsScreen.subtitle2"
            subtitle="measurementsScreen.question2"
            sliceSelector={1}
            status={dietError ? "error" : undefined}
          />

          <Picker
            data={sleepData}
            defaultValue={sleepData[+sleep]}
            onSelect={(value) => setSleep(value.id)}
            title="measurementsScreen.subtitle3"
            subtitle="measurementsScreen.question3"
            sliceSelector={1}
            status={sleepError ? "error" : undefined}
          />

          <Picker
            data={activityData}
            defaultValue={activityData[+activity]}
            onSelect={(value) => setActivity(value.id)}
            title="measurementsScreen.subtitle4"
            subtitle="measurementsScreen.question4"
            sliceSelector={1}
            status={activityError ? "error" : undefined}
          />
        </View>
      </SignUpLayout>
      <SignUpButtons onSubmit={handleSubmit} nextDisabled={isLoading} isLoading={isLoading} />
    </View>
  )
})

const $container: ViewStyle = {
  paddingTop: spacing.xxxl,
  paddingBottom: spacing.xl,
  paddingHorizontal: spacing.lg,
  justifyContent: "space-around",
  flex: 1,
  backgroundColor: colors.palette.primary,
}

const $pickersContainer: ViewStyle = {
  gap: spacing.md,
}
