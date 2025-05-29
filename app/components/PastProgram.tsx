import { spacing, colors } from "app/theme"
import { generateUUID } from "app/utils/uuid"
import React from "react"
import { View, TextStyle, ViewStyle } from "react-native"
import { Card } from "./Card"
import { Text } from "./Text"
import { useNavigation, useTheme } from "@react-navigation/native"
import { IProgramsListItem } from "app/models/ProgramStore"
import { useStores } from "app/models"
import { ColorsInterface } from "app/theme/colorsInterface"

interface PastProgramProps {
  program: IProgramsListItem
}

export const PastProgram: React.FC<PastProgramProps> = ({ program }) => {
  const {
    programStore: { setCurrentPastProgramId },
  } = useStores()
  const navigation = useNavigation()
  const { colors } = useTheme() as ColorsInterface
  const handleNavigateToPastProgram = async () => {
    setCurrentPastProgramId(program.id)
    await navigation.navigate("DemoCommunity" as never)

    setTimeout(() => {
      navigation.navigate("BlockData" as never)
    }, 200)
  }

  return (
    <Card
      key={generateUUID()}
      style={{ ...$item, backgroundColor: colors.grey, borderColor: colors.border }}
      onPress={handleNavigateToPastProgram}
      preset="reversed"
      ContentComponent={
        <View style={$cardContainer}>
          <Text weight="bold" size="md" text={program.name} style={{ color: colors.text }} />
          <Text size="xxs" text={"Completed date"} style={{ ...$subtitle, color: colors.text }} />
        </View>
      }
    />
  )
}

const $subtitle: TextStyle = {
  textAlign: "center",
  fontSize: spacing.md,
  color: colors.palette.grey4,
}

const $item: ViewStyle = {
  minHeight: 40,
}

const $cardContainer: ViewStyle = {
  gap: spacing.xxxs,
  alignItems: "flex-start",
  justifyContent: "center",
}
