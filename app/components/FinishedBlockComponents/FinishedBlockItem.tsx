import { colors, spacing, typography } from "app/theme"
import React from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import { Text } from "../Text"
import { Icon } from "../Icon"

const mockColors = [colors.palette.badge, colors.palette.lightGreen, colors.palette.primary]

interface FinishedBlockItemProps {
  index: number
  isLastElement?: boolean
}

export const FinishedBlockItem: React.FC<FinishedBlockItemProps> = ({ index, isLastElement }) => {
  return (
    <View style={[$container, isLastElement && $lastElement]}>
      <View style={[$rectangle, { backgroundColor: mockColors[index] }]} />
      <View style={$contentContainer}>
        <View style={$titleContainer}>
          <Text style={$sectionTitleText}>Leg Press</Text>
          <Text style={$sectionIncreaces}>+10kg and +3 reps</Text>
        </View>
        <View style={$additionalInformationContainer}>
          <Text style={$subtitleText}>2 set of 8 @ 120kg</Text>
          <Icon icon="bigRightArrow" />
          <Text style={$subtitleText}>2 set of 11 @ 130kg</Text>
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
  paddingHorizontal: spacing.md,
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
  alignItems: "baseline",
  gap: spacing.xs,
}
