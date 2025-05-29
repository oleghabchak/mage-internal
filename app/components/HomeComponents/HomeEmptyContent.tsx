import React, { useContext } from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import { Text } from "../Text"
import { Icon } from "../Icon"
import { colors, spacing, typography } from "app/theme"
import { useHeader } from "app/utils/useHeader"
import { useStores } from "app/models"
import { trimmTitleString } from "app/utils/functions"
import { observer } from "mobx-react-lite"
import { useTheme } from "@react-navigation/native"
import { AppContext } from "app/context/AppContext"

interface HomeEmptyContentProps {}

export const HomeEmptyContent: React.FC<HomeEmptyContentProps> = observer(
  function HomeEmptyContent() {
    const {
      authenticationStore: { firstName },
    } = useStores()
    const { colors } = useTheme()
    const capitalizedName = firstName?.charAt(0).toUpperCase() + firstName?.slice(1)
    const { theme } = useContext(AppContext)
    useHeader(
      {
        title: "Hey " + trimmTitleString(capitalizedName, 10) + ",",
        titleStyle: {
          fontSize: spacing.xl,
          color: colors.primary,
        },
        hideBackBtn: true,
        backgroundColor: colors.background,
      },
      [firstName, theme, colors],
    )
    const $contentText: TextStyle = {
      fontFamily: typography.primary.normal,
      color: colors.text,
      fontSize: 17,
    }

    return (
      <View style={$container}>
        <View>
          <Text style={$contentText}>No workouts assigned.</Text>
          <Text style={$contentText}>Your coach has been alerted.</Text>
          <Text style={$contentText}>A new program will be up shortly</Text>
        </View>
        <View style={$iconWrapper}>
          <Icon icon="appIcon" />
        </View>
      </View>
    )
  },
)

const $container: ViewStyle = { gap: spacing.lg }
const $iconWrapper: ViewStyle = {
  height: 180,
  width: 180,
  backgroundColor: colors.palette.primary,
  justifyContent: "center",
  alignItems: "center",
  alignSelf: "center",
  borderRadius: spacing.md,
}
