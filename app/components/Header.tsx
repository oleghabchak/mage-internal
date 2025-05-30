import React, { ReactElement, useCallback } from "react"
import {
  GestureResponderEvent,
  StyleProp,
  TextStyle,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native"
import { translate } from "../i18n"
import { colors, spacing } from "../theme"
import { ExtendedEdge, useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"
import { Icon, IconTypes } from "./Icon"
import { Text, TextProps } from "./Text"
import { BackButton } from "./BackButton"
import AvatarThumb from "./AvatarThumb"
import { useNavigation, useRoute } from "@react-navigation/native"
import { useStores } from "app/models"
import { observer } from "mobx-react-lite"

export interface HeaderProps {
  /**
   * The layout of the title relative to the action components.
   * - `center` will force the title to always be centered relative to the header. If the title or the action buttons are too long, the title will be cut off.
   * - `flex` will attempt to center the title relative to the action buttons. If the action buttons are different widths, the title will be off-center relative to the header.
   */
  titleMode?: "center" | "flex"
  /**
   * Optional title style override.
   */
  titleStyle?: StyleProp<TextStyle>
  /**
   * Optional outer title container style override.
   */
  titleContainerStyle?: StyleProp<ViewStyle>
  subtitleContainerStyle?: StyleProp<ViewStyle>
  /**
   * Optional inner header wrapper style override.
   */
  style?: StyleProp<ViewStyle>
  /**
   * Optional outer header container style override.
   */
  containerStyle?: StyleProp<ViewStyle>
  /**
   * Background color
   */
  backgroundColor?: string
  /**
   * Title text to display if not using `tx` or nested components.
   */
  title?: TextProps["text"]
  /**
   * Title text which is looked up via i18n.
   */
  titleTx?: TextProps["tx"]
  /**
   * Optional options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  titleTxOptions?: TextProps["txOptions"]

  subtitle?: TextProps["text"]
  /**
   * Title text which is looked up via i18n.
   */
  subtitleTx?: TextProps["tx"]
  /**
   * Optional options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  subtitleTxOptions?: TextProps["txOptions"]
  subtitleStyle?: StyleProp<TextStyle>
  hideBackBtn?: boolean
  hideRightIcon?: boolean

  /**
   * Icon that should appear on the left.
   * Can be used with `onLeftPress`.
   */
  leftIcon?: IconTypes
  /**
   * An optional tint color for the left icon
   */
  leftIconColor?: string
  /**
   * Left action text to display if not using `leftTx`.
   * Can be used with `onLeftPress`. Overrides `leftIcon`.
   */
  leftText?: TextProps["text"]
  /**
   * Left action text text which is looked up via i18n.
   * Can be used with `onLeftPress`. Overrides `leftIcon`.
   */
  leftTx?: TextProps["tx"]
  /**
   * Left action custom ReactElement if the built in action props don't suffice.
   * Overrides `leftIcon`, `leftTx` and `leftText`.
   */
  LeftActionComponent?: ReactElement
  /**
   * Optional options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  leftTxOptions?: TextProps["txOptions"]
  /**
   * What happens when you press the left icon or text action.
   */
  onLeftPress?: TouchableOpacityProps["onPress"]
  /**
   * Icon that should appear on the right.
   * Can be used with `onRightPress`.
   */
  rightIcon?: IconTypes
  /**
   * An optional tint color for the right icon
   */
  rightIconColor?: string
  /**
   * Right action text to display if not using `rightTx`.
   * Can be used with `onRightPress`. Overrides `rightIcon`.
   */
  rightText?: TextProps["text"]
  /**
   * Right action text text which is looked up via i18n.
   * Can be used with `onRightPress`. Overrides `rightIcon`.
   */
  rightTx?: TextProps["tx"]
  /**
   * Right action custom ReactElement if the built in action props don't suffice.
   * Overrides `rightIcon`, `rightTx` and `rightText`.
   */
  RightActionComponent?: ReactElement
  /**
   * Optional options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  rightTxOptions?: TextProps["txOptions"]
  /**
   * What happens when you press the right icon or text action.
   */
  onRightPress?: TouchableOpacityProps["onPress"]
  /**
   * Override the default edges for the safe area.
   */
  safeAreaEdges?: ExtendedEdge[]
}

interface HeaderActionProps {
  backgroundColor?: string
  icon?: IconTypes
  iconColor?: string
  text?: TextProps["text"]
  tx?: TextProps["tx"]
  txOptions?: TextProps["txOptions"]
  onPress?: TouchableOpacityProps["onPress"]
  ActionComponent?: ReactElement
}

/**
 * Header that appears on many screens. Will hold navigation buttons and screen title.
 * The Header is meant to be used with the `screenOptions.header` option on navigators, routes, or screen components via `navigation.setOptions({ header })`.
 * @see [Documentation and Examples]{@link https://docs.infinite.red/ignite-cli/boilerplate/components/Header/}
 * @param {HeaderProps} props - The props for the `Header` component.
 * @returns {JSX.Element} The rendered `Header` component.
 */
export const Header: React.FC = observer(function (props: HeaderProps) {
  const {
    hideBackBtn = false,
    hideRightIcon = false,
    onRightPress,
    rightIcon,
    rightIconColor,
    RightActionComponent,
    backgroundColor = colors.background,
    safeAreaEdges = ["top"],
    title,
    titleTx,
    titleTxOptions,
    titleContainerStyle: $titleContainerStyleOverride,
    subtitle,
    subtitleTx,
    subtitleTxOptions,
    subtitleStyle,
    subtitleContainerStyle: $subtitleContainerStyleOverride,
    style: $styleOverride,
    titleStyle: $titleStyleOverride,
    containerStyle: $containerStyleOverride,
  } = props
  const $containerInsets = useSafeAreaInsetsStyle(safeAreaEdges)
  const titleContent = titleTx ? translate(titleTx, titleTxOptions) : title
  const subtitleContent = subtitleTx ? translate(subtitleTx, subtitleTxOptions) : subtitle
  const navigation = useNavigation()
  const route = useRoute()
  const {
    authenticationStore: { returnScreen, setReturnScreen, resetReturnScreen },
  } = useStores()

  const goBack = () => {
    if (returnScreen) {
      navigation.navigate(returnScreen as never)
      resetReturnScreen()
    } else {
      navigation.canGoBack() ? navigation.goBack() : navigation.navigate("HomeScreen" as never)
    }
  }

  const handleRightPress = useCallback(async (event: GestureResponderEvent) => {
    await navigation.navigate("SettingsTab" as never)

    setTimeout(() => {
      navigation.navigate("EditProfile" as never)
    }, 200)

    setReturnScreen(route.name)
    onRightPress && onRightPress(event)
  }, [])

  return (
    <View style={[$container, $containerInsets, { backgroundColor }, $containerStyleOverride]}>
      <View style={[$wrapper, $styleOverride]}>
        {!hideBackBtn ? <BackButton preset="outlined" onPress={goBack} /> : <View />}

        {!!titleContent && (
          <View style={[$titleWrapper, $titleContainerStyleOverride]} pointerEvents="none">
            <Text
              weight="bold"
              size="xxl"
              text={titleContent}
              style={[$title, $titleStyleOverride]}
            />
            <Text size="xxs" text={subtitleContent} style={[$subtitle, subtitleStyle]} />
          </View>
        )}
        {!!subtitleContent && (
          <View style={[$subtitleWrapper, $subtitleContainerStyleOverride]}></View>
        )}

        {!hideRightIcon && (
          <HeaderAction
            icon={rightIcon}
            iconColor={rightIconColor}
            onPress={handleRightPress}
            backgroundColor={backgroundColor}
            ActionComponent={RightActionComponent}
          />
        )}
      </View>
    </View>
  )
})

/**
 * @param {HeaderActionProps} props - The props for the `HeaderAction` component.
 * @returns {JSX.Element} The rendered `HeaderAction` component.
 */
const HeaderAction: React.FC = observer(function (props: HeaderActionProps) {
  const { backgroundColor, icon, onPress, ActionComponent, iconColor } = props
  const {
    authenticationStore: { photo },
  } = useStores()
  if (ActionComponent) return ActionComponent

  if (icon) {
    return (
      <Icon
        size={24}
        icon={icon}
        color={iconColor}
        onPress={onPress}
        containerStyle={[$actionIconContainer, { backgroundColor }]}
      />
    )
  }

  return <AvatarThumb image={photo} onPress={onPress} />
})

const $wrapper: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  alignContent: "flex-start",
  height: 60,
  marginHorizontal: spacing.ml,
}

const $container: ViewStyle = {
  width: "100%",
}

const $title: TextStyle = {
  textAlign: "center",
}
const $subtitle: TextStyle = {
  marginTop: spacing.xs,
  textAlign: "center",
  fontSize: 17,
  color: colors.palette.grey4,
}

const $actionIconContainer: ViewStyle = {
  flexGrow: 0,
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  paddingHorizontal: spacing.ml,
  zIndex: 2,
}

const $titleWrapper: ViewStyle = {
  alignItems: "flex-start",
  justifyContent: "center",
  height: "100%",
  width: "100%",
  position: "absolute",
  zIndex: 1,
}
const $subtitleWrapper: ViewStyle = {
  justifyContent: "center",
  height: "100%",
  position: "absolute",
  paddingTop: spacing.xxl,
  zIndex: 1,
}

// const $backBtn: ViewStyle = {
//   borderWidth: 3,
//   borderColor: colors.palette.turquoise,
//   backgroundColor: "transparent",
// }
