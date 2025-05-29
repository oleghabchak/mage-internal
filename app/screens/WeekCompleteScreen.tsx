import React from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { DemoTabScreenProps } from "app/navigators"
import { Screen } from "app/components"
import { useStores } from "app/models"

import { WeekCompleteEmptyContent } from "app/components/WeekCompleteComponents/WeekCompleteEmptyContent"
import { WeekCompleteContent } from "app/components/WeekCompleteComponents/WeekCompleteContent"

export const WeekCompleteScreen: React.FC<DemoTabScreenProps<"WeekComplete">> = observer(
  function WeekCompleteScreen() {
    const {
      programStore: { activeProgram },
    } = useStores()

    return (
      <Screen statusBarStyle="dark" style={$root} preset="auto">
        {activeProgram ? <WeekCompleteContent /> : <WeekCompleteEmptyContent />}
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}
