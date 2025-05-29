import { colors, spacing, typography } from "app/theme"
import React from "react"
import { Modal, Text, TouchableOpacity, View, ViewStyle, TextStyle } from "react-native"
import { Icon } from "../Icon"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { useTheme } from "@react-navigation/native"
import { ColorsInterface } from "app/theme/colorsInterface"

interface PopupProps {
  isVisible: boolean
  onClose: () => void
  title?: string
  minHeight?: string
  children?: React.ReactNode
}

export const BottomPopup: React.FC<PopupProps> = ({
  isVisible,
  onClose,
  title,
  children,
  minHeight = "45%",
}) => {
  const { colors: themeColors } = useTheme() as ColorsInterface
  return (
    <Modal visible={isVisible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <KeyboardAwareScrollView contentContainerStyle={$container} scrollEnabled={false}>
        <TouchableOpacity onPress={onClose} style={$background} />
        <View
          style={[
            $contentWrapper,
            { minHeight: minHeight },
            !title && $smallPopup,
            { backgroundColor: themeColors.background },
          ]}
        >
          {title && (
            <View style={$headerContainer}>
              <TouchableOpacity style={$closeButton} onPress={onClose}>
                <Icon icon="close" size={32} color={themeColors.text} />
              </TouchableOpacity>
              <Text style={[$title, { color: themeColors.text }]}>{title}</Text>
            </View>
          )}
          <View style={$contentContainer}>{children}</View>
        </View>
      </KeyboardAwareScrollView>
    </Modal>
  )
}

const $container: ViewStyle = {
  flex: 1,
  justifyContent: "flex-end",
  backgroundColor: "rgba(0,0,0,0.5)",
}

const $background: ViewStyle = {
  position: "absolute",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
}

const $contentWrapper: ViewStyle = {
  backgroundColor: "white",
  borderTopLeftRadius: 30,
  borderTopRightRadius: 30,
  gap: spacing.lg,
}

const $smallPopup: ViewStyle = { paddingTop: 20 }

const $headerContainer: ViewStyle = {
  marginTop: spacing.lg,
  justifyContent: "center",
  alignItems: "center",
}

const $closeButton: ViewStyle = {
  position: "absolute",
  left: 20,
  height: 30,
  width: 30,
  justifyContent: "center",
  alignItems: "center",
}

const $title: TextStyle = {
  fontFamily: typography.fonts.manrope.medium,
  fontSize: 17,
  color: colors.palette.black,
}

const $contentContainer: TextStyle = {
  flex: 1,
  gap: spacing.ml,
}
