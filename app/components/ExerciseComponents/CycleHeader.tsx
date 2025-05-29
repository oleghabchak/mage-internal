import { useNavigation, useTheme } from "@react-navigation/native"
import { Icon } from "app/components"
import { useStores } from "app/models"
import { colors, spacing } from "app/theme"
import { ColorsInterface } from "app/theme/colorsInterface"
import { formatDateToString } from "app/utils/formatDate"
import { observer } from "mobx-react-lite"
import React, { useEffect } from "react"
import { Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"

interface Props {}

export const CycleHeader: React.FC<Props> = observer(function CycleHeader() {
  const {
    programStore: {
      programData,
      currentCycle,
      getCurrentCycle,
      currentCycleOpened,
      setCurrentCycle,
    },
  } = useStores()

  const navigation = useNavigation()
  const handlPressRight = () => {
    setCurrentCycle(currentCycle + 1)
  }

  const handlPressLeft = () => {
    setCurrentCycle(currentCycle - 1)
  }

  const { colors: themeColors } = useTheme() as ColorsInterface
  const { startdate } = getCurrentCycle
  const dateOfCycle = formatDateToString(startdate)

  useEffect(() => {
    setCurrentCycle(programData.currentcycle)
  }, [programData.cyclelist, navigation])

  return (
    <View style={[$container, { backgroundColor: themeColors.primary }]}>
      {currentCycle !== 1 ? (
        <TouchableOpacity
          onPress={handlPressLeft}
          hitSlop={{ top: 15, bottom: 15, left: 10, right: 50 }}
          style={{ paddingHorizontal: spacing.md }}
        >
          <Icon icon="caretLeft" color={themeColors.alternativeText} size={24} />
        </TouchableOpacity>
      ) : (
        <View style={{ paddingHorizontal: spacing.xl }} />
      )}

      <View style={$content}>
        <Text style={[$defaultTitle, { color: themeColors.alternativeText }]}>
          Cycle {currentCycle}/{programData.cycles}
        </Text>
        <Text style={[$text, { color: themeColors.alternativeText }]}>
          {startdate ? dateOfCycle : ""}
        </Text>
      </View>

      {currentCycleOpened ? (
        <View style={{ paddingHorizontal: spacing.xl }} />
      ) : (
        <TouchableOpacity
          onPress={handlPressRight}
          hitSlop={{ top: 20, bottom: 20, left: 50, right: 10 }}
          style={{ paddingHorizontal: spacing.md }}
        >
          <Icon icon="caretRight" color={themeColors.alternativeText} size={24} />
        </TouchableOpacity>
      )}
    </View>
  )
})

const $container: ViewStyle = {
  flexDirection: "row",
  backgroundColor: colors.palette.primary,
  justifyContent: "space-between",
  paddingVertical: spacing.sm,
  borderRadius: spacing.xs,
  alignItems: "center",
}

const $content: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
  gap: spacing.xxs,
}

const $text: TextStyle = {
  color: colors.palette.white,
  fontSize: 12,
}

const $defaultTitle: TextStyle = {
  ...$text,
  fontSize: 16,
}
