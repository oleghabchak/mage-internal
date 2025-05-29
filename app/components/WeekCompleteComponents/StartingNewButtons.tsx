import { TextStyle, ViewStyle, View } from "react-native"
import { Button } from "../Button"
import { spacing } from "app/theme"
import { useNavigation, useTheme } from "@react-navigation/native"

import { Icon } from "../Icon"
import { useStores } from "app/models"
import { ColorsInterface } from "app/theme/colorsInterface"

interface StartingNewButtonsProps {
  currentCycleFinished: boolean
  onStartNewCycle: () => void
  setOpenedConfirmPopup: (state: boolean) => void
  isLoading: boolean
  setIsLoading: (state: boolean) => void
  backgroundColor: string
  color: string
}

export const StartingNewButtons: React.FC<StartingNewButtonsProps> = ({
  onStartNewCycle,
  setOpenedConfirmPopup,
  isLoading,
  setIsLoading,
  backgroundColor,
  color,
}) => {
  const navigation = useNavigation()
  const {
    programStore: {
      currentCycleFinished,
      setNextSession,
      currentSessionFinished,
      currentSessionIsLast,
    },
  } = useStores()
  const isStartNewSessionButton = currentSessionFinished && !currentSessionIsLast
  const { colors: themeColors } = useTheme() as ColorsInterface
  const handleStartNewCycle = () => {
    if (currentCycleFinished) {
      onStartNewCycle()
    } else {
      setOpenedConfirmPopup(true)
    }
  }

  const handleStartNewSession = async () => {
    try {
      setIsLoading(true)
      await setNextSession()
      await navigation.navigate("DemoCommunity" as never)

      setTimeout(() => {
        navigation.navigate("Exercises" as never)
      }, 200)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <>
      {isStartNewSessionButton ? (
        <Button
          textStyle={[$buttonText, { color: color }]}
          text="Start New Session"
          onPress={handleStartNewSession}
          style={[$button, { backgroundColor: backgroundColor, borderColor: themeColors.border }]}
          LeftAccessory={() => <View style={{ width: spacing.sm }} />}
          RightAccessory={() => <Icon icon="rightArrow" color={color} />}
          isLoading={isLoading}
          disabled={isLoading}
        />
      ) : (
        <Button
          textStyle={$buttonText}
          text="Start New Cycle"
          onPress={handleStartNewCycle}
          style={[$button, { backgroundColor: backgroundColor, borderColor: themeColors.border }]}
          LeftAccessory={() => <View style={{ width: spacing.sm }} />}
          RightAccessory={() => <Icon icon="rightArrow" color={color} />}
          isLoading={isLoading}
          disabled={isLoading}
        />
      )}
    </>
  )
}
const $button: ViewStyle = {
  marginTop: spacing.ml,
  justifyContent: "space-between",
  paddingHorizontal: spacing.xl,
}

const $buttonText: TextStyle = { lineHeight: 26, fontSize: 24 }
