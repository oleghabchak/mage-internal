import { spacing, colors, typography } from "app/theme"
import React, { useContext, useRef, useState } from "react"
import { View, TouchableOpacity, TextStyle, ViewStyle } from "react-native"
import { Dimensions } from "react-native"
import Carousel from "react-native-snap-carousel"
import { Card } from "../Card"
import { Icon } from "../Icon"
import { useStores } from "app/models"

import { CarouselExercisesList } from "../CarouselComponents/CarouselExercisesList"
import ProgressBar from "../ProgressBar"
import { useNavigation, useTheme } from "@react-navigation/native"
import { Text } from "../Text"
import { Button } from "../Button"
import { useHeader } from "app/utils/useHeader"
import { trimmTitleString } from "app/utils/functions"
import { observer } from "mobx-react-lite"
import { ColorsInterface } from "app/theme/colorsInterface"
import { AppContext } from "app/context/AppContext"

interface HomeContentProps {}

export const HomeContent: React.FC<HomeContentProps> = observer(function HomeContent() {
  const navigation = useNavigation()
  const {
    programStore: { programData, getLastUnfinishedSession, setCurrentSession, currentCycleIndex },
    authenticationStore: { firstName },
  } = useStores()

  const { colors } = useTheme() as ColorsInterface
  const [snapNumber, setSnapNumber] = useState(0)

  const carouselRef = useRef<Carousel<any> | null>(null)
  const sessionCount = programData.cyclelist[currentCycleIndex]?.workouts
  const firstView = getLastUnfinishedSession === 1 && programData.currentcycle === 1
  const capitalizedName = firstName?.charAt(0).toUpperCase() + firstName?.slice(1)
  const screenWidth = Dimensions.get("window").width
  const { theme } = useContext(AppContext)
  useHeader(
    {
      title: "Hey " + trimmTitleString(capitalizedName, 10) + ",",
      subtitle: firstView ? "Welcome, here's your first workout" : "Here is your next workout.",
      subtitleStyle: { color: colors.text },
      titleStyle: {
        fontSize: spacing.xl,
        color: colors.primary,
      },
      hideBackBtn: true,
      backgroundColor: colors.background,
    },
    [firstName, getLastUnfinishedSession, theme, colors],
  )

  const snapToItem = (itemIndex: number) => {
    if (carouselRef.current) {
      carouselRef.current.snapToItem(itemIndex)
    }
  }

  const renderItem = ({ dataIndex, item }: any) => {
    const handleNavigateToExercise = async () => {
      await navigation.navigate("DemoCommunity" as never)

      setCurrentSession(snapNumber + 1)

      setTimeout(() => {
        navigation.navigate("Exercises" as never)
      }, 200)
    }

    return (
      <View style={[$container, { backgroundColor: colors.primary }]}>
        <View style={$sessionTextContainer}>
          <TouchableOpacity
            hitSlop={{ top: 15, bottom: 15, left: 10, right: 10 }}
            style={$snapArrow}
            onPress={() => snapToItem(snapNumber - 1)}
          >
            <Icon size={18} icon="left" color={colors.alternativeText} />
          </TouchableOpacity>

          <Text style={[$sessionText, { color: colors.alternativeText }]}>
            Session {dataIndex + 1}/{sessionCount.length}
          </Text>
          <TouchableOpacity
            hitSlop={{ top: 15, bottom: 15, left: 10, right: 10 }}
            style={$snapArrow}
            onPress={() => snapToItem(snapNumber + 1)}
          >
            <Icon size={18} icon="right" color={colors.alternativeText} />
          </TouchableOpacity>
        </View>
        <ProgressBar progress={dataIndex} all={sessionCount} />
        <CarouselExercisesList workout={item} onPress={handleNavigateToExercise} />
      </View>
    )
  }

  return (
    <>
      <Carousel
        ref={carouselRef}
        sliderWidth={screenWidth - spacing.ml * 2}
        itemWidth={screenWidth - spacing.ml * 2}
        data={programData.cyclelist[currentCycleIndex]?.workouts}
        renderItem={renderItem}
        hasParallaxImages={true}
        onSnapToItem={(item) => setSnapNumber(item)}
        vertical={false}
      />
      {firstView ? (
        <View style={$buttonWrapper}>
          <Button
            style={{ backgroundColor: colors.primary, borderColor: colors.border }}
            onPress={async () => {
              navigation.navigate("PreBlockMaxes" as never)
            }}
            preset="default"
          >
            Set Maxes
          </Button>
        </View>
      ) : (
        <>
          <Card
            style={[$item, { backgroundColor: colors.grey, borderColor: colors.border }]}
            verticalAlignment="force-footer-bottom"
            preset="reversed"
            ContentComponent={
              <TouchableOpacity
                onPress={() => navigation.navigate("WeekComplete" as never)}
                style={$cardContainer}
              >
                <Text
                  weight="bold"
                  size="md"
                  text="View Progress Reports"
                  style={[$title, { color: colors.text }]}
                />
              </TouchableOpacity>
            }
            RightComponent={
              <View style={$cardContainer}>
                <Icon color={colors.primary} size={18} icon="right" />
              </View>
            }
          />
        </>
      )}
    </>
  )
})

const $buttonWrapper: ViewStyle = {
  justifyContent: "center",
  marginTop: spacing.sm,
}
const $snapArrow: ViewStyle = {
  paddingHorizontal: spacing.xl,
}
const $cardContainer: ViewStyle = {
  alignItems: "flex-start",
  justifyContent: "center",
}
const $title: TextStyle = {
  textAlign: "center",
  paddingVertical: spacing.xs,
}

const $item: ViewStyle = {
  marginTop: spacing.md,
  minHeight: 40,
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
  overflow: "hidden",
}
