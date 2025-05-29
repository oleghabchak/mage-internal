import { observer } from "mobx-react-lite"
import { useStores } from "app/models"
import React, { useEffect, useState } from "react"
import { Card } from "../Card"
import { Text } from "../Text"
import { Dimensions, ScrollView, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { BottomPopup } from "app/components/BottomPopup/BottomPopup"
import { BottomPopupCard } from "app/components/BottomPopup/BottomPopupCard"
import { BottomPopupModal } from "app/components/BottomPopup/BottomPopupModal"
import { colors, spacing, typography } from "app/theme"
import MaxesExercisesList from "./MaxesExercisesList"
import { IAbilityByGroup, IExerciseListItem } from "app/models/ProgramStore"
import { IUppdateAbility } from "app/utils/types/UserData"
import { filterUniqueExercises } from "app/utils/functions"
import { Icon } from "../Icon"
import { TextField } from "../TextField"
import { generateUUID } from "app/utils/uuid"
import { useTheme } from "@react-navigation/native"
import { ColorsInterface } from "app/theme/colorsInterface"

interface GroupedDataType {
  [key: string]: { [key: string]: IAbilityByGroup }
}

const { height: screenHeight } = Dimensions.get("window")

interface MaxesGroupCardsListProps {}

export const MaxesGroupCardsList: React.FC<MaxesGroupCardsListProps> = observer(
  function MaxesGroupCardsList() {
    const {
      programStore: {
        exercisesList,
        fetchExerciseList,
        setMaxes,
        fetchAbilitiesByGroup,
        abilitiesByGroup,
      },
    } = useStores()

    const { colors: themeColors } = useTheme() as ColorsInterface
    const filteredAbilities: IAbilityByGroup[] = filterUniqueExercises(abilitiesByGroup)
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [openedSection, setOpenedSection] = useState<boolean>(false)
    const [exerciseItem, setExerciseItem] = useState<IExerciseListItem | null>(null)

    useEffect(() => {
      fetchAbilitiesByGroup()
      if (exercisesList.length === 0) {
        fetchExerciseList()
      }
    }, [])

    const sortedByGroupAbilities = () => {
      const groupedData: GroupedDataType = {}

      abilitiesByGroup.forEach((item) => {
        const group = item.groupname
        const exerciseId = item.exercise_id

        if (!groupedData[group]) {
          groupedData[group] = {}
        }

        groupedData[group][exerciseId] = item
      })

      const sortedData = []
      for (const group in groupedData) {
        sortedData.push(Object.values(groupedData[group]))
      }

      sortedData.sort((a, b) => {
        if (b[0].groupname < a[0].groupname) {
          return -1
        }
        if (b[0].groupname > a[0].groupname) {
          return 1
        }
        return 0
      })

      return sortedData
    }

    const handleCloseExerciseList = () => {
      setOpenedSection(false)
      setExerciseItem(null)
    }

    const handleOpenExerciseList = () => {
      setOpenedSection(true)
    }

    const handleSubmit = async (value: string | number) => {
      try {
        if (value && exerciseItem) {
          const updateAbilityData: IUppdateAbility = {
            exercise_id: +exerciseItem.id,
            ability: value,
          }
          setMaxes(updateAbilityData)
        }
      } finally {
        setOpenedSection(false)
      }
    }
    const filteredListBasedOnSearch = exercisesList.filter(
      (exercise) =>
        !filteredAbilities.find(
          (filteredAbilitiesItem) => filteredAbilitiesItem.exercise_id === exercise.id,
        ) && exercise.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    return (
      <View>
        {sortedByGroupAbilities().map((abilities) => {
          return (
            <Card
              key={generateUUID()}
              shadow={true}
              preset="reversed"
              style={{ backgroundColor: themeColors.grey }}
              HeadingComponent={
                <Text style={[$leftTitle, { color: themeColors.text }]}>
                  {abilities[0].groupname}
                </Text>
              }
              ContentComponent={<MaxesExercisesList abilities={abilities} />}
              FooterComponent={
                <TouchableOpacity style={$right} onPress={handleOpenExerciseList}>
                  <Text style={[$titleText, { color: themeColors.text }]}> New max + </Text>
                </TouchableOpacity>
              }
            />
          )
        })}

        <BottomPopup
          isVisible={openedSection}
          onClose={handleCloseExerciseList}
          minHeight={exerciseItem ? "30%" : "67%"}
        >
          {exerciseItem ? (
            <BottomPopupCard title={exerciseItem.name}>
              <BottomPopupModal
                onClose={handleCloseExerciseList}
                initialAbility={0}
                onSubmit={handleSubmit}
              />
            </BottomPopupCard>
          ) : (
            <BottomPopupCard title={"Chose exercise"}>
              <TextField
                onChangeText={setSearchQuery}
                containerStyle={$textField}
                inputWrapperStyle={{ height: spacing.xxl }}
                placeholder="Search exercises..."
                RightAccessory={(props) => (
                  <Icon icon="search" containerStyle={props.style} size={21} />
                )}
              />
              <ScrollView style={{ paddingHorizontal: spacing.sm, height: screenHeight / 2 }}>
                {filteredListBasedOnSearch.map((exercise, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        setExerciseItem(exercise)
                      }}
                      style={$center}
                    >
                      <Text style={[$titleText, { color: colors.palette.primary }]}>
                        {exercise.name}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </ScrollView>
            </BottomPopupCard>
          )}
        </BottomPopup>
      </View>
    )
  },
)

const $center: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  backgroundColor: colors.palette.white,
  borderRadius: 8,
  marginVertical: 4,
}

const $leftTitle: TextStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  fontSize: 20,
  color: colors.palette.black,
  textAlign: "left",
  fontFamily: typography.primary.semiBold,
  paddingHorizontal: 10,
  paddingVertical: 5,
}

const $right: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-end",
}

const $titleText: TextStyle = {
  paddingHorizontal: 20,
  paddingVertical: 4,
  color: colors.palette.white,
  fontSize: 16,
  fontFamily: typography.primary.semiBold,
  textAlign: "center",
}

const $textField: TextStyle = {
  paddingVertical: 4,
  paddingHorizontal: 10,
}
