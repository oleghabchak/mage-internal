import { Icon } from "app/components"
import { colors, spacing, typography } from "app/theme"
import React, { useEffect, useRef, useState } from "react"
import {
  Animated,
  LayoutAnimation,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { ExerciseHelpButton } from "./ExerciseHelpButton"
import { NotesSection } from "./NotesSection"
import { InputsSection } from "./InputsSection"
import { EvaluationSection } from "./EvaluationSection"
import { BottomPopup } from "app/components/BottomPopup/BottomPopup"
import { BottomPopupCard } from "app/components/BottomPopup/BottomPopupCard"
import { BottomPopupNavBar } from "app/components/BottomPopup/BottomPopupNavBar"
import { BottomPopupTable } from "app/components/BottomPopup/BottomPopupTable"
import { BottomPopupModal } from "app/components/BottomPopup/BottomPopupModal"
import { BottomPopupVideo } from "app/components/BottomPopup/BottomPopupVideo"
import { IExercise } from "app/models/ProgramStore"
import { useStores } from "app/models"
import { observer } from "mobx-react-lite"
import { createPlannedText } from "app/utils/functions"
import { ExerciseClassEnum } from "app/utils/enums/exerciseClassesEnum"
import { useTheme } from "@react-navigation/native"
import { ColorsInterface } from "app/theme/colorsInterface"

interface ExerciseItemProps {
  workoutId: number
  exercise: IExercise
  index: number
}

export const ExerciseItem: React.FC<ExerciseItemProps> = observer(function ExerciseItem({
  workoutId,
  exercise,
  index,
}) {
  const {
    programStore: { setNote, setTouched, setExerciseMax },
  } = useStores()
  const {
    actual,
    planned,
    name,
    touched,
    videolink,
    groups,
    workoutexerciseid,
    description,
    exerciseclass,
  } = exercise

  const [isOpen, setIsOpen] = useState(false)
  const [openedSection, setOpenedSection] = useState<boolean>(false)
  const [activeButtonSlug, setActiveButtonSlug] = useState<string>("video")
  const rotateAnimation = useRef(new Animated.Value(0)).current
  const { colors: themeColors } = useTheme() as ColorsInterface
  const exerciseClassWRS = exerciseclass === "wrs"
  const isChecked = !!+touched
  const plannedText = createPlannedText(exercise)

  const toggleOpen = () => {
    if (exercise.exerciseclass === ExerciseClassEnum.INSTRUCTION && !isChecked) {
      setTouched(workoutexerciseid, "1")
      setExerciseMax(workoutId, workoutexerciseid, "")
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear)
    setIsOpen((prev) => {
      const toValue = prev ? 0 : 1
      Animated.timing(rotateAnimation, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }).start()

      return !prev
    })
  }

  const handleSubmit = async (value: string | number) => {
    setExerciseMax(workoutId, workoutexerciseid, value)
  }

  const handleCloseBottomPopup = () => setOpenedSection(false)

  const BottomPopupContent = () => {
    switch (activeButtonSlug) {
      case "coachnote":
        return (
          <BottomPopupCard title={name}>
            <Text style={[$coachNote, { color: themeColors.text }]}>{description}</Text>
          </BottomPopupCard>
        )
      case "video":
        return <BottomPopupVideo url={videolink} />
      case "1rm":
        return (
          <BottomPopupCard title={name}>
            <BottomPopupModal
              onSubmit={handleSubmit}
              onClose={handleCloseBottomPopup}
              initialAbility={planned.max}
            />
          </BottomPopupCard>
        )
      case "info":
        return (
          <BottomPopupCard title={name}>
            <BottomPopupTable groups={groups} />
          </BottomPopupCard>
        )

      default:
        return <Text>This page is not ready</Text>
    }
  }

  const handleSaveNote = (text: string) => {
    setNote(workoutId, workoutexerciseid, text)
  }

  useEffect(() => {
    const commonValues = actual && actual.ease && actual.reps
    const allConpletedForBody = !exerciseClassWRS && commonValues
    const allCompletedForWRS = exerciseClassWRS && commonValues && actual.weight
    if ((allConpletedForBody || allCompletedForWRS) && !isChecked) {
      setTouched(workoutexerciseid, "1")
    }
  }, [actual?.ease, actual?.weight, actual?.reps])

  return (
    <View style={$itemWrapper}>
      <TouchableOpacity
        onPress={toggleOpen}
        style={[$exerciseWrapper, { backgroundColor: themeColors.grey }]}
      >
        <View style={$exerciseTitleWrapper}>
          <View
            style={[
              $leftIconWrapper,
              { borderColor: themeColors.primary },
              isChecked && {
                ...$checked,
                backgroundColor: themeColors.primary,
                borderColor: themeColors.border,
              },
            ]}
          >
            {isChecked && <Icon icon={"check"} color={themeColors.secondary} size={22} />}
          </View>
          <View style={$contentWrapper}>
            <View style={$textWrapper}>
              <Text style={[$title, { color: themeColors.text }]}>{name}</Text>
              {!isOpen && exercise.exerciseclass !== ExerciseClassEnum.INSTRUCTION && (
                <Text style={[$text, { color: themeColors.text }]}>{plannedText}</Text>
              )}
              {!isOpen && exercise.exerciseclass === ExerciseClassEnum.INSTRUCTION && (
                <Text style={$descText}>
                  {exercise.description.split(" ").slice(0, 4).join(" ")}
                  {"..."}
                </Text>
              )}
            </View>
            <Animated.View
              style={{
                transform: [
                  {
                    rotate: rotateAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", "90deg"],
                    }),
                  },
                ],
              }}
            >
              <Icon icon={"caretRight"} color={themeColors.primary} size={30} />
            </Animated.View>
          </View>
        </View>
        {isOpen && (
          <View style={$buttonsContainer}>
            {exercise.exerciseclass !== ExerciseClassEnum.INSTRUCTION && (
              <ExerciseHelpButton
                icon={"documentation"}
                onPress={() => {
                  setActiveButtonSlug("coachnote")
                  setOpenedSection(true)
                }}
              />
            )}
            <ExerciseHelpButton
              icon={"watch"}
              onPress={() => {
                setActiveButtonSlug("video")
                setOpenedSection(true)
              }}
            />
            {exerciseClassWRS && (
              <ExerciseHelpButton
                icon={"rm"}
                onPress={() => {
                  setActiveButtonSlug("1rm")
                  setOpenedSection(true)
                }}
              />
            )}
            <ExerciseHelpButton
              icon={"info"}
              onPress={() => {
                setActiveButtonSlug("info")
                setOpenedSection(true)
              }}
            />
          </View>
        )}
      </TouchableOpacity>
      {isOpen && (
        <View style={[$exerciseContextWrapper, { backgroundColor: themeColors.grey }]}>
          {exercise.exerciseclass !== ExerciseClassEnum.INSTRUCTION ? (
            <View>
              <InputsSection workoutId={workoutId} exercise={exercise} index={index} />
              <EvaluationSection workoutId={workoutId} exercise={exercise} />
            </View>
          ) : (
            <View style={$descWrapper}>
              <View>
                <Text>Description</Text>
              </View>

              <View style={$descTextWrapper}>
                <Text>{exercise.description}</Text>
              </View>
            </View>
          )}

          <NotesSection
            notes={exercise.notes}
            onSave={handleSaveNote}
            backgroundColor={themeColors.alternativeText}
            color={themeColors.text}
            greyBg={themeColors.grey}
          />
        </View>
      )}
      <BottomPopup isVisible={openedSection} onClose={handleCloseBottomPopup} title={name}>
        <BottomPopupNavBar
          activeButtonSlug={activeButtonSlug}
          onSelect={setActiveButtonSlug}
          exerciseClassWRS={exerciseClassWRS}
          exerciseClass={exerciseclass}
        />
        <BottomPopupContent />
      </BottomPopup>
    </View>
  )
})

