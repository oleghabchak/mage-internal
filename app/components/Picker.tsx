import React from "react"
import { StyleSheet, View, ViewStyle } from "react-native"
import SelectDropdown from "react-native-select-dropdown"
import { colors, typography } from "app/theme"
import { Text } from "./Text"
import { TxKeyPath } from "app/i18n"
import { Icon } from "./Icon"

interface Props {
  title?: TxKeyPath
  subtitle?: TxKeyPath
  data: any
  preset?: string
  defaultValue?: any
  onSelect: (arg: any) => void
  containerStyle?: ViewStyle
  sliceSelector?: number
  status?: "error" | "disabled"
}

const Dropdown: React.FC<Props> = ({
  title,
  subtitle,
  data,
  onSelect,
  containerStyle,
  defaultValue,
  preset,
  sliceSelector = 0,
  status,
}) => {
  return (
    <View style={containerStyle}>
      {title && (
        <Text
          testID="welcome-heading"
          style={[styles.title, status === "error" && { color: colors.error }]}
          tx={title}
          preset="heading"
          size="xl"
        />
      )}
      {subtitle && (
        <Text
          style={[styles.subtitle, preset === "grey" && { color: colors.palette.black }]}
          size="sm"
          tx={subtitle}
          preset="subheading"
        />
      )}
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
          status === "error" && {
            borderColor: colors.error,
          },
        ]}
        buttonTextStyle={styles.dropdownBtnTxtStyle}
        renderDropdownIcon={(isOpened) => (
          <Icon icon="slimCaret" style={isOpened && { transform: [{ rotate: "180deg" }] }} />
        )}
        dropdownIconPosition={"right"}
        dropdownStyle={styles.dropdownDropdownStyle}
        rowStyle={styles.dropdownRowStyle}
        rowTextStyle={styles.dropdownRowTxtStyle}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  dropdownBtnStyle: {
    backgroundColor: colors.palette.white,
    borderColor: colors.palette.white,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    height: 50,
    width: "100%",
  },
  dropdownBtnTxtStyle: { color: colors.palette.black, fontSize: 16, textAlign: "left" },
  dropdownDropdownStyle: { backgroundColor: colors.palette.neutral200, borderRadius: 8 },
  dropdownRowStyle: {
    backgroundColor: colors.palette.neutral200,
    height: 50,
  },
  dropdownRowTxtStyle: { color: colors.palette.black, fontSize: 16, textAlign: "left" },
  subtitle: {
    color: colors.palette.white,
    fontFamily: typography.fonts.manrope.semiBold,
    fontSize: 12,
    lineHeight: 25,
    width: "90%",
  },
  title: {
    color: colors.palette.white,
    fontFamily: typography.fonts.manrope.medium,
    fontSize: 20,
    lineHeight: 25,
  },
})

export default Dropdown
