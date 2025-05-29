/* eslint-disable react-native/no-inline-styles */
import React, { ComponentType } from "react"
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  PressableStateCallbackType,
  StyleProp,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import { colors, spacing, typography } from "../theme"
import { Text, TextProps } from "./Text"

type Presets = keyof typeof $viewPresets

export interface ButtonAccessoryProps {
  style: StyleProp<any>
  pressableState: PressableStateCallbackType
  disabled?: boolean
  outlined?: boolean
}

export interface ButtonProps extends PressableProps {
  /**
   * Text which is looked up via i18n.
   */
  tx?: TextProps["tx"]
  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: TextProps["text"]
  /**
   * Optional options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  txOptions?: TextProps["txOptions"]
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  /**
   * An optional style override for the "pressed" state.
   */
  pressedStyle?: StyleProp<ViewStyle>
  /**
   * An optional style override for the button text.
   */
  textStyle?: StyleProp<TextStyle>
  /**
   * An optional style override for the button text when in the "pressed" state.
   */
  pressedTextStyle?: StyleProp<TextStyle>
  /**
   * An optional style override for the button text when in the "disabled" state.
   */
  disabledTextStyle?: StyleProp<TextStyle>
  /**
   * One of the different types of button presets.
   */
  preset?: Presets
  /**
   * An optional component to render on the right side of the text.
   * Example: `RightAccessory={(props) => <View {...props} />}`
   */
  RightAccessory?: ComponentType<ButtonAccessoryProps>
  /**
   * An optional component to render on the left side of the text.
   * Example: `LeftAccessory={(props) => <View {...props} />}`
   */
  LeftAccessory?: ComponentType<ButtonAccessoryProps>
  /**
   * Children components.
   */
  children?: React.ReactNode
  /**
   * disabled prop, accessed directly for declarative styling reasons.
   * https://reactnative.dev/docs/pressable#disabled
   */
  disabled?: boolean
  /**
   * An optional style override for the disabled state
   */
  disabledStyle?: StyleProp<ViewStyle>
  /**
   * Custom styles
   */
  isActive?: boolean
  shadow?: boolean
  isLoading?: boolean
}

/**
 * A component that allows users to take actions and make choices.
 * Wraps the Text component with a Pressable component.
 * @see [Documentation and Examples]{@link https://docs.infinite.red/ignite-cli/boilerplate/components/Button/}
 * @param {ButtonProps} props - The props for the `Button` component.
 * @returns {JSX.Element} The rendered `Button` component.
 * @example
 * <Button
 *   tx="common.ok"
 *   style={styles.button}
 *   textStyle={styles.buttonText}
 *   onPress={handleButtonPress}
 * />
 */
