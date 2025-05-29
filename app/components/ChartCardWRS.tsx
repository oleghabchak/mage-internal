import { IBlockDataItem, IDataForDiagram } from "app/utils/types/DiagramData"
import React from "react"
import { Card } from "./Card"
import { LineChart } from "react-native-gifted-charts"
import { colors, spacing } from "app/theme"
import { colorsForValues } from "app/theme/variables"
import { createArrayWithDataLength } from "app/utils/functions"
import { Dimensions, View } from "react-native"
import { IProgram } from "app/models/ProgramStore"
import { BlockWRSList } from "./BlockComponents"
import { useTheme } from "@react-navigation/native"
import { ColorsInterface } from "app/theme/colorsInterface"

interface ChartCardWRSProps {
  dataForDiagram: IDataForDiagram[][]
  programData: IProgram | null
  blockData: IBlockDataItem[] | null
}

const ChartCardWRS: React.FC<ChartCardWRSProps> = ({ dataForDiagram, programData, blockData }) => {
  const chunks = Math.ceil(dataForDiagram.length / 5)
  const diagramWidth = Dimensions.get("window").width - 130

  const { colors: themeColors } = useTheme() as ColorsInterface
  return Array.from({ length: chunks }).map((_, chunkIndex) => {
    const start = chunkIndex * 5
    const end = start + 5
    const dataChunk = dataForDiagram.slice(start, end)
    return (
      <Card
        key={chunkIndex}
        shadow={false}
        preset="reversed"
        style={{
          marginVertical: spacing.ml,
          paddingVertical: spacing.ml,
          backgroundColor: themeColors.grey,
        }}
        verticalAlignment="center"
        ContentComponent={
          <LineChart
            areaChart
            data={dataChunk[0]}
            data2={dataChunk[1]}
            data3={dataChunk[2]}
            data4={dataChunk[3]}
            data5={dataChunk[4]}
            hideDataPoints
            hideRules
            showXAxisIndices={true}
            showYAxisIndices={true}
            xAxisIndicesHeight={15}
            xAxisIndicesWidth={1}
            yAxisIndicesHeight={1}
            yAxisIndicesWidth={15}
            dataPointLabelWidth={10}
            dataPointLabelShiftX={4}
            dataPointLabelShiftY={4}
            color1={colorsForValues[0]}
            color2={colorsForValues[1]}
            color3={colorsForValues[3]}
            color4={colorsForValues[4]}
            color5={colorsForValues[5]}
            startFillColor1={colorsForValues[0]}
            startFillColor2={colorsForValues[1]}
            startFillColor3={colorsForValues[3]}
            startFillColor4={colorsForValues[4]}
            startFillColor5={colorsForValues[5]}
            endFillColor1={colorsForValues[0]}
            endFillColor2={colorsForValues[1]}
            endFillColor3={colorsForValues[3]}
            endFillColor4={colorsForValues[4]}
            endFillColor5={colorsForValues[5]}
            xAxisLabelTexts={createArrayWithDataLength(programData?.cycles || 0)}
            startOpacity={0.7}
            endOpacity={0}
            initialSpacing={0}
            noOfSections={4}
            yAxisColor={themeColors.text}
            xAxisColor={themeColors.text}
            yAxisThickness={1}
            xAxisThickness={1}
            rulesType="solid"
            rulesColor="gray"
            width={diagramWidth}
            adjustToWidth={true}
            xAxisLabelTextStyle={{ color: themeColors.text }}
            yAxisIndicesColor={themeColors.text}
            xAxisIndicesColor={themeColors.text}
            yAxisTextStyle={{ color: themeColors.text }}
            pointerConfig={{
              pointerStripUptoDataPoint: true,
              pointerStripColor: themeColors.text,
              pointerStripWidth: 2,
              strokeDashArray: [2, 5],
              pointerColor: colors.text,
              radius: 4,
              pointerLabelWidth: 200,
              pointerLabelHeight: 120,
            }}
          />
        }
        FooterComponent={
          blockData ? (
            <BlockWRSList blockData={blockData.slice(start, Math.min(end, blockData.length))} />
          ) : (
            <View />
          )
        }
      />
    )
  })
}

export default ChartCardWRS
