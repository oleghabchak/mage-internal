import { spacing, colors, typography } from "app/theme"
import React from "react"
import { View, TouchableOpacity, ViewStyle, TextStyle } from "react-native"
import { Icon } from "../Icon"
import { Text } from "../Text"
import { useStores } from "app/models"
import { observer } from "mobx-react-lite"
import { useTheme } from "@react-navigation/native"
import { ColorsInterface } from "app/theme/colorsInterface"

interface BlockSliderProps {
  title: string
}

export const BlockSlider: React.FC<BlockSliderProps> = observer(function BlockSlider({ title }) {
  const {
    programStore: {
      setNextCurrentPastProgram,
      setPrevCurrentPastProgram,
      currentPastProgramId,
      pastPrograms,
    },
  } = useStores()

  const currentPastProgramIndex = pastPrograms.findIndex(
    (pastProgram) => pastProgram.id === currentPastProgramId,
  )

  const handlPressLeft = () => {
    setPrevCurrentPastProgram()
  }

  const handlPressRight = () => {
    setNextCurrentPastProgram()
  }
  const { colors: themeColors } = useTheme() as ColorsInterface
  return (
    <View style={[$container, { backgroundColor: themeColors.primary }]}>
      {currentPastProgramIndex > 0 && (
        <TouchableOpacity
          onPress={handlPressLeft}
          hitSlop={{ top: 20, bottom: 20, left: 50, right: 10 }}
          style={$leftButton}
        >
          <Icon icon="blockCaret" color={colors.palette.white} size={24} />
        </TouchableOpacity>
      )}

      <Text style={$titleText}>{title}</Text>

      {currentPastProgramIndex < pastPrograms.length - 1 && (
        <TouchableOpacity
          onPress={handlPressRight}
          hitSlop={{ top: 20, bottom: 20, left: 50, right: 10 }}
          style={$rightButton}
        >
          <Icon icon="blockCaret" color={colors.palette.white} size={24} />
        </TouchableOpacity>
      )}
    </View>
  )
})

export default BlockSlider

const $container: ViewStyle = {
  flexDirection: "row",
  backgroundColor: colors.palette.primary,
  justifyContent: "center",
  borderRadius: spacing.xs,
  alignItems: "center",
  marginBottom: spacing.ml,
  marginHorizontal: spacing.xxs,
  height: spacing.xxxl,
}

const $titleText: TextStyle = {
  paddingHorizontal: spacing.xl,
  color: colors.palette.white,
  lineHeight: 26,
  fontSize: 24,
  fontFamily: typography.primary.semiBold,
  textAlign: "center",
}

const $leftButton: ViewStyle = {
  position: "absolute",
  left: 20,
  transform: [{ rotate: "180deg" }],
}

const $rightButton: ViewStyle = {
  position: "absolute",
  right: 20,
}
