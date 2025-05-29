import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { AppStackScreenProps } from "app/navigators"
import { Screen } from "app/components"
import { useHeader } from "app/utils/useHeader"
import { ExerciseSlider } from "app/components/BlockComponents/ExerciseSlider"
import { useStores } from "app/models"
import { IProgram } from "app/models/ProgramStore"
import { Loader } from "app/components/Loader"
import {
  createArrayOfExerxisesGroups,
  findExercisesByGroup,
  getBlockWRSData,
  getBlockBodyData,
  getValuesForWRSDiagram,
  getValuesForBodyDiagram,
} from "app/utils/functions"
import {
  IBlockDataItem,
  ICycleExercisesFilteredByGroup,
  IDataForDiagram,
} from "app/utils/types/DiagramData"
import BlockSlider from "app/components/BlockComponents/BlockSlider"
import ChartCard from "app/components/ChartCardWRS"
import { useTheme } from "@react-navigation/native"
import { ColorsInterface } from "app/theme/colorsInterface"

interface BlockDataScreenProps extends AppStackScreenProps<"BlockData"> {}

export const BlockDataScreen: FC<BlockDataScreenProps> = observer(function FinishedBlockScreen() {
  const {
    programStore: { currentPastProgramId, fetchProgramById, isLoading, setLoading },
  } = useStores()

  const [pastProgram, setPastProgram] = useState<IProgram | null>(null)
  const [currentGroups, setCurrentGroups] = useState<string[]>([])
  const [currentGroupIndex, setCurrentGroupIndex] = useState<number>(0)

  const [dataForWRSDiagram, setDataForWRSDiagram] = useState<IDataForDiagram[][] | null>(null)
  const [dataForBodyDiagram, setDataForBodyDiagram] = useState<IDataForDiagram[][] | null>(null)
  const [blockWRSData, setBlockWRSData] = useState<IBlockDataItem[] | null>(null)
  const [blockBodyData, setBlockBodyData] = useState<IBlockDataItem[] | null>(null)

  const fetchCurrentPastProgram = async () => {
    if (currentPastProgramId) {
      try {
        setLoading(true)
        const program = await fetchProgramById(currentPastProgramId)
        setPastProgram(program)
      } catch (error) {
        console.error("fetchCurrentPastProgram Error", error)
      } finally {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    if (pastProgram) {
      const groups: string[] = createArrayOfExerxisesGroups(pastProgram, "movement")
      setCurrentGroups(groups)
      const exercises: ICycleExercisesFilteredByGroup[] = findExercisesByGroup(
        pastProgram,
        groups[currentGroupIndex],
      )
      setDataForWRSDiagram(getValuesForWRSDiagram(exercises))
      setBlockWRSData(getBlockWRSData(exercises))

      setDataForBodyDiagram(getValuesForBodyDiagram(exercises))
      setBlockBodyData(getBlockBodyData(exercises))
    }
  }, [pastProgram, currentGroupIndex])

  useEffect(() => {
    setTimeout(() => {
      fetchCurrentPastProgram()
    }, 200)
  }, [currentPastProgramId])

  const { colors } = useTheme() as ColorsInterface
  useHeader(
    {
      title: "Overall Data",
      titleContainerStyle: {
        alignItems: "center",
        justifyContent: "flex-start",
        height: "70%",
      },
      titleStyle: {
        fontSize: 18,
        color: colors.text,
      },
      hideRightIcon: false,
      backgroundColor: colors.background,
    },
    [colors],
  )

  return (
    <Screen preset="scroll">
      {pastProgram && <BlockSlider title={pastProgram.name} />}
      {(dataForWRSDiagram || dataForBodyDiagram) && (
        <ExerciseSlider
          groups={currentGroups}
          currentGroupIndex={currentGroupIndex}
          setCurrentGroupIndex={setCurrentGroupIndex}
        />
      )}

      {dataForWRSDiagram && (
        <ChartCard
          dataForDiagram={dataForWRSDiagram}
          programData={pastProgram}
          blockData={blockWRSData}
        />
      )}

      {dataForBodyDiagram && (
        <ChartCard
          dataForDiagram={dataForBodyDiagram}
          programData={pastProgram}
          blockData={blockBodyData}
        />
      )}

      <Loader isVisible={isLoading} />
    </Screen>
  )
})
