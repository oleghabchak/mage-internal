import { spacing } from "app/theme"
import React, { ReactNode } from "react"
import { ScrollView, ViewStyle } from "react-native"

interface SignUpLayoutProps {
  children: ReactNode
}

export const SignUpLayout: React.FC<SignUpLayoutProps> = ({ children }) => (
  <ScrollView
    showsVerticalScrollIndicator={false}
    keyboardDismissMode="on-drag"
    keyboardShouldPersistTaps="always"
    style={$container}
  >
    {children}
  </ScrollView>
)

const $container: ViewStyle = {
  paddingTop: spacing.xl,
}
