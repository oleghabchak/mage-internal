import { colors } from "app/theme"
import React from "react"
import { View, StyleSheet, ViewStyle } from "react-native"

interface LinearProgressBarProps {
  progress: number
  containerStyle?: ViewStyle
  progressStyle?: ViewStyle
}

const LinearProgressBar: React.FC<LinearProgressBarProps> = ({
  progress,
  containerStyle,
  progressStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.progressBar, { width: `${progress * 100}%` }, progressStyle]} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.palette.white,
    height: 4,
    overflow: "hidden",
    width: "100%",
  },
  progressBar: {
    backgroundColor: colors.palette.turquoise,
    height: "100%",
  },
})

export default LinearProgressBar
