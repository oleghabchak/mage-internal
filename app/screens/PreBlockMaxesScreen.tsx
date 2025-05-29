import { useNavigation, useTheme } from "@react-navigation/native"
import { Button, Card, Icon, Screen, Text } from "app/components"
import { CarouselMaxesList } from "app/components/CarouselComponents/CarouselMaxesList"
import ProgressBar from "app/components/ProgressBar"
import { useStores } from "app/models"
import { AppStackScreenProps } from "app/navigators"
import { spacing, colors, typography } from "app/theme"
import { ColorsInterface } from "app/theme/colorsInterface"
import { useHeader } from "app/utils/useHeader"
import { observer } from "mobx-react-lite"
import React, { useRef, useState } from "react"
import { View, TouchableOpacity, TextStyle, ViewStyle } from "react-native"
import { Dimensions } from "react-native"
import Carousel from "react-native-snap-carousel"

interface PreBlockMaxesProps extends AppStackScreenProps<"PreBlockMaxes"> {}

export const PreBlockMaxesScreen: React.FC<PreBlockMaxesProps> = observer(
  function PreBlockMaxesScreen() {
    const navigation = useNavigation()
    const {
      programStore: { programData, currentCycleIndex },
    } = useStores()

    const { colors: themeColors } = useTheme() as ColorsInterface
    const [snapNumber, setSnapNumber] = useState(0)
    const carouselRef = useRef<Carousel<any> | null>(null)
    const sessionCount = programData.cyclelist[currentCycleIndex].workouts
    const screenWidth = Dimensions.get("window").width
    useHeader(
      {
        title: programData.name,
        titleContainerStyle: {
          alignItems: "center",
          justifyContent: "flex-start",
          height: "70%",
        },
        titleStyle: {
          fontSize: spacing.lg,
          color: themeColors.text,
        },
        hideRightIcon: true,
        backgroundColor: themeColors.background,
      },
      [],
    )

    const handleStartProgram = async () => {
      await navigation.navigate("DemoCommunity" as never)

      setTimeout(() => {
        navigation.navigate("Exercises" as never)
      }, 200)
    }

    const snapToItem = (itemIndex: number) => {
      if (carouselRef.current) {
        carouselRef.current.snapToItem(itemIndex)
      }
    }

    const renderItem = ({ dataIndex, item }: any) => {
      return (
        <View style={[$container, { backgroundColor: themeColors.primary }]}>
          <View style={$sessionTextContainer}>
            <TouchableOpacity
              hitSlop={{ top: 15, bottom: 15, left: 10, right: 10 }}
              style={$snapArrow}
              onPress={() => snapToItem(snapNumber - 1)}
            >
              <Icon size={18} icon="left" color={themeColors.alternativeText} />
            </TouchableOpacity>

            <Text style={[$sessionText, { color: themeColors.alternativeText }]}>
              Session {dataIndex + 1}/{sessionCount.length}
            </Text>
            <TouchableOpacity
              hitSlop={{ top: 15, bottom: 15, left: 10, right: 10 }}
              style={$snapArrow}
              onPress={() => snapToItem(snapNumber + 1)}
            >
              <Icon size={18} icon="right" color={themeColors.alternativeText} />
            </TouchableOpacity>
          </View>
          <ProgressBar progress={dataIndex} all={sessionCount} />
          <CarouselMaxesList workout={item} />
        </View>
      )
    }

    return (
      <Screen statusBarStyle="dark" style={$root} preset="scroll">
        <Card
          headingTx="preBlockMaxes.card.header"
          style={{ backgroundColor: themeColors.primary, borderColor: themeColors.border }}
          headingStyle={[$cardHeader, { color: themeColors.alternativeText }]}
          contentTx="preBlockMaxes.card.content"
          contentStyle={[$cardContent, { color: themeColors.alternativeText }]}
        />
        <Carousel
          ref={carouselRef}
          sliderWidth={screenWidth - spacing.ml * 2}
          itemWidth={screenWidth - spacing.ml * 2}
          data={programData.cyclelist[currentCycleIndex].workouts}
          renderItem={renderItem}
          hasParallaxImages={true}
          onSnapToItem={(item) => setSnapNumber(item)}
          vertical={false}
        />
        <Button
          tx="preBlockMaxes.buttons.startProgram"
          textStyle={[$buttonText, { color: themeColors.alternativeText }]}
          onPress={handleStartProgram}
          preset="default"
          style={[$button, { backgroundColor: themeColors.primary }]}
          LeftAccessory={() => <View />}
          RightAccessory={() => <Icon icon="rightArrow" />}
        />
      </Screen>
    )
  },
)

const $root: ViewStyle = {
  flex: 1,
}

const $buttonText: TextStyle = {
  fontSize: 22,
  lineHeight: 24,
  fontFamily: typography.fonts.manrope.semiBold,
}

const $button: ViewStyle = {
  marginTop: spacing.ml,
  justifyContent: "space-between",
  paddingHorizontal: spacing.xl,
}

const $sessionText: TextStyle = {
  fontSize: 16,
  color: colors.palette.white,
  fontFamily: typography.fonts.manrope.semiBold,
  textAlign: "center",
}
const $sessionTextContainer: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
}

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.palette.primary,
  borderRadius: spacing.xs,
  padding: 10,
}

const $snapArrow: ViewStyle = {
  paddingHorizontal: spacing.xl,
}

const $cardHeader: TextStyle = {
  textAlign: "center",
  color: colors.palette.white,
  fontSize: 20,
  fontFamily: typography.fonts.manrope.semiBold,
}

const $cardContent: TextStyle = {
  textAlign: "center",
  color: colors.palette.white,
  fontSize: 16,
  fontFamily: typography.fonts.manrope.light,
  paddingHorizontal: spacing.sm,
  paddingBottom: spacing.sm,
}
