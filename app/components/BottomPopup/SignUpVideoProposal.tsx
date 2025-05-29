import { colors, spacing, typography } from "app/theme"
import { Button } from "../Button"
import { Text } from "../Text"
import { Dimensions, TextStyle, ViewStyle } from "react-native"
import { View } from "react-native"
import { useState } from "react"

import YoutubePlayer from "react-native-youtube-iframe"
import { useTheme } from "@react-navigation/native"
import { ColorsInterface } from "app/theme/colorsInterface"
interface SignUpVideoProposalProps {
  expanded: boolean
  onExpand: (type: string) => void
  handleNextPopup: () => void
}
export const SignUpVideoProposal = ({
  expanded,
  onExpand,
  handleNextPopup,
}: SignUpVideoProposalProps) => {
  const [isVideoDisplayed, setIsVideoDisplayed] = useState(false)
  function handleShowVideo() {
    onExpand("video")
    setIsVideoDisplayed(!isVideoDisplayed)
  }
  const windowWidth = Dimensions.get("window").width
  const playerHeight = windowWidth * 0.505
  const playerPaddingHorizontal = windowWidth * 0.01
  const $playerContainer: ViewStyle = {
    marginHorizontal: playerPaddingHorizontal,
    borderRadius: spacing.sm,
    overflow: "hidden",
  }
  const videoId = "https://www.youtube.com/watch?v=QN__Hn1aoHc".split("=")[1]?.split("&")[0]
  const { colors: themeColors } = useTheme() as ColorsInterface
  return (
    <>
      <Text
        style={[$blockTitle, { color: themeColors.primary }]}
        text={isVideoDisplayed ? "Quick tutorial" : "First time here?"}
      />
      {isVideoDisplayed ? (
        <View style={$playerContainer}>
          <YoutubePlayer height={playerHeight} videoId={videoId} />
        </View>
      ) : (
        <Button
          onPress={handleShowVideo}
          preset="grey"
          textStyle={{ color: themeColors.text }}
          style={{ backgroundColor: themeColors.grey }}
        >
          Show me around
        </Button>
      )}

      <Button
        onPress={handleNextPopup}
        textStyle={{ color: themeColors.text }}
        style={{ backgroundColor: themeColors.grey }}
        preset="grey"
      >
        {isVideoDisplayed ? "Next step" : "Skip tutorial"}
      </Button>
    </>
  )
}

const $blockTitle: TextStyle = {
  marginTop: spacing.md,
  color: colors.palette.primary,
  fontSize: 24,
  fontFamily: typography.primary.semiBold,
}
