import { colors, typography } from "app/theme"
import React from "react"
import { KeyboardTypeOptions, Text, TextStyle, View, ViewStyle } from "react-native"
import { TextField } from "./TextField"
import { useTheme } from "@react-navigation/native"
import { ColorsInterface } from "app/theme/colorsInterface"

interface Props {
  title: string
  value: string | number
  setValue?: (arg: string) => void
  keyboardType?: KeyboardTypeOptions
  editable?: boolean
}

export const AthletProfileTextField: React.FC<Props> = ({
  title,
  value,
  setValue,
  keyboardType,
  editable,
}) => {
  const { colors } = useTheme() as ColorsInterface
  return (
    <View style={$fieldWrapper}>
      <View style={$titleWrapper}>
        <Text style={[$inputTitle, { color: colors.text }]}>{title}</Text>
      </View>
      <View style={$fieldInputContainer}>
        <TextField
          editable={editable}
          value={value.toString()}
          onChangeText={setValue}
          inputWrapperStyle={$fieldInputWrapper}
          LabelTextProps={{
            preset: "bold",
          }}
          style={$fieldInput}
          keyboardType={keyboardType}
          inputTextStyle={{ color: colors.text }}
        />
      </View>
    </View>
  )
}

const $inputTitle: TextStyle = {
  fontFamily: typography.primary.normal,
  textTransform: "capitalize",
  fontSize: 18,
}

const $titleWrapper: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "flex-start",
}

const $fieldWrapper: ViewStyle = {
  flex: 1,
  flexDirection: "row",
}

const $fieldInputWrapper: ViewStyle = {
  backgroundColor: "transparent",
  borderColor: colors.palette.neutral300,
  height: 32,
  borderRadius: 6,
  alignItems: "center",
}

const $fieldInputContainer: ViewStyle = { flex: 2 }
const $fieldInput: ViewStyle = { marginVertical: 0 }
