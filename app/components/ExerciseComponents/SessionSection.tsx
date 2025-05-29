import { useTheme } from "@react-navigation/native"
import { useStores } from "app/models"
import { IWorkout } from "app/models/ProgramStore"
import { colors, spacing, typography } from "app/theme"
import { ColorsInterface } from "app/theme/colorsInterface"
import { generateUUID } from "app/utils/uuid"
import { observer } from "mobx-react-lite"
import React from "react"
import { Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"

interface SessionButtonProps {
  value: number
  activeButton: number
  setActiveButton: (arg: number) => void
}

const SessionButton: React.FC<SessionButtonProps> = ({ value, activeButton, setActiveButton }) => {
  const isActive = value === activeButton
  const { colors: themeColors } = useTheme() as ColorsInterface
  return (
    <TouchableOpacity
      style={[
        $button,
        { backgroundColor: themeColors.grey },
        isActive && { backgroundColor: themeColors.primary },
      ]}
      onPress={() => setActiveButton(value)}
    >
      <Text
        style={[
          $text,
          { color: themeColors.text },
          isActive && { color: themeColors.alternativeText },
        ]}
      >
        {value}
      </Text>
    </TouchableOpacity>
  )
}

interface SessionSectionProps {
  sessions: IWorkout[]
}

export const SessionSection: React.FC<SessionSectionProps> = observer(function SessionSection({
  sessions,
}) {
  const {
    programStore: { currentSession, setCurrentSession },
  } = useStores()
  const { colors: themeColors } = useTheme() as ColorsInterface
  return (
    <View style={$container}>
      <Text style={[$text, { color: themeColors.text }]}>Session</Text>
      <View style={$buttonsContainer}>
        {sessions?.map((_, index) => (
          <SessionButton
            key={generateUUID()}
            value={index + 1}
            activeButton={currentSession}
            setActiveButton={setCurrentSession}
          />
        ))}
      </View>
    </View>
  )
})

const $container: ViewStyle = {
  justifyContent: "space-between",
  alignItems: "center",
  gap: spacing.xs,
}

const $buttonsContainer: ViewStyle = {
  flexDirection: "row",
  gap: spacing.sm,
}

const $button: ViewStyle = {
  backgroundColor: colors.palette.grey2,
  height: 40,
  width: 40,
  borderRadius: spacing.xs,
  justifyContent: "center",
  alignItems: "center",
}

const $text: TextStyle = {
  fontFamily: typography.fonts.manrope.medium,
}