const $leftIconWrapper: ViewStyle = {
  width: 32,
  height: 32,
  borderRadius: 32,
  borderWidth: 2,
  borderColor: colors.palette.turquoise,
  justifyContent: "center",
  alignItems: "center",
}

const $checked: ViewStyle = {
  backgroundColor: colors.palette.turquoise,
}

const $itemWrapper: ViewStyle = {
  gap: spacing.sm,
}

const $exerciseContextWrapper: ViewStyle = {
  gap: spacing.md,
  backgroundColor: colors.palette.grey2,
  borderRadius: spacing.xs,
  paddingHorizontal: spacing.xs,
  paddingBottom: spacing.md,
}

const $exerciseWrapper: ViewStyle = {
  paddingHorizontal: spacing.xs,
  paddingVertical: spacing.sm,
  gap: spacing.sm,
  backgroundColor: colors.palette.grey2,
  borderRadius: spacing.xs,
  overflow: "hidden",
}

const $contentWrapper: ViewStyle = {
  flexDirection: "row",
  flex: 1,
  justifyContent: "space-between",
  alignItems: "center",
}

const $exerciseTitleWrapper: ViewStyle = {
  flexDirection: "row",
  flex: 1,
  justifyContent: "space-between",
  alignItems: "center",
  gap: spacing.md,
}

const $title: TextStyle = {
  fontSize: 16,
  lineHeight: 20,
  fontFamily: typography.primary.semiBold,
}

const $buttonsContainer: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  gap: spacing.xxs,
}

const $text: TextStyle = {
  color: colors.palette.neutral400,
  fontSize: 12,
  letterSpacing: 1,
  fontFamily: typography.primary.normal,
}

const $descWrapper: ViewStyle = {
  marginTop: 15,
  display: "flex",
  flexDirection: "column",
  gap: 15,
}
const $descTextWrapper: ViewStyle = {
  backgroundColor: colors.palette.white,
  borderRadius: 10,
  padding: 10,
  height: 200,
}
const $descText: TextStyle = {
  color: colors.palette.neutral400,
  fontSize: 12,
  fontFamily: typography.primary.normal,
}

const $textWrapper: ViewStyle = {
  gap: spacing.xxs,
}

const $coachNote: TextStyle = { textAlign: "center", padding: spacing.ml }