export function Button(props: ButtonProps) {
  const {
    tx,
    text,
    txOptions,
    style: $viewStyleOverride,
    pressedStyle: $pressedViewStyleOverride,
    textStyle: $textStyleOverride,
    pressedTextStyle: $pressedTextStyleOverride,
    disabledTextStyle: $disabledTextStyleOverride,
    children,
    RightAccessory,
    LeftAccessory,
    disabled,
    disabledStyle: $disabledViewStyleOverride,
    isActive,
    shadow,
    isLoading,
    ...rest
  } = props

  const preset: Presets = props.preset ?? "default"
  /**
   * @param {PressableStateCallbackType} root0 - The root object containing the pressed state.
   * @param {boolean} root0.pressed - The pressed state.
   * @returns {StyleProp<ViewStyle>} The view style based on the pressed state.
   */
  function $viewStyle({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> {
    return [
      $viewPresets[preset],
      $viewStyleOverride,
      !!pressed && [$pressedViewPresets[preset], $pressedViewStyleOverride],
      !!disabled && $disabledViewStyleOverride,
      !!isActive && $activeViewPresets[preset],
    ]
  }

  function $loaderColor() {
    return $loaderColorsPresets[preset]
  }
  /**
   * @param {PressableStateCallbackType} root0 - The root object containing the pressed state.
   * @param {boolean} root0.pressed - The pressed state.
   * @returns {StyleProp<TextStyle>} The text style based on the pressed state.
   */
  function $textStyle({ pressed }: PressableStateCallbackType): StyleProp<TextStyle> {
    return [
      $textPresets[preset],
      $textStyleOverride,
      !!pressed && [$pressedTextPresets[preset], $pressedTextStyleOverride],
      !!disabled && $disabledTextStyleOverride,
      !!isActive && $activeTextPresets[preset],
    ]
  }

  return (
    <View
      style={
        shadow && {
          shadowColor: colors.palette.grey4,
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.37,
          shadowRadius: 3.05,
          elevation: 4,
        }
      }
    >
      <Pressable
        style={$viewStyle}
        accessibilityRole="button"
        accessibilityState={{ disabled: !!disabled }}
        {...rest}
        disabled={disabled}
      >
        {(state) => (
          <>
            {!!LeftAccessory && (
              <LeftAccessory
                style={$leftAccessoryStyle}
                pressableState={state}
                disabled={disabled}
              />
            )}

            {isLoading ? (
              <View>
                <ActivityIndicator size={"large"} color={$loaderColor()} />
              </View>
            ) : (
              <Text tx={tx} text={text} txOptions={txOptions} style={$textStyle(state)}>
                {children}
              </Text>
            )}

            {!!RightAccessory && (
              <RightAccessory
                style={$rightAccessoryStyle}
                pressableState={state}
                disabled={disabled}
              />
            )}
          </>
        )}
      </Pressable>
    </View>
  )
}

const $baseViewStyle: ViewStyle = {
  height: 52,
  borderRadius: 8,
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "row",
  paddingVertical: spacing.sm,
  paddingHorizontal: spacing.sm,
  overflow: "hidden",
}

const $baseTextStyle: TextStyle = {
  fontSize: 16,
  lineHeight: 20,
  fontFamily: typography.primary.medium,
  textAlign: "center",
  flexShrink: 1,
  flexGrow: 0,
  zIndex: 2,
}

const $rightAccessoryStyle: ViewStyle = { marginStart: spacing.xs, zIndex: 1 }
const $leftAccessoryStyle: ViewStyle = { marginEnd: spacing.xs, zIndex: 1 }

const $viewPresets = {
  default: [
    $baseViewStyle,
    {
      borderWidth: 1,
      borderColor: colors.palette.primary,
      backgroundColor: colors.palette.primary,
    },
  ] as StyleProp<ViewStyle>,

  outlined: [
    $baseViewStyle,
    {
      borderWidth: 2,
      borderColor: colors.palette.turquoise,
    },
  ] as StyleProp<ViewStyle>,

  reversed: [
    $baseViewStyle,
    { backgroundColor: colors.palette.lightYellow },
  ] as StyleProp<ViewStyle>,
  custom: [$baseViewStyle, { backgroundColor: colors.palette.white }] as StyleProp<ViewStyle>,
  grey: [$baseViewStyle, { backgroundColor: colors.palette.grey2 }] as StyleProp<ViewStyle>,
}

const $loaderColorsPresets = {
  default: colors.palette.secondary100,
  outlined: colors.palette.turquoise,
  reversed: colors.palette.primary,
  custom: "orange",
  grey: colors.palette.primary,
}

const $textPresets: Record<Presets, StyleProp<TextStyle>> = {
  default: [$baseTextStyle, { color: colors.palette.white }],
  outlined: [$baseTextStyle, { color: colors.palette.turquoise }],
  reversed: [$baseTextStyle, { color: colors.palette.primary }],
  custom: [$baseTextStyle, { color: colors.palette.black, fontSize: 20, lineHeight: 24 }],
  grey: [$baseTextStyle, { color: colors.palette.primary }],
}

const $pressedViewPresets: Record<Presets, StyleProp<ViewStyle>> = {
  default: { opacity: 0.9 },
  outlined: { opacity: 0.7 },
  reversed: { opacity: 0.5 },
  custom: { opacity: 0.5 },
  grey: { opacity: 0.5 },
}

const $pressedTextPresets: Record<Presets, StyleProp<TextStyle>> = {
  default: { opacity: 0.9 },
  outlined: { opacity: 0.9 },
  reversed: { opacity: 0.9 },
  custom: { opacity: 0.9 },
  grey: { opacity: 0.9 },
}

const $activeViewPresets: Record<Presets, StyleProp<ViewStyle>> = {
  default: { backgroundColor: colors.palette.turquoise },
  outlined: { backgroundColor: "blue" },
  reversed: { backgroundColor: colors.palette.primary },
  custom: { backgroundColor: colors.palette.turquoise },
  grey: { backgroundColor: colors.palette.primary },
}

const $activeTextPresets: Record<Presets, StyleProp<TextStyle>> = {
  default: { color: colors.palette.primary },
  outlined: { color: colors.palette.black },
  reversed: { color: "yellow" },
  custom: { color: colors.palette.primary },
  grey: { color: "yellow" },
}
