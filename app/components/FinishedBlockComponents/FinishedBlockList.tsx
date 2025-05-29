import { generateUUID } from "app/utils/uuid"
import React from "react"
import { FinishedBlockItem } from "./FinishedBlockItem"
import { View, ViewStyle } from "react-native"
import { spacing } from "app/theme"

const mockData = [1, 2, 3]

interface FinishedBlockListProps {}

export const FinishedBlockList: React.FC<FinishedBlockListProps> = () => {
  return (
    <View style={$container}>
      {mockData.map((_, index) => {
        const isLastElement = mockData.length === index + 1
        return (
          <FinishedBlockItem key={generateUUID()} index={index} isLastElement={isLastElement} />
        )
      })}
    </View>
  )
}

const $container: ViewStyle = {
  padding: spacing.sm,
}
