import { spacing } from "app/theme"
import { generateUUID } from "app/utils/uuid"
import React, { useEffect, useState } from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import { Dimensions } from "react-native"
import { Card } from "../Card"
import CircularProgressChart from "./CircularProgressChart"
import { Icon } from "../Icon"
import { WeekCompleteBarItem } from "./WeekCompleteBarItem"
import { observer } from "mobx-react-lite"
import { useNavigation, useTheme } from "@react-navigation/native"
import { useStores } from "app/models"
import {
  createArrayOfExerxisesGroups,
  countAmountByGroupForCycle,
  calculatePercentage,
} from "app/utils/functions"
import { useHeader } from "app/utils/useHeader"
import { Button } from "../Button"
import { BottomPopup } from "../BottomPopup/BottomPopup"
import { BottomPopupCard } from "../BottomPopup/BottomPopupCard"
import { BottomPopupWarning } from "../BottomPopup/BottomPopupWarning"
import { StartingNewButtons } from "./StartingNewButtons"
import { ColorsInterface } from "app/theme/colorsInterface"

const chartColors = [
  "#036666",
  "#EC9898",
  "#84D0D0",
  "#EDA12E",
  "#59A6DE",
  "#8B59DE",
  "#DEC159",
  "#B0BC1F",
]

interface IDataForChart {
  value: number
  color: string
  shadowColor: string
  label: string
}

interface WeekCompleteContentProps {}

export const WeekCompleteContent: React.FC<WeekCompleteContentProps> = observer(
  function WeekCompleteContent() {
    const {
      programStore: {
        programData,
        currentCycleFinished,
        setNextCycle,
        getCurrentCycle,
        currentCycleIsLast,
        currentSessionIsLast,
        lastChange,
        setCurrentCycle,
        endProgram,
        fetchProgram,
        fetchProgramList,
      },
    } = useStores()
    const { colors: themeColors } = useTheme() as ColorsInterface
    const [dataForDiagram, setDataForDiagram] = useState<IDataForChart[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [openedConfirmPopup, setOpenedConfirmPopup] = useState(false)
    const screenWidth = Dimensions.get("window").width
    const navigation = useNavigation()
    const { workouts } = getCurrentCycle

    useEffect(() => {
      const data: IDataForChart[] = []
      const groupName: "muscle" | "movement" = "muscle"
      const groupItems: string[] = createArrayOfExerxisesGroups(programData, groupName)

      groupItems.map((groupItem, index) => {
        const value = countAmountByGroupForCycle(getCurrentCycle.workouts, groupItem, groupName)

        if (value) {
          const dataItemForDiagram: IDataForChart = {
            value,
            color: chartColors[index],
            shadowColor: chartColors[index],
            label: groupItem,
          }

          data.push(dataItemForDiagram)
        }

        return null
      })

      const sortedAndSlicedData = data
        .sort((firstItem, secondItem) => secondItem.value - firstItem.value)
        .slice(0, 8)

      setDataForDiagram(sortedAndSlicedData)
    }, [lastChange])

    const percentagesValues = calculatePercentage(dataForDiagram)

    useHeader(
      {
        title: programData.name,
        titleContainerStyle: {
          alignItems: "center",
          justifyContent: "flex-start",
          height: "70%",
        },
        titleStyle: {
          fontSize: spacing.md,
          color: themeColors.text,
        },
        hideRightIcon: false,
        backgroundColor: themeColors.background,
      },
      [themeColors],
    )

    const onStartNewCycle = async () => {
      try {
        setIsLoading(true)
        await setNextCycle()
        await navigation.navigate("DemoCommunity" as never)
        setCurrentCycle(programData.currentcycle)
        setTimeout(() => {
          navigation.navigate("Exercises" as never)
        }, 200)
      } catch (error) {
        console.error("fetchProgramData error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    const handleCloseConfirmPopup = () => {
      setOpenedConfirmPopup(false)
    }
    const handleEndProgram = async () => {
      await endProgram(programData.id)
      await fetchProgramList()
      await fetchProgram()
      await navigation.navigate("DemoHomeScreen" as never)
      navigation.navigate("FinishedBlock" as never)
    }
    const titleOfPopup =
      currentCycleIsLast && currentSessionIsLast
        ? "This action will finish the program"
        : "This workout cycle is not yet complete."
    return (
      <View>
        <CircularProgressChart
          size={screenWidth - 115}
          sessionsCount={3}
          maxValue={15}
          values={percentagesValues}
        />
        <Card
          preset="reversed"
          shadow={true}
          style={{
            marginVertical: spacing.lg,
            backgroundColor: themeColors.grey,
            borderColor: themeColors.border,
          }}
          ContentComponent={
            <>
              {workouts?.map((workout, index) => {
                const finishedExercises = workout.exercises.reduce(
                  (accumulator, value) => accumulator + +value.touched,
                  0,
                )
                const progress = (finishedExercises / workout.exercises.length) * 100

                return (
                  <WeekCompleteBarItem
                    key={generateUUID()}
                    title={`Session ${index + 1}`}
                    progress={progress}
                  />
                )
              })}
            </>
          }
        />

        {currentCycleIsLast && currentSessionIsLast ? (
          <Button
            textStyle={$buttonText}
            text="End Program"
            onPress={() => setOpenedConfirmPopup(true)}
            style={[$button, { backgroundColor: themeColors.primary }]}
            LeftAccessory={() => <View style={{ width: spacing.sm }} />}
            RightAccessory={() => <Icon icon="rightArrow" />}
            isLoading={isLoading}
            disabled={isLoading}
          />
        ) : (
          <StartingNewButtons
            currentCycleFinished={currentCycleFinished}
            onStartNewCycle={onStartNewCycle}
            setOpenedConfirmPopup={setOpenedConfirmPopup}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            backgroundColor={themeColors.primary}
            color={themeColors.alternativeText}
          />
        )}
        <BottomPopup
          minHeight={"35%"}
          isVisible={openedConfirmPopup}
          onClose={handleCloseConfirmPopup}
        >
          <BottomPopupCard title={titleOfPopup}>
            <BottomPopupWarning
              description="By confirming this, you agree that you will not be able to return to incomplete exercises or resume an incomplete cycle at a later date."
              onClose={handleCloseConfirmPopup}
              onSubmit={
                currentCycleIsLast && currentSessionIsLast ? handleEndProgram : onStartNewCycle
              }
            />
          </BottomPopupCard>
        </BottomPopup>
      </View>
    )
  },
)

const $button: ViewStyle = {
  marginTop: spacing.ml,
  justifyContent: "space-between",
  paddingHorizontal: spacing.xl,
}

const $buttonText: TextStyle = { lineHeight: 26, fontSize: 24 }
