import React, { ComponentType, Fragment, ReactElement } from "react"
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
  ViewStyle,
} from "react-native"
import { colors, spacing } from "../theme"
import { Text, TextProps } from "./Text"

type Presets = keyof typeof $containerPresets

interface CardProps extends TouchableOpacityProps {
  /**
   * One of the different types of text presets.
   */
  preset?: Presets
  /**
   * How the content should be aligned vertically. This is especially (but not exclusively) useful
   * when the card is a fixed height but the content is dynamic.
   *
   * `top` (default) - aligns all content to the top.
   * `center` - aligns all content to the center.
   * `space-between` - spreads out the content evenly.
   * `force-footer-bottom` - aligns all content to the top, but forces the footer to the bottom.
   */
  verticalAlignment?: "top" | "center" | "space-between" | "force-footer-bottom"
  /**
   * Custom component added to the left of the card body.
   */
  LeftComponent?: ReactElement
  /**
   * Custom component added to the right of the card body.
   */
  RightComponent?: ReactElement
  /**
   * The heading text to display if not using `headingTx`.
   */
  heading?: TextProps["text"]
  /**
   * Heading text which is looked up via i18n.
   */
  headingTx?: TextProps["tx"]
  /**
   * Optional heading options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  headingTxOptions?: TextProps["txOptions"]
  /**
   * Style overrides for heading text.
   */
  headingStyle?: StyleProp<TextStyle>
  /**
   * Pass any additional props directly to the heading Text component.
   */
  HeadingTextProps?: TextProps
  /**
   * Custom heading component.
   * Overrides all other `heading*` props.
   */
  HeadingComponent?: ReactElement
  /**
   * The content text to display if not using `contentTx`.
   */
  content?: TextProps["text"]
  /**
   * Content text which is looked up via i18n.
   */
  contentTx?: TextProps["tx"]
  /**
   * Optional content options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  contentTxOptions?: TextProps["txOptions"]
  /**
   * Style overrides for content text.
   */
  contentStyle?: StyleProp<TextStyle>
  /**
   * Pass any additional props directly to the content Text component.
   */
  ContentTextProps?: TextProps
  /**
   * Custom content component.
   * Overrides all other `content*` props.
   */
  ContentComponent?: ReactElement
  /**
   * The footer text to display if not using `footerTx`.
   */
  footer?: TextProps["text"]
  /**
   * Footer text which is looked up via i18n.
   */
  footerTx?: TextProps["tx"]
  /**
   * Optional footer options to pass to i18n. Useful for interpolation
   * as well as explicitly setting locale or translation fallbacks.
   */
  footerTxOptions?: TextProps["txOptions"]
  /**
   * Style overrides for footer text.
   */
  footerStyle?: StyleProp<TextStyle>
  /**
   * Pass any additional props directly to the footer Text component.
   */
  FooterTextProps?: TextProps
  /**
   * Custom footer component.
   * Overrides all other `footer*` props.
   */
  FooterComponent?: ReactElement
  shadow?: boolean
}

/**
 * Cards are useful for displaying related information in a contained way.
 * If a ListItem displays content horizontally, a Card can be used to display content vertically.
 * @see [Documentation and Examples]{@link https://docs.infinite.red/ignite-cli/boilerplate/components/Card/}
 * @param {CardProps} props - The props for the `Card` component.
 * @returns {JSX.Element} The rendered `Card` component.
 */
