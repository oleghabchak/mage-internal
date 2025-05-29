import React, { useState } from "react"
import { generateUUID } from "app/utils/uuid"
import { IAbilityByGroup } from "app/models/ProgramStore"
import { observer } from "mobx-react-lite"
import { useStores } from "app/models"
import { colors, spacing, typography } from "app/theme"
import { IUppdateAbility } from "app/utils/types/UserData"
import { ActivityIndicator, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { BottomPopup } from "../BottomPopup/BottomPopup"
import { BottomPopupCard } from "../BottomPopup/BottomPopupCard"
import { BottomPopupModal } from "../BottomPopup/BottomPopupModal"
import { Text } from "../Text"
import { trimmTitleString } from "app/utils/functions"
import { useTheme } from "@react-navigation/native"
import { ColorsInterface } from "app/theme/colorsInterface"

interface MaxesExercisesListProps {
  abilities: IAbilityByGroup[]
}

const MaxesExercisesList: React.FC<MaxesExercisesListProps> = observer(function MaxesExercises({
  abilities,
}) {
  const {
    programStore: { setMaxes },
  } = useStores()

  const [openedSectionId, setOpenedSectionId] = useState<number | string | null>(null)
  const { colors: themeColors } = useTheme() as ColorsInterface
  return abilities.map((ability) => {
    const [isLoading, setIsLoading] = useState(false)
    const title = ability.name
    const isVisible = ability.id === openedSectionId

    const handleClosePopup = () => {
      setOpenedSectionId(null)
    }

    const handleSubmit = async (value: number | string) => {
      try {
        setIsLoading(true)
        if (value && value !== ability.ability) {
          const updateAbilityData: IUppdateAbility = {
            id: ability.id,
            exercise_id: ability.exercise_id,
            ability: value,
          }
          await setMaxes(updateAbilityData)
        }
      } catch (error) {
        console.error("error", error)
      } finally {
        setIsLoading(false)
      }
    }

    return (
      <View key={generateUUID()}>
        <TouchableOpacity
          style={[$center, { backgroundColor: themeColors.alternativeText }]}
          onPress={() => setOpenedSectionId(ability.id)}
          disabled={isLoading}
        >
          <Text style={[$titleText, { color: themeColors.primary }]}>
            {trimmTitleString(title, 20)}
          </Text>

          {isLoading ? (
            <View style={$loaderContainer}>
              <ActivityIndicator size={"small"} color={themeColors.primary} />
            </View>
          ) : (
            <Text style={[$titleText, { color: themeColors.primary }]}>{`${
              ability.ability || 0
            }kg`}</Text>
          )}
        </TouchableOpacity>
        <BottomPopup isVisible={isVisible} onClose={handleClosePopup} minHeight="30%">
          <BottomPopupCard title={title}>
            <BottomPopupModal
              onSubmit={handleSubmit}
              onClose={handleClosePopup}
              initialAbility={+ability.ability}
            />
          </BottomPopupCard>
        </BottomPopup>
      </View>
    )
  })
})

export default MaxesExercisesList

const $center: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  backgroundColor: colors.palette.white,
  borderRadius: 8,
  marginVertical: 4,
}

const $titleText: TextStyle = {
  paddingHorizontal: 20,
  paddingVertical: 4,
  color: colors.palette.white,
  fontSize: 16,
  fontFamily: typography.primary.semiBold,
  textAlign: "center",
}

const $loaderContainer: ViewStyle = { alignSelf: "center", marginRight: spacing.lg }
