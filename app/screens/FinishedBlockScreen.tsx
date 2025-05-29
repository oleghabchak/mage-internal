import React, { FC, useEffect, useState } from "react"
import { TextStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Card, Screen, Text } from "app/components"
import { colors, spacing, typography } from "app/theme"
import { useHeader } from "app/utils/useHeader"
import { ExerciseSlider } from "app/components/BlockComponents/ExerciseSlider"
import { useStores } from "app/models"
import {
  createArrayOfExerxisesGroups,
  findExercisesByGroup,
  getBlockBodyData,
  getBlockWRSData,
  getValuesForBodyDiagram,
  getValuesForWRSDiagram,
} from "app/utils/functions"
import {
  IBlockDataItem,
  ICycleExercisesFilteredByGroup,
  IDataForDiagram,
} from "app/utils/types/DiagramData"
import ChartCardWRS from "app/components/ChartCardWRS"
import ChartCardBody from "app/components/ChartCardBody"
import { useTheme } from "@react-navigation/native"
import { ColorsInterface } from "app/theme/colorsInterface"

interface FinishedBlockScreenProps extends AppStackScreenProps<"FinishedBlock"> {}

export const FinishedBlockScreen: FC<FinishedBlockScreenProps> = () => {
  const {
    programStore: { programData },
  } = useStores()
  const [currentGroups, setCurrentGroups] = useState<string[]>([])
  const [currentGroupIndex, setCurrentGroupIndex] = useState<number>(0)

  const [dataForWRSDiagram, setDataForWRSDiagram] = useState<IDataForDiagram[][] | null>(null)
  const [dataForBodyDiagram, setDataForBodyDiagram] = useState<IDataForDiagram[][] | null>(null)
  const [blockWRSData, setBlockWRSData] = useState<IBlockDataItem[] | null>(null)
  const [blockBodyData, setBlockBodyData] = useState<IBlockDataItem[] | null>(null)

  useEffect(() => {
    if (programData) {
      const groups: string[] = createArrayOfExerxisesGroups(programData, "movement")
      setCurrentGroups(groups)
      const exercises: ICycleExercisesFilteredByGroup[] = findExercisesByGroup(
        programData,
        groups[currentGroupIndex],
      )
      setDataForWRSDiagram(getValuesForWRSDiagram(exercises))
      setBlockWRSData(getBlockWRSData(exercises))
      setDataForBodyDiagram(getValuesForBodyDiagram(exercises))
      setBlockBodyData(getBlockBodyData(exercises))
    }
  }, [currentGroupIndex, programData])

  const { colors } = useTheme() as ColorsInterface
  useHeader(
    {
      title: "Overall Data",
      titleContainerStyle: {
        alignItems: "center",
        justifyContent: "flex-start",
        height: "70%",
        backgroundColor: colors.background,
      },
      titleStyle: {
        fontSize: 18,
      },
      hideRightIcon: false,
      backgroundColor: colors.background,
    },
    [],
  )

  return (
    <Screen preset="scroll">
      <Card
        shadow={true}
        style={{ marginBottom: spacing.ml }}
        verticalAlignment="center"
        ContentComponent={<Text style={$titleText}>Congrats on finishing your program. </Text>}
      />
      {(dataForWRSDiagram || dataForBodyDiagram) && (
        <ExerciseSlider
          groups={currentGroups}
          currentGroupIndex={currentGroupIndex}
          setCurrentGroupIndex={setCurrentGroupIndex}
        />
      )}

      {dataForWRSDiagram && (
        <ChartCardWRS
          dataForDiagram={dataForWRSDiagram}
          programData={programData}
          blockData={blockWRSData}
        />
      )}

      {dataForBodyDiagram && (
        <ChartCardBody
          dataForDiagram={dataForBodyDiagram}
          programData={programData}
          blockData={blockBodyData}
        />
      )}
    </Screen>
  )
}

const $titleText: TextStyle = {
  paddingHorizontal: spacing.xl,
  color: colors.palette.white,
  fontSize: 16,
  lineHeight: 20,
  fontFamily: typography.primary.semiBold,
  textAlign: "center",
}
