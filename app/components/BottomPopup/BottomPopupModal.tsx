import { colors, spacing, typography } from "app/theme"
import React, { useState } from "react"
import { ActivityIndicator, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { TextField } from "../TextField"
import { useTheme } from "@react-navigation/native"
import { ColorsInterface } from "app/theme/colorsInterface"

interface BottomPopupModalProps {
  initialAbility?: number | string | null
  onClose: () => void
  onSubmit: (arg: string | number) => void
  isLoading?: boolean
}

export const BottomPopupModal: React.FC<BottomPopupModalProps> = ({
  initialAbility,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [value, setValue] = useState<string>("")

  const handleSubmit = () => {
    if (value && initialAbility !== +value) {
      onSubmit(value)
    }
    onClose()
  }

  const { colors: themeColors } = useTheme() as ColorsInterface
  return (
    <View style={$container}>
      <View style={$contentContainer}>
        <View>
          <Text style={[$text, { color: themeColors.text }]}>Alter the 1Rm you want to use. </Text>
          <Text
            style={[$text, { color: themeColors.text }]}
          >{`Your current recorded is ${initialAbility}kg`}</Text>
        </View>
        <TextField
          value={value.toString()}
          onChangeText={(text) => setValue(text)}
          autoCapitalize="none"
          inputWrapperStyle={{
            backgroundColor: themeColors.background,
            borderColor: themeColors.border,
          }}
          inputTextStyle={{ color: themeColors.text }}
          autoComplete="password"
          containerStyle={$textFieldContainer}
          keyboardType="numeric"
          autoCorrect={false}
          returnKeyType="done"
        />
      </View>
      <View style={$buttonsContainer}>
        <TouchableOpacity
          style={[$button, $leftButton]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <View>
              <ActivityIndicator size={"small"} color={colors.palette.primary} />
            </View>
          ) : (
            <Text style={[$buttonText, { color: themeColors.primary }]}>OK</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={$button} onPress={onClose}>
          <Text style={[$buttonText, { color: themeColors.primary }]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const $container: ViewStyle = { flex: 1, justifyContent: "space-between" }

const $contentContainer: ViewStyle = {
  flex: 1,
  alignItems: "center",
  justifyContent: "space-evenly",
}

const $textFieldContainer: ViewStyle = { width: "90%" }

const $border: ViewStyle = {
  borderColor: colors.palette.white,
}

const $button: ViewStyle = {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  paddingVertical: 8,
}

const $leftButton: ViewStyle = {
  ...$border,
  borderRightWidth: 1,
}

const $buttonText: TextStyle = {
  color: colors.palette.primary,
  fontFamily: typography.fonts.manrope.medium,
  fontSize: 16,
}

const $buttonsContainer: ViewStyle = {
  flexDirection: "row",
  borderTopWidth: 1,
  ...$border,
}

const $text: TextStyle = {
  fontFamily: typography.fonts.manrope.normal,
  lineHeight: spacing.lg,
  fontSize: 14,
}
