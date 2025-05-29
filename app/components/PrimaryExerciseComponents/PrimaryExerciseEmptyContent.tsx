import { useStores } from "app/models"
import { spacing, typography } from "app/theme"
import { trimmTitleString } from "app/utils/functions"
import { useHeader } from "app/utils/useHeader"
import { observer } from "mobx-react-lite"
import React from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import { Text } from "../Text"
import { PastProgramsBlock } from "../PastProgramsBlock"
import { Screen } from "../Screen"
import { useTheme } from "@react-navigation/native"
import { ColorsInterface } from "app/theme/colorsInterface"

interface PrimaryExerciseEmptyContentProps {}

export const PrimaryExerciseEmptyContent: React.FC<PrimaryExerciseEmptyContentProps> = observer(
  function PrimaryExerciseEmptyContent() {
    const {
      authenticationStore: { firstName },
    } = useStores()
    const capitalizedName = firstName?.charAt(0).toUpperCase() + firstName?.slice(1)
    const { colors } = useTheme() as ColorsInterface

    useHeader(
      {
        title: "Hey " + trimmTitleString(capitalizedName, 10) + ",",
        titleStyle: {
          fontSize: spacing.xl,
          color: colors.primary,
        },
        hideBackBtn: true,
        backgroundColor: colors.background,
      },
      [firstName, colors],
    )
    return (
      <Screen statusBarStyle="dark" preset="scroll">
        <View style={$container}>
          <View>
            <Text style={[$contentText, { color: colors.text }]}>
              You currently do not have a program assigned to you.
            </Text>
            <Text style={[$contentText, { color: colors.text }]}>Your coach has been alerted.</Text>
            <Text style={[$contentText, { color: colors.text }]}>
              A new program will be up shortly
            </Text>
          </View>
          <Text style={[$contentText, { color: colors.text }]}>
            Why don’t you check out some of your old programs and look at some of your past wins.{" "}
          </Text>

          <PastProgramsBlock />
        </View>
      </Screen>
    )
  },
)

const $container: ViewStyle = { gap: spacing.lg }

const $contentText: TextStyle = {
  fontFamily: typography.primary.normal,
  fontSize: 17,
}
