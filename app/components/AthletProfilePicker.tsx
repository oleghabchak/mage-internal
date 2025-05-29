import React from "react"
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native"
import { Text } from "./Text"
import { typography, colors } from "app/theme"
import SelectDropdown from "react-native-select-dropdown"
import { Icon } from "./Icon"
import { useTheme } from "@react-navigation/native"
import { ColorsInterface } from "app/theme/colorsInterface"

interface AthletProfilePickerProps {
  title: string
  data: any
  preset?: string
  defaultValue?: any
  onSelect: (arg: any) => void
  containerStyle?: ViewStyle
  sliceSelector?: number
}

const AthletProfilePicker: React.FC<AthletProfilePickerProps> = ({
  title,
  data,
  onSelect,
  defaultValue,
  preset,
  sliceSelector = 0,
}) => {
  const { colors: themeColors } = useTheme() as ColorsInterface
  return (
    <View style={$fieldWrapper}>
      <View style={$titleWrapper}>
        <Text style={[$inputTitle, { color: themeColors.text }]}>{title}</Text>
      </View>
      <View style={$fieldInputContainer}>
        <SelectDropdown
          data={data.slice(sliceSelector)}
          defaultValue={defaultValue}
          onSelect={(selectedItem) => {
            onSelect(selectedItem || [])
          }}
          defaultButtonText={data?.[0]?.title}
          buttonTextAfterSelection={(selectedItem) => selectedItem.title}
          rowTextForSelection={(item) => item.title}
          buttonStyle={[
            styles.dropdownBtnStyle,
            preset === "grey" && {
              backgroundColor: colors.palette.grey2,
              borderColor: colors.palette.grey2,
            },
            { backgroundColor: themeColors.background },
          ]}
          buttonTextStyle={[styles.dropdownBtnTxtStyle, { color: themeColors.text }]}
          renderDropdownIcon={(isOpened) => (
            <Icon
              icon="slimCaret"
              style={isOpened && { transform: [{ rotate: "180deg" }] }}
              color={colors.palette.grey3}
            />
          )}
          dropdownIconPosition={"right"}
          dropdownStyle={styles.dropdownDropdownStyle}
          rowStyle={[styles.dropdownRowStyle, { backgroundColor: themeColors.background }]}
          rowTextStyle={[styles.dropdownRowTxtStyle, { color: themeColors.text }]}
        />
      </View>
    </View>
  )
}

export default AthletProfilePicker

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

const $fieldInputContainer: ViewStyle = { flex: 2 }

const styles = StyleSheet.create({
  dropdownBtnStyle: {
    backgroundColor: colors.palette.white,
    borderColor: colors.palette.neutral300,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    height: 32,
    width: "100%",
  },
  dropdownBtnTxtStyle: { color: colors.palette.black, fontSize: 16, textAlign: "left" },
  dropdownDropdownStyle: { backgroundColor: colors.palette.neutral200, borderRadius: 8 },
  dropdownRowStyle: {
    backgroundColor: colors.palette.neutral200,
    height: 50,
  },
  dropdownRowTxtStyle: { color: colors.palette.black, fontSize: 16, textAlign: "left" },
})
