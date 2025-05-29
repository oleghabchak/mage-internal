import * as React from "react"
import { ComponentType } from "react"
import {
  Image,
  ImageStyle,
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
  ViewStyle,
} from "react-native"

export type IconTypes = keyof typeof iconRegistry

interface IconProps extends TouchableOpacityProps {
  /**
   * The name of the icon
   */
  icon: IconTypes

  /**
   * An optional tint color for the icon
   */
  color?: string

  /**
   * An optional size for the icon. If not provided, the icon will be sized to the icon's resolution.
   */
  size?: number

  /**
   * Style overrides for the icon image
   */
  style?: StyleProp<ImageStyle>

  /**
   * Style overrides for the icon container
   */
  containerStyle?: StyleProp<ViewStyle>

  /**
   * An optional function to be called when the icon is pressed
   */
  onPress?: TouchableOpacityProps["onPress"]
}

/**
 * A component to render a registered icon.
 * It is wrapped in a <TouchableOpacity /> if `onPress` is provided, otherwise a <View />.
 * @see [Documentation and Examples]{@link https://docs.infinite.red/ignite-cli/boilerplate/components/Icon/}
 * @param {IconProps} props - The props for the `Icon` component.
 * @returns {JSX.Element} The rendered `Icon` component.
 */
export function Icon(props: IconProps) {
  const {
    icon,
    color,
    size,
    style: $imageStyleOverride,
    containerStyle: $containerStyleOverride,
    ...WrapperProps
  } = props

  const isPressable = !!WrapperProps.onPress
  const Wrapper = (WrapperProps?.onPress ? TouchableOpacity : View) as ComponentType<
    TouchableOpacityProps | ViewProps
  >

  const $imageStyle: StyleProp<ImageStyle> = [
    $imageStyleBase,
    color !== undefined && { tintColor: color },
    size !== undefined && { width: size, height: size },
    $imageStyleOverride,
  ]

  return (
    <Wrapper
      accessibilityRole={isPressable ? "imagebutton" : undefined}
      {...WrapperProps}
      style={$containerStyleOverride}
    >
      <Image style={$imageStyle} source={iconRegistry[icon]} />
    </Wrapper>
  )
}

export const iconRegistry = {
  home: require("../../assets/icons/home.png"),
  exercise: require("../../assets/icons/exercise.png"),
  chat: require("../../assets/icons/chat.png"),
  line: require("../../assets/icons/line.png"),
  back: require("../../assets/icons/back.png"),
  left: require("../../assets/icons/left.png"),
  right: require("../../assets/icons/right.png"),
  bell: require("../../assets/icons/bell.png"),
  caretLeft: require("../../assets/icons/caretLeft.png"),
  close: require("../../assets/icons/close.png"),
  caretRight: require("../../assets/icons/caretRight.png"),
  check: require("../../assets/icons/check.png"),
  clap: require("../../assets/icons/demo/clap.png"),
  community: require("../../assets/icons/demo/community.png"),
  components: require("../../assets/icons/demo/components.png"),
  debug: require("../../assets/icons/demo/debug.png"),
  github: require("../../assets/icons/demo/github.png"),
  heart: require("../../assets/icons/demo/heart.png"),
  hidden: require("../../assets/icons/hidden.png"),
  ladybug: require("../../assets/icons/ladybug.png"),
  lock: require("../../assets/icons/lock.png"),
  menu: require("../../assets/icons/menu.png"),
  more: require("../../assets/icons/more.png"),
  pin: require("../../assets/icons/demo/pin.png"),
  podcast: require("../../assets/icons/demo/podcast.png"),
  settings: require("../../assets/icons/settings.png"),
  slack: require("../../assets/icons/demo/slack.png"),
  view: require("../../assets/icons/view.png"),
  x: require("../../assets/icons/x.png"),
  down: require("../../assets/icons/down.png"),
  profile: require("../../assets/icons/profile.png"),
  flag: require("../../assets/icons/flag.png"),
  logout: require("../../assets/icons/logout.png"),
  people: require("../../assets/icons/people.png"),
  camera: require("../../assets/icons/camera.png"),
  video: require("../../assets/icons/video.png"),
  information: require("../../assets/icons/information.png"),
  watch: require("../../assets/icons/watch.png"),
  rm: require("../../assets/icons/1RM.png"),
  info: require("../../assets/icons/info.png"),
  documentation: require("../../assets/icons/documentation.png"),
  progress: require("../../assets/icons/progress.png"),
  rightArrow: require("../../assets/icons/rightArrow.png"),
  search: require("../../assets/icons/search.png"),
  bigRightArrow: require("../../assets/icons/bigRightArrow.png"),
  searchNormal: require("../../assets/icons/searchNormal.png"),
  blockCaret: require("../../assets/icons/blockCaret.png"),
  insurance: require("../../assets/icons/insurance.png"),
  delete: require("../../assets/icons/delete.png"),
  slimCaret: require("../../assets/icons/slimCaret.png"),
  appIcon: require("../../assets/icons/appIcon.png"),
}

const $imageStyleBase: ImageStyle = {
  resizeMode: "contain",
}
