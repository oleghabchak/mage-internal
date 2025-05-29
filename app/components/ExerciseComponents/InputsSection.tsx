import { useTheme } from "@react-navigation/native"
import { TextField } from "app/components"
import { useStores } from "app/models"
import { IExercise } from "app/models/ProgramStore"
import { colors, spacing, typography } from "app/theme"
import { ColorsInterface } from "app/theme/colorsInterface"
import { ExerciseWgtFieldsEnum } from "app/utils/enums/exerciseWgtFields"
import { calculateRepsRange, calculateWeightRange, intensityToRPE } from "app/utils/functions"
import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import {
  ColorValue,
  LayoutAnimation,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"

interface InputsSectionProps {
  workoutId: number
  exercise: IExercise
  index: number
}

export const InputsSection: React.FC<InputsSectionProps> = observer(function InputsSection({
  workoutId,
  exercise,
  index,
}) {
  const {
    programStore: { setSets, setReps, setWeight, getPreviousActual, currentCycleOpened },
  } = useStores()

  const { planned, actual, id, touched, intensity, exerciseclass, workoutexerciseid } = exercise
  const { colors: themeColors } = useTheme() as ColorsInterface
  const [sets, setCurrentSets] = useState(actual && actual.sets ? actual.sets : planned.sets)
  const [reps, setCurrentReps] = useState(
    actual && actual.reps ? actual.reps : planned.reprange ? "" : planned.reps,
  )
  const [weight, setCurrentWeight] = useState(actual && actual.weight ? actual.weight + "kg" : "")
  const [isViewOpen, setIsViewOpen] = useState(false)

  const exerciseClassWRS = exerciseclass === "wrs"

  const previous = getPreviousActual(id, workoutexerciseid, index)

  const PRE = intensityToRPE(intensity)
  const plannedWeight = calculateWeightRange(planned)
  const plannedReps = calculateRepsRange(planned)

  let typeToDisplay = "Rpe"

  switch (planned?.cyclewgtfield) {
    case "1":
      typeToDisplay = ExerciseWgtFieldsEnum.REL
      break
    case "2":
      typeToDisplay = ExerciseWgtFieldsEnum.RPE
      break
    case "3":
      typeToDisplay = ExerciseWgtFieldsEnum.RIR
      break
    case "4":
      typeToDisplay = ExerciseWgtFieldsEnum.PER
      break
    default:
      typeToDisplay = ExerciseWgtFieldsEnum.REL
  }

  let dataOfTypeWgt =
    typeToDisplay !== ExerciseWgtFieldsEnum.REL
      ? planned[typeToDisplay.toUpperCase() as keyof typeof planned].toString() || PRE?.toString()
      : intensity

  if (typeToDisplay === ExerciseWgtFieldsEnum.PER || typeToDisplay === ExerciseWgtFieldsEnum.REL) {
    dataOfTypeWgt = dataOfTypeWgt + "%"
  }
  if (typeToDisplay === ExerciseWgtFieldsEnum.REL) {
    typeToDisplay = "Rel"
  }
  const toggleOpen = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setIsViewOpen((prev) => !prev)
  }
  const onChangeSets = (text: string) => {
    const formatedText = text.replace(/^0|[ ,.]/g, "")
    setCurrentSets(formatedText)
    setSets(workoutId, exercise.workoutexerciseid, formatedText)
  }

  const onChangeReps = (text: string) => {
    const formatedText = text.replace(/^0|[ ,.]/g, "")
    setCurrentReps(formatedText)
    setReps(workoutId, exercise.workoutexerciseid, formatedText)
  }

  const validateAndFormatWeight = (text: string) => {
    let formattedText = text
    const commaCount = (text.match(/,/g) || []).length
    const dotCount = (text.match(/\./g) || []).length

    if (commaCount + dotCount > 1) {
      const firstSeparatorIndex = Math.min(
        text.indexOf(",") === -1 ? Infinity : text.indexOf(","),
        text.indexOf(".") === -1 ? Infinity : text.indexOf("."),
      )

      formattedText = text[0] + text.slice(1).replace(/[,.]/g, "")

      formattedText =
        formattedText.slice(0, firstSeparatorIndex) +
        text[firstSeparatorIndex] +
        formattedText.slice(firstSeparatorIndex)
    }

    return formattedText
  }

  const onChangeWeight = (text: string) => {
    const formatedText = validateAndFormatWeight(text)
    setCurrentWeight(formatedText)
    setWeight(workoutId, exercise.workoutexerciseid, formatedText)
  }
  return (
    <View style={$container}>
      <View style={$inputsTitles}>
        <Text style={[$sectionTitleItem, { color: themeColors.text }]}>Sets</Text>
        <Text style={[$sectionTitleItem, { color: themeColors.text }]}>Reps</Text>
        <Text style={[$sectionTitleItem, { color: themeColors.text }]}>{typeToDisplay}</Text>
        {exerciseClassWRS && (
          <Text style={[$sectionTitleItem, { color: themeColors.text }]}>Weight</Text>
        )}
      </View>
      <View style={$inputsWrapper}>
        <TextField
          preset={actual?.sets ? "reversed" : "default"}
          value={sets?.toString()}
          onChangeText={onChangeSets}
          placeholderString={planned?.sets?.toString() || ""}
          placeholderTextColor={$placeholderTextColor}
          autoCapitalize="none"
          autoComplete="additional-name"
          keyboardType="numeric"
          autoCorrect={false}
          containerStyle={$textFieldContainer}
          style={$textField}
          inputWrapperStyle={{
            backgroundColor: actual?.sets ? themeColors.primary : themeColors.alternativeText,
            borderColor: themeColors.border,
          }}
          inputTextStyle={{ color: actual?.sets ? themeColors.alternativeText : themeColors.text }}
          editable={currentCycleOpened}
          returnKeyType="done"
        />
        <TextField
          preset={actual?.reps ? "reversed" : "default"}
          value={reps?.toString()}
          onChangeText={onChangeReps}
          placeholderString={plannedReps}
          placeholderTextColor={actual?.reps ? themeColors.alternativeText : themeColors.grey}
          autoCapitalize="none"
          autoComplete="additional-name"
          keyboardType="numeric"
          autoCorrect={false}
          containerStyle={$textFieldContainer}
          style={$textField}
          editable={currentCycleOpened}
          inputWrapperStyle={{
            backgroundColor: actual?.reps ? themeColors.primary : themeColors.alternativeText,
            borderColor: themeColors.border,
          }}
          inputTextStyle={{ color: actual?.reps ? themeColors.alternativeText : themeColors.text }}
          returnKeyType="done"
        />
        <TextField
          preset={+touched ? "reversed" : "default"}
          value={dataOfTypeWgt}
          placeholderString={"7"}
          autoCapitalize="none"
          autoComplete="additional-name"
          keyboardType="numeric"
          autoCorrect={false}
          containerStyle={$textFieldContainer}
          style={$textField}
          editable={false}
          inputWrapperStyle={{
            backgroundColor: +touched ? themeColors.primary : themeColors.alternativeText,
            borderColor: themeColors.border,
          }}
          inputTextStyle={{ color: +touched ? themeColors.alternativeText : themeColors.text }}
          returnKeyType="done"
        />
        {exerciseClassWRS && (
          <TextField
            preset={weight ? "reversed" : "default"}
            value={weight}
            placeholderString={plannedWeight}
            placeholderTextColor={themeColors.grey}
            onChangeText={onChangeWeight}
            autoCapitalize="none"
            autoComplete="additional-name"
            keyboardType="numeric"
            autoCorrect={false}
            containerStyle={$textFieldContainer}
            style={[$textField]}
            inputWrapperStyle={{
              backgroundColor: weight ? themeColors.primary : themeColors.alternativeText,
              borderColor: themeColors.border,
            }}
            inputTextStyle={{
              color: weight ? themeColors.alternativeText : themeColors.text,
            }}
            onFocus={() => setCurrentWeight(weight.replace(/\D/g, ""))}
            onBlur={() => setCurrentWeight(weight && weight + "kg")}
            editable={currentCycleOpened}
            returnKeyType="done"
          />
        )}
      </View>
      {isViewOpen && (
        <View style={$inputsWrapper}>
          <View
            style={[
              $mockInputContainer,
              { backgroundColor: themeColors.background, borderColor: themeColors.primary },
            ]}
          >
            <Text style={[$mockInputText, { color: themeColors.primary }]}>{previous?.sets}</Text>
          </View>
          <View
            style={[
              $mockInputContainer,
              { backgroundColor: themeColors.background, borderColor: themeColors.primary },
            ]}
          >
            <Text style={[$mockInputText, { color: themeColors.primary }]}>{previous?.reps}</Text>
          </View>
          <View
            style={[
              $mockInputContainer,
              { backgroundColor: themeColors.background, borderColor: themeColors.primary },
            ]}
          >
            <Text style={[$mockInputText, { color: themeColors.primary }]}>{dataOfTypeWgt}</Text>
          </View>
          {exerciseClassWRS && (
            <View
              style={[
                $mockInputContainer,
                { backgroundColor: themeColors.background, borderColor: themeColors.primary },
              ]}
            >
              <Text style={[$mockInputText, { color: themeColors.primary }]}>
                {previous?.weight}kg
              </Text>
            </View>
          )}
        </View>
      )}

      {previous && (
        <TouchableOpacity onPress={toggleOpen} style={$viewPrevious}>
          <Text style={{ color: themeColors.primary }}>
            {isViewOpen ? "All done" : "View Previous"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  )
})

const $container: ViewStyle = {
  gap: spacing.md,
  overflow: "hidden",
}

const $sectionTitleItem: TextStyle = {
  paddingVertical: 8,
  flex: 1,
  textAlign: "center",
  fontFamily: typography.fonts.manrope.normal,
  color: colors.palette.grey3,
}

const $inputsWrapper: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  gap: spacing.xxs,
}

const $inputsTitles: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
}

const $textFieldContainer: ViewStyle = {
  flex: 1,
}

const $textField: TextStyle = { textAlign: "center", fontFamily: typography.fonts.manrope.bold }

const $placeholderTextColor: ColorValue = colors.palette.grey2

const $viewPrevious: ViewStyle = { alignItems: "flex-end" }

const $mockInputContainer: ViewStyle = {
  flex: 1,
  borderColor: colors.palette.primary,
  borderWidth: 1,
  backgroundColor: colors.palette.grey1,
  padding: spacing.sm,
  borderRadius: spacing.xs,
}

const $mockInputText: TextStyle = {
  ...$textField,
  color: colors.palette.primary,
  fontSize: 16,
}
