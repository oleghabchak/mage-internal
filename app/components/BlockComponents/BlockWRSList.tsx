import { generateUUID } from "app/utils/uuid"
import React from "react"
import { View, ViewStyle } from "react-native"
import { spacing } from "app/theme"
import { BlockWRSItem } from "./BlockWRSItem"
import { IBlockDataItem } from "app/utils/types/DiagramData"

interface BlockWRSListProps {
  blockData: IBlockDataItem[]
}

export const BlockWRSList: React.FC<BlockWRSListProps> = ({ blockData }) => {
  return (
    <View style={$container}>
      {blockData.map((blockItem, index) => {
        const isLastElement = blockData.length === index + 1
        return (
          <BlockWRSItem
            key={generateUUID()}
            blockItem={blockItem}
            index={index}
            isLastElement={isLastElement}
          />
        )
      })}
    </View>
  )
}

const $container: ViewStyle = {
  padding: spacing.sm,
}
