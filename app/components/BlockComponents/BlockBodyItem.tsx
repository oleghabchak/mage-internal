import { colors, spacing, typography } from "app/theme"
import React from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import { Text } from "../Text"
import { colorsForValues } from "app/theme/variables"
import { IBlockDataItem } from "app/utils/types/DiagramData"
import { Icon } from "../Icon"
import { generateExerciseBodyDescription, generateBodyProgress } from "app/utils/functions"

interface BlockBodyItemProps {
  blockItem: IBlockDataItem
  index: number
  isLastElement?: boolean
}

export const BlockBodyItem: React.FC<BlockBodyItemProps> = ({
  blockItem,
  index,
  isLastElement,
}) => {
  const { firstCycleData, lastCycleData } = blockItem

  return (
    <View style={[$container, isLastElement && $lastElement]}>
      <View style={[$rectangle, { backgroundColor: colorsForValues[index] }]} />
      <View style={$contentContainer}>
        <View style={$titleContainer}>
          <Text style={$sectionTitleText}>{blockItem.name}</Text>
          <Text style={$sectionIncreaces}>{generateBodyProgress(blockItem)}</Text>
        </View>
        <View style={$additionalInformationContainer}>
          <Text style={$subtitleText}>
            {firstCycleData ? generateExerciseBodyDescription(firstCycleData) : `0 set of 0`}
          </Text>
          <Icon icon="bigRightArrow" />
          <Text style={$subtitleText}>
            {lastCycleData ? generateExerciseBodyDescription(lastCycleData) : `0 set of 0`}
          </Text>
        </View>
      </View>
    </View>
  )
}

const $container: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  gap: spacing.sm,
  borderBottomWidth: 2,
  borderBottomColor: colors.palette.white,
  paddingVertical: spacing.xs,
}

const $lastElement: ViewStyle = { borderBottomWidth: 0 }

const $contentContainer: ViewStyle = { flex: 1 }

const $titleContainer: ViewStyle = { flexDirection: "row", alignItems: "baseline", gap: spacing.md }

const $sectionTitleText: TextStyle = {
  minWidth: "36%",
  color: colors.palette.black,
  fontSize: 14,
  fontFamily: typography.primary.normal,
}
const $subtitleText: TextStyle = {
  flex: 1,
  color: colors.palette.black,
  fontSize: 12,
  fontFamily: typography.primary.light,
}
const $sectionIncreaces: TextStyle = {
  color: colors.palette.primary,
  fontSize: 14,
  fontFamily: typography.primary.medium,
}
const $rectangle: ViewStyle = {
  height: spacing.md,
  width: spacing.md,
  borderRadius: 2,
}
const $additionalInformationContainer: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "baseline",
  gap: spacing.xs,
}
