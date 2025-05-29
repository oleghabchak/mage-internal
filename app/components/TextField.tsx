import React, { ComponentType, forwardRef, Ref, useImperativeHandle, useRef } from "react"
import {
  StyleProp,
  TextInput,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"
import { isRTL, translate } from "../i18n"
import { colors, spacing, typography } from "../theme"
import { Text, TextProps } from "./Text"

type Presets = keyof typeof $viewPresets

export interface TextFieldAccessoryProps {
  style: StyleProp<any>
  status: TextFieldProps["status"]
  multiline: boolean
  editable: boolean
}

export interface TextFieldProps extends Omit<TextInputProps, "ref"> {
  /**
   * A style modifier for different input states.
   */
  status?: "error" | "disabled"
  /**
   * The label text to display if not using `labelTx`.
   */
  label?: TextProps["text"]
  /**
   * Label text which is looked up via i18n.
   */
  labelTx?: TextProps["tx"]

  preset?: Presets

  /**
   * Optional label options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  labelTxOptions?: TextProps["txOptions"]
  /**
   * Pass any additional props directly to the label Text component.
   */
  LabelTextProps?: TextProps
  /**
   * The helper text to display if not using `helperTx`.
   */
  helper?: TextProps["text"]
  /**
   * Helper text which is looked up via i18n.
   */
  helperTx?: TextProps["tx"]
  /**
   * Optional helper options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  helperTxOptions?: TextProps["txOptions"]
  /**
   * Pass any additional props directly to the helper Text component.
   */
  HelperTextProps?: TextProps
  /**
   * The placeholder text to display if not using `placeholderTx`.
   */
  placeholder?: TextProps["text"]
  /**
   * Placeholder text which is looked up via i18n.
   */
  placeholderTx?: TextProps["tx"]
  placeholderString?: string
  placeholderTxOptions?: TextProps["txOptions"]
  /**
   * Optional input style override.
   */
  style?: StyleProp<TextStyle>
  /**
   * Style overrides for the container
   */
  containerStyle?: StyleProp<ViewStyle>
  /**
   * Style overrides for the input wrapper
   */
  inputWrapperStyle?: StyleProp<ViewStyle>
  /**
   * An optional component to render on the right side of the input.
   * Example: `RightAccessory={(props) => <Icon icon="ladybug" containerStyle={props.style} color={props.editable ? colors.textDim : colors.text} />}`
   * Note: It is a good idea to memoize this.
   */
  RightAccessory?: ComponentType<TextFieldAccessoryProps>
  /**
   * An optional component to render on the left side of the input.
   * Example: `LeftAccessory={(props) => <Icon icon="ladybug" containerStyle={props.style} color={props.editable ? colors.textDim : colors.text} />}`
   * Note: It is a good idea to memoize this.
   */
  LeftAccessory?: ComponentType<TextFieldAccessoryProps>

  inputTextStyle?: TextStyle
}

export const TextField = forwardRef(function TextField(props: TextFieldProps, ref: Ref<TextInput>) {
  const {
    labelTx,
    label,
    labelTxOptions,
    placeholderTx,
    placeholderString,
    placeholderTxOptions,
    helper,
    helperTx,
    helperTxOptions,
    status,
    RightAccessory,
    LeftAccessory,
    HelperTextProps,
    LabelTextProps,
    style: $inputStyleOverride,
    containerStyle: $containerStyleOverride,
    inputTextStyle,
    inputWrapperStyle: $inputWrapperStyleOverride,
    ...TextInputProps
  } = props
  const input = useRef<TextInput>(null)

  const preset: Presets = props.preset ?? "default"
  /**
   * @param {PressableStateCallbackType} root0 - The root object containing the pressed state.
   * @param {boolean} root0.pressed - The pressed state.
   * @returns {StyleProp<ViewStyle>} The view style based on the pressed state.
   */
  // function $viewStyle({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> {
  //   return [
  //     $viewPresets[preset],
  //     // $viewStyleOverride,
  //     // !!pressed && [$pressedViewPresets[preset], $pressedViewStyleOverride],
  //     // !!disabled && $disabledViewStyleOverride,
  //   ]

  const disabled = TextInputProps.editable === false || status === "disabled"

  const placeholderContent = placeholderTx
    ? translate(placeholderTx, placeholderTxOptions)
    : placeholderString

  const $containerStyles = [$containerStyleOverride]

  const $labelStyles = [{ color: $textStyles[preset] }, $labelStyle, LabelTextProps?.style]

  const $inputWrapperStyles = [
    $inputWrapperStyle,
    $pressedStyles[preset],
    status === "error" && { borderColor: colors.error },
    TextInputProps.multiline && { minHeight: 112 },
    LeftAccessory && { paddingStart: 0 },
    RightAccessory && { paddingEnd: 3 },
    $inputWrapperStyleOverride,
  ]

  const $inputStyles: StyleProp<TextStyle> = [
    $inputStyle,
    disabled && { color: colors.textDim },
    isRTL && { textAlign: "right" as TextStyle["textAlign"] },
    TextInputProps.multiline && { height: "auto" },
    $inputStyleOverride,
  ]

  const $helperStyles = [
    $helperStyle,
    status === "error" && { color: colors.error },
    HelperTextProps?.style,
  ]

  /**
   *
   */
  function focusInput() {
    if (disabled) return

    input.current?.focus()
  }

  useImperativeHandle(ref, () => input.current as TextInput)

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={$containerStyles}
      onPress={focusInput}
      accessibilityState={{ disabled }}
    >
      {!!(label || labelTx) && (
        <Text
          preset="formLabel"
          text={label}
          tx={labelTx}
          txOptions={labelTxOptions}
          {...LabelTextProps}
          style={$labelStyles}
        />
      )}

      <View style={$inputWrapperStyles}>
        {!!LeftAccessory && (
          <LeftAccessory
            style={$leftAccessoryStyle}
            status={status}
            editable={!disabled}
            multiline={TextInputProps.multiline ?? false}
          />
        )}

        <TextInput
          ref={input}
          underlineColorAndroid={colors.transparent}
          textAlignVertical="top"
          placeholder={placeholderContent?.toString()}
          placeholderTextColor={
            status === "disabled" ? colors.palette.primary : $textStyles[preset]
          }
          {...TextInputProps}
          selectionColor={$textStyles[preset]}
          editable={!disabled}
          style={[$inputStyles, { color: $textStyles[preset] }, inputTextStyle]}
        />

        {!!RightAccessory && (
          <RightAccessory
            style={$rightAccessoryStyle}
            status={status}
            editable={!disabled}
            multiline={TextInputProps.multiline ?? false}
          />
        )}
      </View>

      {!!(helper || helperTx) && (
        <Text
          preset="formHelper"
          text={helper}
          tx={helperTx}
          txOptions={helperTxOptions}
          {...HelperTextProps}
          style={$helperStyles}
        />
      )}
    </TouchableOpacity>
  )
})

