import React from "react"
import { View, Image, ViewStyle } from "react-native"
import { Icon } from "../components"

import { TouchableOpacity } from "react-native-gesture-handler"
import * as ImagePicker from "expo-image-picker"
import { spacing } from "app/theme"
import { useTheme } from "@react-navigation/native"
import { ColorsInterface } from "app/theme/colorsInterface"

interface Props {
  image: string
  setImage: (arg: string) => void
}

const Avatar: React.FC<Props> = ({ image, setImage }) => {
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }

  const { colors: themeColors } = useTheme() as ColorsInterface
  return (
    <View style={$container}>
      <TouchableOpacity
        style={[$avatar, $imageContainer, { borderColor: themeColors.primary }]}
        onPress={pickImage}
      >
        <Image
          source={image ? { uri: image } : require("../../assets/images/default-avatar.png")}
          resizeMode="contain"
          style={{ width: 100, height: 100 }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[$cameraBtn, { backgroundColor: themeColors.background }]}
        onPress={pickImage}
      >
        <Icon icon="camera" size={20} color={themeColors.primary} />
      </TouchableOpacity>
    </View>
  )
}

export default Avatar

const $container: ViewStyle = { position: "relative" }
const $imageContainer: ViewStyle = { height: 100, width: 100 }

const $avatar: ViewStyle = {
  overflow: "hidden",
  borderWidth: 1,

  width: 100,
  height: 100,
  borderRadius: 100,
}

const $shadow: ViewStyle = {
  shadowColor: "#000000",
  shadowOffset: {
    width: 0,
    height: 3,
  },
  shadowOpacity: 0.17,
  shadowRadius: 3.05,
  elevation: 4,
}

const $cameraBtn: ViewStyle = {
  position: "absolute",
  bottom: 0,
  right: 0,
  padding: spacing.xxs,
  borderRadius: 100,
  ...$shadow,
}
