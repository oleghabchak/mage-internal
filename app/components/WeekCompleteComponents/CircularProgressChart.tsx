// /* eslint-disable react-native/no-inline-styles */
import React, { FC } from "react"
import { View, ViewStyle, Text, TextStyle, Dimensions } from "react-native"
import { Canvas, Path, Skia, Group } from "@shopify/react-native-skia"
import { colors, spacing, typography } from "app/theme"
import { generateUUID } from "app/utils/uuid"
import { useTheme } from "@react-navigation/native"
import { ColorsInterface } from "app/theme/colorsInterface"

const { width: screenWidth } = Dimensions.get("window")

interface CircleProps {
  strokeWidth: number
  color?: string | undefined
  shadowColor?: string | undefined
  radius: number
  maxValue: number
  currentValue: number
  angle: number
  center: number
}

const Circle: FC<CircleProps> = ({ strokeWidth, color, center, radius, currentValue, angle }) => {
  const path = Skia.Path.Make()
  path.addCircle(center, center, radius)

  const progress = currentValue * 0.0098

  function addTransparency(hexColor: string) {
    if (hexColor[0] === "#") {
      hexColor = hexColor.slice(1)
    }

    const red = parseInt(hexColor.substring(0, 2), 16)
    const green = parseInt(hexColor.substring(2, 4), 16)
    const blue = parseInt(hexColor.substring(4, 6), 16)

    const rgbaColor = `rgba(${red}, ${green}, ${blue}, 0.2)`

    return rgbaColor
  }
  return (
    <Group transform={[{ rotate: angle }]} origin={{ x: center, y: center }}>
      <Path
        path={path}
        color={addTransparency(color || "black")}
        style="stroke"
        strokeWidth={strokeWidth}
        strokeCap="round"
      ></Path>
      <Path
        path={path}
        color={color}
        style="stroke"
        strokeWidth={strokeWidth}
        end={progress}
        strokeCap="round"
      ></Path>
    </Group>
  )
}

interface CircularProgressProps {
  size?: number
  strokeWidth?: number
  duration?: number
  maxValue: number
  values: {
    value?: number
    percentage?: number
    cumulativeRotation?: number
    color?: string
    shadowColor?: string
    label?: string
  }[]
  sessionsCount?: string | number
}

export const CircularProgressChart: FC<CircularProgressProps> = ({
  size = 200,
  strokeWidth = 8,
  values,
}) => {
  const radius = size / 2 - strokeWidth
  const center = strokeWidth + radius
  const { colors: themeColors } = useTheme() as ColorsInterface
  return (
    <View style={{ display: "flex", alignItems: "center", flexDirection: "row" }}>
      <View
        style={{
          width: 150,
        }}
      >
        <View style={{ flex: 1, justifyContent: "flex-start", alignItems: "flex-start" }}>
          {!!values.length && (
            <Text style={[$title, { color: themeColors.text }]}>Sets per week</Text>
          )}
          {values.map(({ label, value, color }, i) => (
            <View
              key={i + 123}
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 5,
              }}
            >
              <View key={i + 12} style={[$rectangle, { backgroundColor: color }]} />

              <Text
                key={i}
                style={{
                  width: 25,
                  marginHorizontal: 5,
                  fontFamily: typography.primary.normal,
                  fontSize: 15,
                  color: colors.palette.grey6,
                }}
              >
                {value}-
              </Text>
              <Text
                key={i + 1 * 0.12}
                style={{
                  width: 100,
                  fontFamily: typography.primary.normal,
                  fontSize: 15,
                  color: colors.palette.grey6,
                }}
              >
                {label}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <View
        style={{
          width: size,
          height: size,
          marginTop: screenWidth < 400 ? -35 : -5,
        }}
      >
        <Canvas style={{ flex: 1, flexDirection: "row", marginLeft: -40 }}>
          <Group transform={[{ rotate: -Math.PI / 2 }, { translateX: -size, translateY: -20 }]}>
            {values.map(({ color, percentage, cumulativeRotation }, i) => (
              <Circle
                key={generateUUID()}
                center={center}
                radius={(radius - 35) * (1 - i * 0.15)}
                angle={cumulativeRotation || 0}
                maxValue={100}
                currentValue={percentage || 100}
                color={color ?? "#036666"}
                shadowColor={color ?? "#EA64D548"}
                strokeWidth={strokeWidth * (1 - i * 0.15)}
              />
            ))}
          </Group>
        </Canvas>
      </View>
    </View>
  )
}
export default CircularProgressChart

const $rectangle: ViewStyle = {
  height: "100%",
  width: spacing.md,
  borderRadius: 3,
}
const $title: TextStyle = {
  fontSize: 18,
  fontFamily: typography.primary.normal,
  marginBottom: spacing.xs,
}
