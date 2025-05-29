import { colors } from "app/theme"
import React from "react"
import { ActivityIndicator, ViewStyle, Modal, View } from "react-native"

interface LoaderProps {
  color?: string
  size?: number | "large" | "small"
  backgroundColor?: string
  isVisible: boolean
}

export const Loader: React.FC<LoaderProps> = ({ color, size, isVisible }) => {
  return (
    <Modal visible={isVisible} animationType="fade" transparent>
      <View style={$container}>
        <ActivityIndicator size={size || "large"} color={color || colors.palette.lightYellow} />
      </View>
    </Modal>
  )
}

const $container: ViewStyle = {
  backgroundColor: colors.palette.black,
  opacity: 0.5,
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
}
