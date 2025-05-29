import { colors, spacing, typography } from "app/theme"
import { Button } from "../Button"
import { useNavigation, useTheme } from "@react-navigation/native"
import { Text } from "../Text"
import { TextStyle, ViewStyle } from "react-native"
import { ColorsInterface } from "app/theme/colorsInterface"

interface FirstOptionPopupProps {
  expanded: boolean
  onClose: () => void
  onExpand: (type: string) => void
  handleNextPopup: () => void
}

export const SignUpChoiceModal = ({ expanded, onClose }: FirstOptionPopupProps) => {
  const navigation = useNavigation()
  const { colors: themeColors } = useTheme() as ColorsInterface
  const handleNavigateToCoachScreen = async () => {
    onClose()
    await navigation.navigate("SettingsTab" as never)

    setTimeout(() => {
      navigation.navigate("Coach" as never)
    }, 200)
  }
  return (
    <>
      <Text
        style={[$blockTitle, { color: themeColors.primary }]}
        text={expanded ? "Mage program" : "Your first step"}
      />
      <>
        <Button
          onPress={handleNavigateToCoachScreen}
          preset="grey"
          textStyle={{ color: themeColors.text }}
          style={[$button, { backgroundColor: themeColors.grey }]}
        >
          Connect to your coach
        </Button>
      </>
    </>
  )
}

const $blockTitle: TextStyle = {
  marginTop: spacing.md,
  color: colors.palette.primary,
  fontSize: 24,
  fontFamily: typography.primary.semiBold,
}

const $button: ViewStyle = {
  marginTop: spacing.ml,
}
