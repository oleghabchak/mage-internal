import { useTheme } from "@react-navigation/native"
import { fetchVideoTitle } from "app/services/youtube/fetchTitle"
import { spacing, typography } from "app/theme"
import { ColorsInterface } from "app/theme/colorsInterface"
import React, { useEffect, useState } from "react"
import { Dimensions, Text, TextStyle, View, ViewStyle } from "react-native"
import YoutubePlayer from "react-native-youtube-iframe"

interface BottomPopupVideoProps {
  url: string | null
}

export const BottomPopupVideo: React.FC<BottomPopupVideoProps> = ({ url }) => {
  const windowWidth = Dimensions.get("window").width
  const playerHeight = windowWidth * 0.505
  const playerPaddingHorizontal = windowWidth * 0.05
  const [title, setTitle] = useState("")
  const videoId = url?.split("=")[1]?.split("&")[0]
  const { colors: themeColors } = useTheme() as ColorsInterface
  const $playerContainer: ViewStyle = {
    marginHorizontal: playerPaddingHorizontal,
    borderRadius: spacing.sm,
    overflow: "hidden",
  }

  const fetchTitle = async () => {
    if (videoId) {
      const title = await fetchVideoTitle(videoId)
      setTitle(title)
    }
  }

  useEffect(() => {
    fetchTitle()
  }, [])

  return videoId ? (
    <View>
      <View style={$playerContainer}>
        <YoutubePlayer height={playerHeight} videoId={videoId} />
      </View>
      <View style={$titleContainer}>
        <Text style={[$title, { color: themeColors.text }]}>{title}</Text>
      </View>
    </View>
  ) : (
    <Text style={[$text, { color: themeColors.text }]}>No video connected</Text>
  )
}

const $titleContainer: ViewStyle = {
  padding: spacing.sm,
}

const $title: TextStyle = {
  fontFamily: typography.fonts.manrope.semiBold,
  fontSize: 16,
}

const $text: TextStyle = {
  fontFamily: typography.fonts.manrope.semiBold,
  fontSize: 16,
  textAlign: "center",
}
