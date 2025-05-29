import { spacing, typography } from "app/theme"
import { TextStyle, View, ViewStyle } from "react-native"
import React from "react"
import { Text } from "./Text"
import { PastProgram } from "./PastProgram"
import { generateUUID } from "app/utils/uuid"
import { useStores } from "app/models"
import { useTheme } from "@react-navigation/native"
import { ColorsInterface } from "app/theme/colorsInterface"

interface PastProgramsBlockProps {}

export const PastProgramsBlock: React.FC<PastProgramsBlockProps> = () => {
  const {
    programStore: { pastPrograms },
  } = useStores()

  const { colors } = useTheme() as ColorsInterface

  return (
    !!pastPrograms.length && (
      <View style={$container}>
        <Text style={[$blockTitle, { color: colors.primary || "#000000" }]} text="Past Programs" />
        <View style={$cardsContainer}>
          {pastPrograms.map((program) => (
            <PastProgram key={generateUUID()} program={program} />
          ))}
        </View>
      </View>
    )
  )
}

const $container: ViewStyle = {
  gap: spacing.sm,
  marginVertical: spacing.ml,
}

const $blockTitle: TextStyle = {
  marginHorizontal: spacing.md,
  fontSize: 24,
  fontFamily: typography.primary.semiBold,
}

const $cardsContainer: ViewStyle = {
  // gap: spacing.ml,
}
