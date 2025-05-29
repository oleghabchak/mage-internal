import { useNavigation, useTheme } from "@react-navigation/native"
import { Button, Screen, TextField } from "app/components"
import { useStores } from "app/models"
import { colors, spacing, typography } from "app/theme"
import { ColorsInterface } from "app/theme/colorsInterface"
import { useHeader } from "app/utils/useHeader"
import { errorsText, findError } from "app/utils/validationTexts"
import React, { useRef, useState } from "react"
import { TextInput, TextStyle, ViewStyle } from "react-native"
import * as yup from "yup"

interface ReportProblemScreenProps {}

export const ReportProblemScreen: React.FC<ReportProblemScreenProps> = () => {
  const {
    authenticationStore: { reportProblem },
  } = useStores()
  const problemInput = useRef<TextInput>(null)
  const moreDetailInput = useRef<TextInput>(null)
  const [problem, setProblem] = useState("")
  const [moreDetail, setMoreDetail] = useState("")
  const navigation = useNavigation()
  const [validationError, setValidationError] = useState<string>("")
  const [isLoading, setLoading] = useState(false)

  const schema = yup.object().shape({
    problem: yup.string().required(errorsText.problem[0]),
    moreDetail: yup.string().required(errorsText.moreDetail[0]),
  })

  const { colors: themeColors } = useTheme() as ColorsInterface
  const problemError = findError("problem", validationError)
  const moreDetailError = findError("moreDetail", validationError)

  useHeader(
    {
      title: "Report problem",
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
    [],
  )

  const handleSendReport = async () => {
    try {
      setLoading(true)
      await schema.validate(
        {
          problem,
          moreDetail,
        },
        { abortEarly: false },
      )

      setValidationError("")

      await reportProblem(problem, moreDetail)
      navigation.navigate("Settings" as never)
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const message = error.inner[0].message
        setValidationError(message)
      } else {
        console.error("Validation error:", error)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Screen style={$root} preset="scroll">
      <TextField
        ref={problemInput}
        value={problem}
        onChangeText={setProblem}
        autoCapitalize="none"
        autoCorrect={false}
        inputTextStyle={{ color: themeColors.text }}
        labelTx="reportProblemsScreen.inputs.problem"
        onSubmitEditing={() => moreDetailInput.current?.focus()}
        LabelTextProps={{
          preset: "bold",
          style: [$inputLabel, { color: themeColors.text }],
        }}
        helper={problemError}
        status={problemError ? "error" : undefined}
        inputWrapperStyle={[$fieldInputWrapper, !!problemError && { borderColor: colors.error }]}
      />
      <TextField
        ref={moreDetailInput}
        value={moreDetail}
        onChangeText={setMoreDetail}
        autoCapitalize="none"
        autoCorrect={false}
        labelTx="reportProblemsScreen.inputs.detail"
        multiline
        LabelTextProps={{
          preset: "bold",
          style: [$inputLabel, { color: themeColors.text }],
        }}
        helper={moreDetailError}
        status={moreDetailError ? "error" : undefined}
        inputTextStyle={{ color: themeColors.text }}
        inputWrapperStyle={[
          $fieldInputWrapper,
          $bigInput,
          !!moreDetailError && { borderColor: colors.error },
        ]}
      />
      <Button
        style={[$save, { backgroundColor: themeColors.primary, borderColor: "transparent" }]}
        textStyle={{ color: themeColors.alternativeText }}
        tx="reportProblemsScreen.buttons.send"
        onPress={handleSendReport}
        disabled={isLoading}
        isLoading={isLoading}
      />
    </Screen>
  )
}

const $root: ViewStyle = {
  flex: 1,
}

const $fieldInputWrapper: ViewStyle = {
  backgroundColor: "transparent",
  borderColor: colors.palette.grey2,
}

const $bigInput: ViewStyle = {
  height: 300,
}

const $inputLabel: TextStyle = {
  color: colors.palette.black,
  fontSize: 16,
  fontFamily: typography.fonts.manrope.bold,
  marginBottom: spacing.xs,
}

const $save: ViewStyle = {
  marginTop: 100,
  marginHorizontal: "15%",
}
