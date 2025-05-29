import { useTheme } from "@react-navigation/native"
import { colors, spacing, typography } from "app/theme"
import { ColorsInterface } from "app/theme/colorsInterface"
import { ExerciseClassEnum } from "app/utils/enums/exerciseClassesEnum"
import React from "react"
import { Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"

interface BottomPopupNavBarButtonProps {
  text: string
  activeButtonSlug: string
  onSelect: (arg: string) => void
}

const BottomPopupNavBarButton: React.FC<BottomPopupNavBarButtonProps> = ({
  text,
  activeButtonSlug,
  onSelect,
}) => {
  const { colors } = useTheme() as ColorsInterface
  const slug = text.split(" ").join("").toLowerCase()
  const isActive = slug === activeButtonSlug
  const handleSellect = () => {
    onSelect(slug)
  }
  return (
    <TouchableOpacity
      style={[$button, isActive && { borderColor: colors.primary, borderBottomWidth: 2 }]}
      onPress={handleSellect}
    >
      <Text
        style={[
          $text,
          { color: colors.text },
          isActive && {
            color: colors.primary,
            opacity: 1,
          },
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  )
}

interface BottomPopupNavBarProps {
  activeButtonSlug: string
  onSelect: (arg: string) => void
  exerciseClassWRS: boolean
  exerciseClass: string
}

export const BottomPopupNavBar: React.FC<BottomPopupNavBarProps> = ({
  activeButtonSlug,
  onSelect,
  exerciseClassWRS,
  exerciseClass,
}) => {
  return (
    <View style={$container}>
      {exerciseClass !== ExerciseClassEnum.INSTRUCTION && (
        <BottomPopupNavBarButton
          text={"Coach Note"}
          onSelect={onSelect}
          activeButtonSlug={activeButtonSlug}
        />
      )}

      <BottomPopupNavBarButton
        text={"Video"}
        onSelect={onSelect}
        activeButtonSlug={activeButtonSlug}
      />
      {exerciseClassWRS && (
        <BottomPopupNavBarButton
          text={"1rm"}
          onSelect={onSelect}
          activeButtonSlug={activeButtonSlug}
        />
      )}

      <BottomPopupNavBarButton
        text={"Info"}
        onSelect={onSelect}
        activeButtonSlug={activeButtonSlug}
      />
    </View>
  )
}

const $container: ViewStyle = { flexDirection: "row" }

const $button: ViewStyle = { flex: 1, paddingBottom: spacing.xxs }
const $text: TextStyle = {
  textAlign: "center",
  color: colors.palette.black,
  opacity: 0.5,
  fontFamily: typography.fonts.manrope.bold,
  fontSize: 14,
  lineHeight: 17,
}
