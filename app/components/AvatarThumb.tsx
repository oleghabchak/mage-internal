import { useTheme } from "@react-navigation/native"
import { colors } from "app/theme"
import { ColorsInterface } from "app/theme/colorsInterface"
import React from "react"
import { Image, ViewStyle, Pressable, GestureResponderEvent } from "react-native"

interface AvatarThumbProps {
  size?: number
  border?: number
  image?: string
  onPress?: (event: GestureResponderEvent) => void
}

const AvatarThumb: React.FC<AvatarThumbProps> = ({ size = 40, border = 2, onPress, image }) => {
  const { colors: themeColors } = useTheme() as ColorsInterface
  return (
    <Pressable
      style={[
        $avatar,
        { height: size, width: size, borderWidth: border, borderColor: themeColors.primary },
      ]}
      onPress={onPress}
    >
      <Image
        source={image ? { uri: image } : require("../../assets/images/default-avatar.png")}
        resizeMode="contain"
        style={{ width: size - border * 2, height: size - border * 2 }}
      />
    </Pressable>
  )
}

const $avatar: ViewStyle = {
  overflow: "hidden",
  borderColor: colors.palette.primary,
  borderRadius: 100,
}

export default AvatarThumb
