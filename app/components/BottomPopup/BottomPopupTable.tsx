import { useTheme } from "@react-navigation/native"
import { IGroup } from "app/models/ProgramStore"
import { colors, spacing, typography } from "app/theme"
import { ColorsInterface } from "app/theme/colorsInterface"
import { generateUUID } from "app/utils/uuid"
import React from "react"
import { Text, TextStyle, View, ViewStyle } from "react-native"

interface BottomPopupTableProps {
  groups: IGroup[]
}

interface TableLineProps {
  groupName: string
  typeName: string
  isLastItem: boolean
}

const TableLine: React.FC<TableLineProps> = ({ groupName, typeName, isLastItem }) => {
  const { colors: themeColors } = useTheme() as ColorsInterface
  return (
    <View style={[$line, isLastItem && $lastLine]}>
      <View style={$leftBlock}>
        <Text style={[$text, { color: themeColors.text }]}>{typeName}</Text>
      </View>
      <View style={$rightBlock}>
        <Text style={[$text, { color: themeColors.text }]}>{groupName}</Text>
      </View>
    </View>
  )
}

export const BottomPopupTable: React.FC<BottomPopupTableProps> = ({ groups }) => {
  return (
    <View style={$container}>
      {groups.map((group, index) => (
        <TableLine
          key={generateUUID()}
          groupName={group.group_name}
          typeName={group.type_name}
          isLastItem={groups.length === index + 1}
        />
      ))}
    </View>
  )
}

const $container: ViewStyle = {
  flex: 1,
  paddingHorizontal: spacing.sm,
  paddingBottom: spacing.sm,
}

const $border: ViewStyle = {
  borderColor: colors.palette.white,
}

const $line: ViewStyle = {
  flexDirection: "row",
  borderBottomWidth: 1,
  ...$border,
}

const $lastLine: ViewStyle = {
  borderBottomWidth: 0,
}

const $leftBlock: ViewStyle = {
  flex: 1,
  alignItems: "flex-end",
  padding: spacing.xs,
}

const $rightBlock: ViewStyle = {
  flex: 2,
  padding: spacing.xs,
  borderLeftWidth: 1,
  ...$border,
}

const $text: TextStyle = {
  fontFamily: typography.fonts.manrope.medium,
  color: colors.palette.black,
}
