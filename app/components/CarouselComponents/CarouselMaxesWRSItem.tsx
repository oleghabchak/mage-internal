import { IExercise } from "app/models/ProgramStore"
import React, { useState } from "react"
import { TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Text } from "../Text"
import { createPlannedText } from "app/utils/functions"
import { colors, spacing, typography } from "app/theme"
import { observer } from "mobx-react-lite"
import { BottomPopup } from "../BottomPopup/BottomPopup"
import { BottomPopupCard } from "../BottomPopup/BottomPopupCard"
import { BottomPopupModal } from "../BottomPopup/BottomPopupModal"
import { IUppdateAbility } from "app/utils/types/UserData"
import { useStores } from "app/models"
import { useTheme } from "@react-navigation/native"
import { ColorsInterface } from "app/theme/colorsInterface"

interface CarouselMaxesWRSItemProps {
  exercise: IExercise
}

export const CarouselMaxesWRSItem: React.FC<CarouselMaxesWRSItemProps> = observer(
  function CarouselExerciseItem({ exercise }) {
    const {
      programStore: { getAbilityIdByExerciseId, setMaxes },
    } = useStores()
    const { colors } = useTheme() as ColorsInterface
    const { name, ability, id } = exercise
    const [openedSection, setOpenedSection] = useState(false)

    const plannedText = createPlannedText(exercise)

    const handleOpenEdditPopup = () => setOpenedSection(true)
    const handleCloseBottomPopup = () => {
      setOpenedSection(false)
    }
    const handleSubmit = async (value: string | number) => {
      const abilityId = getAbilityIdByExerciseId(id)
      const abilityData: IUppdateAbility = {
        id: abilityId,
        exercise_id: id,
        ability: value,
      }
      setMaxes(abilityData)
      handleCloseBottomPopup()
    }

    return (
      <View>
        <TouchableOpacity onPress={handleOpenEdditPopup} style={$container}>
          <View style={[$titleContainer, { backgroundColor: colors.grey }]}>
            <Text style={[$titleText, { color: colors.text }]}>{name} </Text>
            <Text style={[$plannedText, { color: colors.text }]}>{plannedText}</Text>
          </View>
          <View style={[$e1rmContainer, { backgroundColor: colors.grey }]}>
            <Text style={[$e1rmText, { color: colors.text }]}>{`E1rm - ${ability}kg`}</Text>
          </View>
        </TouchableOpacity>
        <BottomPopup isVisible={openedSection} onClose={handleCloseBottomPopup} minHeight="30%">
          <BottomPopupCard title={name}>
            <BottomPopupModal
              onSubmit={handleSubmit}
              onClose={handleCloseBottomPopup}
              initialAbility={+ability}
            />
          </BottomPopupCard>
        </BottomPopup>
      </View>
    )
  },
)

const $container: ViewStyle = {
  gap: spacing.md,
}

const $titleContainer: ViewStyle = {
  backgroundColor: colors.palette.white,
  borderRadius: spacing.xs,
  height: 30,
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: spacing.md,
  gap: spacing.lg,
}

const $titleText: TextStyle = {
  color: colors.palette.black,
  fontSize: 16,
  fontFamily: typography.primary.semiBold,
}

const $plannedText: TextStyle = {
  color: colors.palette.black,
  fontSize: 14,
  fontFamily: typography.primary.normal,
}

const $e1rmContainer: ViewStyle = {
  borderRadius: spacing.xxs,
  backgroundColor: colors.palette.white,
  alignSelf: "flex-start",
  paddingHorizontal: spacing.md,
  height: 30,
  alignItems: "center",
}

const $e1rmText: TextStyle = {
  ...$titleText,
  lineHeight: 30,
}
