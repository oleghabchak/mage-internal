import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"

interface ChatScreenProps extends AppStackScreenProps<"Chat"> {}

export const ChatScreen: FC<ChatScreenProps> = observer(function ChatScreen() {
  return (
    <Screen statusBarStyle="dark" style={$root} preset="scroll">
      <Text text="chat" />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
