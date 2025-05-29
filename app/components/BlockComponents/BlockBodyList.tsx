import { generateUUID } from "app/utils/uuid"
import React from "react"
import { View, ViewStyle } from "react-native"
import { spacing } from "app/theme"
import { IBlockDataItem } from "app/utils/types/DiagramData"
import { BlockBodyItem } from "./BlockBodyItem"

interface BlockBodyListProps {
  blockData: IBlockDataItem[]
}

export const BlockBodyList: React.FC<BlockBodyListProps> = ({ blockData }) => {
  return (
    <View style={$container}>
      {blockData.map((blockItem, index) => {
        const isLastElement = blockData.length === index + 1
        return (
          <BlockBodyItem
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
