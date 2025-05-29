import { Screen, Text } from "app/components"
import { AppStackScreenProps } from "app/navigators"
import { colors, spacing, typography } from "app/theme"
import { useHeader } from "app/utils/useHeader"
import { observer } from "mobx-react-lite"
import React from "react"
import { TextStyle } from "react-native"

interface NotificationScreenProps extends AppStackScreenProps<"Notification"> {}

export const NotificationScreen: React.FC<NotificationScreenProps> = observer(
  function NotificationScreen(_props) {
    useHeader(
      {
        title: "Notification",
        titleContainerStyle: {
          alignItems: "center",
          justifyContent: "flex-start",
          height: "70%",
        },
        titleStyle: {
          fontSize: spacing.lg,
        },
      },
      [],
    )

    return (
      <Screen statusBarStyle="dark" preset="fixed">
        <Text style={$text}>Page in Development</Text>
      </Screen>
    )
  },
)

const $text: TextStyle = {
  textAlign: "center",
  marginTop: 200,
  color: colors.palette.black,
  fontFamily: typography.fonts.manrope.medium,
  fontSize: 24,
}