export function Card(props: CardProps): JSX.Element {
  const {
    content,
    contentTx,
    contentTxOptions,
    footer,
    footerTx,
    footerTxOptions,
    heading,
    headingTx,
    headingTxOptions,
    ContentComponent,
    HeadingComponent,
    FooterComponent,
    LeftComponent,
    RightComponent,
    verticalAlignment = "top",
    style: $containerStyleOverride,
    contentStyle: $contentStyleOverride,
    headingStyle: $headingStyleOverride,
    footerStyle: $footerStyleOverride,
    ContentTextProps,
    HeadingTextProps,
    FooterTextProps,
    shadow,
    ...WrapperProps
  } = props

  const preset: Presets = props.preset ?? "default"
  const isPressable = !!WrapperProps.onPress
  const isHeadingPresent = !!(HeadingComponent || heading || headingTx)
  const isContentPresent = !!(ContentComponent || content || contentTx)
  const isFooterPresent = !!(FooterComponent || footer || footerTx)

  const Wrapper = (isPressable ? TouchableOpacity : View) as ComponentType<
    TouchableOpacityProps | ViewProps
  >
  const HeaderContentWrapper = verticalAlignment === "force-footer-bottom" ? View : Fragment

  const $containerStyle = [
    shadow && {
      shadowOffset: {
        width: 0,
        height: 5,
      },
      shadowOpacity: 0.37,
      shadowRadius: 3.05,
      elevation: 4,
    },
    $containerPresets[preset],
    $containerStyleOverride,
  ]
  const $headingStyle = [
    $headingPresets[preset],
    (isFooterPresent || isContentPresent) && { marginBottom: spacing.xxxs },
    $headingStyleOverride,
    HeadingTextProps?.style,
  ]
  const $contentStyle = [
    $contentPresets[preset],
    isHeadingPresent && { marginTop: spacing.xxxs },
    isFooterPresent && { marginBottom: spacing.xxxs },
    $contentStyleOverride,
    ContentTextProps?.style,
  ]
  const $footerStyle = [
    $footerPresets[preset],
    (isHeadingPresent || isContentPresent) && { marginTop: spacing.xxxs },
    $footerStyleOverride,
    FooterTextProps?.style,
  ]
  const $alignmentWrapperStyle = [
    $alignmentWrapper,
    { justifyContent: $alignmentWrapperFlexOptions[verticalAlignment] },
    LeftComponent && { marginStart: spacing.md },
    RightComponent && { marginEnd: spacing.md },
  ]

  return (
    <Wrapper
      style={$containerStyle}
      activeOpacity={0.8}
      accessibilityRole={isPressable ? "button" : undefined}
      {...WrapperProps}
    >
      {LeftComponent}

      <View style={$alignmentWrapperStyle}>
        <HeaderContentWrapper>
          {HeadingComponent ||
            (isHeadingPresent && (
              <Text
                weight="bold"
                text={heading}
                tx={headingTx}
                txOptions={headingTxOptions}
                {...HeadingTextProps}
                style={$headingStyle}
              />
            ))}

          {ContentComponent ||
            (isContentPresent && (
              <Text
                weight="normal"
                text={content}
                tx={contentTx}
                txOptions={contentTxOptions}
                {...ContentTextProps}
                style={$contentStyle}
              />
            ))}
        </HeaderContentWrapper>

        {FooterComponent ||
          (isFooterPresent && (
            <Text
              weight="normal"
              size="xs"
              text={footer}
              tx={footerTx}
              txOptions={footerTxOptions}
              {...FooterTextProps}
              style={$footerStyle}
            />
          ))}
      </View>

      {RightComponent}
    </Wrapper>
  )
}

const $containerBase: ViewStyle = {
  borderRadius: spacing.xs,
  padding: spacing.xs,
  marginHorizontal: spacing.xxs,
  marginBottom: spacing.sm,
  borderWidth: 1,
  flexDirection: "row",
}

const $alignmentWrapper: ViewStyle = {
  flex: 1,
  alignSelf: "stretch",
}

const $alignmentWrapperFlexOptions = {
  top: "flex-start",
  center: "center",
  "space-between": "space-between",
  "force-footer-bottom": "space-between",
} as const

const $containerPresets = {
  default: [
    $containerBase,
    {
      backgroundColor: colors.palette.primary,
      borderColor: colors.palette.primary,
    },
  ] as StyleProp<ViewStyle>,

  reversed: [
    $containerBase,
    { backgroundColor: colors.palette.grey2, borderColor: colors.palette.grey2 },
  ] as StyleProp<ViewStyle>,
}

const $headingPresets: Record<Presets, TextStyle> = {
  default: {},
  reversed: { color: colors.palette.neutral100 },
}

const $contentPresets: Record<Presets, TextStyle> = {
  default: {},
  reversed: { color: colors.palette.neutral100 },
}

const $footerPresets: Record<Presets, TextStyle> = {
  default: {},
  reversed: { color: colors.palette.neutral100 },
}
