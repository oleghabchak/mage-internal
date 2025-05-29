import React from "react"
import { BackButton } from "./BackButton"
import { Button } from "./Button"
import { goBack } from "app/navigators"
import { Platform, View, ViewStyle } from "react-native"
import { spacing } from "app/theme"

interface Props {
  nextDisabled?: boolean
  onSubmit: () => void
  isLoading?: boolean
}

export const SignUpButtons: React.FC<Props> = ({ nextDisabled, onSubmit, isLoading }) => {
  return (
    <View style={[$loginBtn, Platform.OS !== "ios" && { marginBottom: spacing.xl }]}>
      <BackButton preset="outlined" testID="back-button" onPress={() => goBack()} />
      <View style={$nextButton}>
        <Button
          disabled={nextDisabled}
          preset="outlined"
          testID="signup-button"
          tx="common.next"
          onPress={onSubmit}
          isLoading={isLoading}
        />
      </View>
    </View>
  )
}

const $loginBtn: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%",
}

const $nextButton: ViewStyle = {
  width: "33%",
}
