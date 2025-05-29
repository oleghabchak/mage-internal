import { spacing } from "app/theme"
import React from "react"
import { TextInput, TextStyle, View, ViewStyle } from "react-native"

interface BottomPopupInputProps {
  content: string
}

export const BottomPopupInput: React.FC<BottomPopupInputProps> = ({ content }) => {
  return (
    <View style={$contentWrapper}>
      <TextInput
        multiline={true}
        value={content}
        placeholder="Put note that has been written by the coach here..."
        autoCapitalize="none"
        autoComplete="additional-name"
        keyboardType="email-address"
        autoCorrect={false}
        style={$input}
        editable={false}
      />
    </View>
  )
}

const $contentWrapper: ViewStyle = {
  padding: spacing.ml,
}

const $input: TextStyle = {
  textAlign: "center",
}
