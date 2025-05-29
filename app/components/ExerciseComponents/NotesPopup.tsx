import { colors } from "app/theme"
import React from "react"
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"

interface PopupProps {
  isVisible: boolean
  onClose: () => void
  value: string
  setValue: (arg: string) => void
  backgroundColor: string
  color: string
}

export const NotesPopup: React.FC<PopupProps> = ({
  isVisible,
  onClose,
  value,
  setValue,
  backgroundColor,
  color,
}) => {
  const isIos = Platform.OS === "ios"

  return (
    <Modal visible={isVisible} animationType="fade" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView style={$container} behavior={isIos ? "padding" : "height"}>
        <TouchableOpacity onPress={onClose} style={$background} />
        <View style={[$contentWrapper, { backgroundColor: backgroundColor }]}>
          <TextInput
            placeholder="Notes"
            placeholderTextColor={colors.palette.grey3}
            multiline={true}
            value={value}
            onChangeText={(text) => setValue(text)}
            autoCapitalize="none"
            keyboardType="default"
            autoCorrect={false}
            style={[$textInput, { color: color }]}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const $container: ViewStyle = {
  flex: 1,
  paddingTop: "30%",
  justifyContent: "center",
  alignItems: "center",
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
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  backgroundColor: "white",
  padding: 20,
  borderRadius: 10,
  elevation: 5,
  width: "80%",
  height: 260,
}

const $textInput: TextStyle = {
  flex: 1,
  textAlignVertical: "top",
}
