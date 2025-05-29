import { observer } from "mobx-react-lite"
import React from "react"

import { DemoTabScreenProps } from "../navigators/TabNavigator"
import { spacing } from "../theme"
import { useHeader } from "app/utils/useHeader"
import { Screen } from "app/components"
import { Text } from "react-native"

export const DemoPodcastListScreen: React.FC<DemoTabScreenProps<"DemoPodcastList">> = observer(
  function DemoPodcastListScreen(_props) {
    useHeader(
      {
        title: "Chat",
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
        <Text>Empty screen</Text>
      </Screen>
    )
  },
)
