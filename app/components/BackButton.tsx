import React, { ComponentType } from "react"
import {
  Pressable,
  PressableProps,
  PressableStateCallbackType,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native"
import { colors, spacing, typography } from "../theme"
import { TextProps } from "./Text"
import { Icon } from "./Icon"
import { ColorsInterface } from "app/theme/colorsInterface"
import { useTheme } from "@react-navigation/native"

type Presets = keyof typeof $viewPresets

export interface BackButtonAccessoryProps {
  style: StyleProp<any>
  pressableState: PressableStateCallbackType
  disabled?: boolean
  outlined?: boolean
}

export interface BackButtonProps extends PressableProps {
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
  RightAccessory?: ComponentType<BackButtonAccessoryProps>
  /**
   * An optional component to render on the left side of the text.
   * Example: `LeftAccessory={(props) => <View {...props} />}`
   */
  LeftAccessory?: ComponentType<BackButtonAccessoryProps>
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
}

/**
 * A component that allows users to take actions and make choices.
 * Wraps the Text component with a Pressable component.
 * @see [Documentation and Examples]{@link https://docs.infinite.red/ignite-cli/boilerplate/components/Button/}
 * @param {BackButtonProps} props - The props for the `BackButton` component.
 * @returns {JSX.Element} The rendered `BackButton` component.
 * @example
 * <BackButton
 *   tx="common.ok"
 *   style={styles.button}
 *   textStyle={styles.buttonText}
 *   onPress={handleBackButtonPress}
 * />
 */
export function BackButton(props: BackButtonProps) {
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
    ...rest
  } = props

  const preset: Presets = props.preset ?? "default"
  /**
   * @param {PressableStateCallbackType} root0 - The root object containing the pressed state.
   * @param {boolean} root0.pressed - The pressed state.
   * @returns {StyleProp<ViewStyle>} The view style based on the pressed state.
   */
  const { colors: themeColors } = useTheme() as ColorsInterface

  function $viewStyle({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> {
    return [
      $viewPresets[preset],
      $viewStyleOverride,
      { borderColor: themeColors.primary },
      !!pressed && [$pressedViewPresets[preset], $pressedViewStyleOverride],
      !!disabled && $disabledViewStyleOverride,
    ]
  }
  /**
   * @param {PressableStateCallbackType} root0 - The root object containing the pressed state.
   * @param {boolean} root0.pressed - The pressed state.
   * @returns {StyleProp<TextStyle>} The text style based on the pressed state.
   */
  function $textStyle() {
    return $textPresets[preset]
  }
  return (
    <Pressable
      style={$viewStyle}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      {...rest}
      disabled={disabled}
    >
      {(state) => (
        <>
          <Icon
            icon="back"
            style={{ borderColor: themeColors.primary }}
            containerStyle={$baseViewStyle}
            color={themeColors.primary}
          />
        </>
      )}
    </Pressable>
  )
}

const $baseViewStyle: ViewStyle = {
  height: 45,
  width: 45,
  borderRadius: 100,
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "row",
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
      backgroundColor: colors.palette.neutral100,
    },
  ] as StyleProp<ViewStyle>,

  outlined: [
    $baseViewStyle,
    {
      backgroundColor: colors.transparent,
      borderColor: colors.palette.turquoise,
      borderWidth: 2,
    },
  ] as StyleProp<ViewStyle>,

  reversed: [$baseViewStyle, { backgroundColor: colors.palette.primary }] as StyleProp<ViewStyle>,
}

const $textPresets = {
  default: colors.palette.turquoise,
  outlined: colors.palette.turquoise,
  reversed: colors.palette.white,
}

const $pressedViewPresets: Record<Presets, StyleProp<ViewStyle>> = {
  default: { opacity: 0.5 },
  outlined: { opacity: 0.5 },
  reversed: { opacity: 0.5 },
}

const $pressedTextPresets: Record<Presets, StyleProp<TextStyle>> = {
  default: { opacity: 0.9 },
  outlined: { opacity: 0.9 },
  reversed: { opacity: 0.9 },
}