const $labelStyle: TextStyle = {
  color: colors.palette.white,
  fontFamily: typography.fonts.manrope.medium,
  fontSize: 12,
}

const $inputWrapperStyle: ViewStyle = {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  // alignItems: "flex-start",
  borderWidth: 1,
  borderRadius: 8,
  backgroundColor: colors.palette.white,
  borderColor: colors.palette.primary,
  overflow: "hidden",
  height: 50,
}

const $inputStyle: TextStyle = {
  flex: 1,
  alignSelf: "stretch",
  // height: 48,
  fontFamily: typography.primary.normal,
  color: colors.text,
  fontSize: 16,

  lineHeight: 20,
  justifyContent: "flex-start",
  paddingVertical: 2,
  paddingHorizontal: 0,
  marginVertical: spacing.xs,
  marginHorizontal: spacing.sm,
}

const $helperStyle: TextStyle = {
  fontSize: 12,
  marginBottom: -spacing.xs,
  // marginTop: spacing.xs,
}

const $rightAccessoryStyle: ViewStyle = {
  marginEnd: spacing.xs,
  height: 50,
  justifyContent: "center",
  alignItems: "center",
}
const $leftAccessoryStyle: ViewStyle = {
  marginStart: spacing.xs,
  height: 50,
  justifyContent: "center",
  alignItems: "center",
}
const $baseViewStyle: ViewStyle = {
  minHeight: 50,
  borderRadius: 8,
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "row",
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.sm,
  overflow: "hidden",
}

const $viewPresets = {
  default: [
    $baseViewStyle,
    {
      borderWidth: 1,
      borderColor: colors.palette.primary,
      backgroundColor: colors.palette.neutral100,
    },
  ] as StyleProp<ViewStyle>,

  outlined: [
    $baseViewStyle,
    {
      borderWidth: 1,
      borderColor: colors.palette.white,
    },
  ] as StyleProp<ViewStyle>,

  reversed: [$baseViewStyle, { backgroundColor: colors.palette.primary }] as StyleProp<ViewStyle>,
}

const $pressedStyles = {
  default: { backgroundColor: colors.palette.white, borderColor: colors.palette.white },
  outlined: { backgroundColor: colors.palette.white },
  reversed: { backgroundColor: colors.palette.primary, borderColor: colors.palette.primary },
}
const $textStyles = {
  default: colors.palette.black,
  outlined: colors.palette.primary,
  reversed: colors.palette.white,
}
