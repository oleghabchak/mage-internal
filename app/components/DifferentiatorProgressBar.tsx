import { useTheme } from "@react-navigation/native"
import { colors, spacing } from "app/theme"
import { ColorsInterface } from "app/theme/colorsInterface"
import React from "react"
import { View, StyleSheet } from "react-native"

interface DifferentiatorProgressBarProps {
  differentiator: number
  maxValue: number
}

const DifferentiatorProgressBar: React.FC<DifferentiatorProgressBarProps> = ({
  differentiator,
  maxValue,
}) => {
  const leftDifferentiator = differentiator < 0 ? (differentiator / -maxValue) * 100 : 0
  const rightDifferentiator = differentiator > 0 ? (differentiator / maxValue) * 100 : 0

  const { colors } = useTheme() as ColorsInterface
  return (
    <View style={[styles.container, { backgroundColor: colors.grey }]}>
      <View style={styles.leftContainer}>
        <View
          style={[
            styles.leftProgress,
            { width: `${leftDifferentiator}%`, backgroundColor: colors.primary },
          ]}
        />
      </View>
      <View style={styles.rightContainer}>
        <View
          style={[
            styles.rightProgress,
            { width: `${rightDifferentiator}%`, backgroundColor: colors.primary },
          ]}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.palette.grey2,
    borderRadius: 50,
    flex: 1,
    flexDirection: "row",
    height: 12,
    marginVertical: spacing.xl,
    overflow: "hidden",
  },
  leftContainer: {
    flex: 1,
    height: "100%",
  },
  leftProgress: {
    alignSelf: "flex-end",
    backgroundColor: colors.palette.primary,
    borderBottomLeftRadius: 50,
    borderTopLeftRadius: 50,
    height: "100%",
  },
  rightContainer: {
    flex: 1,
    height: "100%",
  },
  rightProgress: {
    alignSelf: "flex-start",
    backgroundColor: colors.palette.primary,
    borderBottomRightRadius: 50,
    borderTopRightRadius: 50,
    height: "100%",
  },
})

export default DifferentiatorProgressBar
