import React, { FC, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { TextInput, TextStyle, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Button, Card, Icon, Screen, Text, TextField } from "app/components"
import { colors, spacing, typography } from "app/theme"
import { useHeader } from "app/utils/useHeader"
import { useStores } from "app/models"
import { generateUUID } from "app/utils/uuid"
import { useTheme } from "@react-navigation/native"
import { ColorsInterface } from "app/theme/colorsInterface"

interface CoachScreenProps extends AppStackScreenProps<"Coach"> {}

export const CoachScreen: FC<CoachScreenProps> = observer(function CoachScreen() {
  const NameInput = useRef<TextInput>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const { colors: themeColors } = useTheme() as ColorsInterface
  const {
    authenticationStore: { trainerList, fetchTrainerList, setTrainer, trainerName, athletetrainer },
  } = useStores()

  useHeader(
    {
      title: "Coach",
      titleContainerStyle: {
        alignItems: "center",
        justifyContent: "flex-start",
        height: "70%",
      },
      titleStyle: {
        fontSize: spacing.xl,
        color: themeColors.text,
      },
      hideRightIcon: true,
      backgroundColor: themeColors.background,
    },
    [],
  )
  useEffect(() => {
    fetchTrainerList()
  }, [])

  const filteredTrainerList = trainerList.filter(
    (trainer) =>
      trainer.firstname.toLowerCase().includes(searchQuery.toLowerCase()) &&
      trainer.id !== athletetrainer,
  )

  return (
    <Screen statusBarStyle="dark" preset="scroll" contentContainerStyle={$screenContentContainer}>
      <Card
        verticalAlignment="center"
        style={{ backgroundColor: themeColors.primary, borderColor: themeColors.border }}
        ContentComponent={
          <>
            <Text style={[$cardTitleText, { color: themeColors.alternativeText }]}>
              {" "}
              {trainerName
                ? "You are connected to "
                : "Find your coach by searching there name below"}
            </Text>
            {trainerName && (
              <Text style={[$titleText, { color: themeColors.alternativeText }]}>
                {" "}
                {trainerName}
              </Text>
            )}
          </>
        }
      ></Card>
      {trainerName && (
        <Text
          preset="formLabel"
          text={"Connect to a different coach"}
          style={[$labelStyle, { color: themeColors.text }]}
        />
      )}
      <TextField
        ref={NameInput}
        onChangeText={setSearchQuery}
        containerStyle={$textField}
        autoCapitalize="none"
        autoComplete="additional-name"
        autoCorrect={false}
        keyboardType="email-address"
        label="Name"
        placeholder="Coach name"
        placeholderTextColor={themeColors.text}
        inputWrapperStyle={$fieldInputWrapper}
        LabelTextProps={{
          preset: "bold",
          style: [$inputLabel, { color: themeColors.text }],
        }}
        inputTextStyle={{ color: themeColors.text }}
        RightAccessory={(props) => (
          <Icon icon="search" containerStyle={props.style} color={themeColors.primary} size={21} />
        )}
      />

      {filteredTrainerList.map((trainer) => {
        const handleConnectToTrainer = () => {
          setTrainer(trainer.id)
        }

        return (
          <Card
            key={generateUUID()}
            style={[
              $coachCard,
              { backgroundColor: themeColors.grey, borderColor: themeColors.border },
            ]}
            LeftComponent={
              <Text style={[$titleText, { color: themeColors.text }]}>{trainer.firstname}</Text>
            }
            RightComponent={
              <Button
                shadow={true}
                style={[
                  $coachBottom,
                  { backgroundColor: themeColors.primary, borderColor: themeColors.border },
                ]}
                textStyle={{ color: themeColors.alternativeText }}
                text="Connect"
                pressedStyle={{ backgroundColor: colors.palette.grey1 }}
                onPress={handleConnectToTrainer}
              />
            }
          />
        )
      })}
    </Screen>
  )
})

const $screenContentContainer: ViewStyle = {
  display: "flex",
  justifyContent: "space-between",
  flex: 1,
}
const $cardTitleText: TextStyle = {
  paddingHorizontal: 20,
  paddingVertical: 0,
  color: colors.palette.white,
  fontSize: 16,
  fontFamily: typography.primary.semiBold,
  textAlign: "center",
}
const $titleText: TextStyle = {
  paddingHorizontal: 20,
  paddingVertical: 0,
  color: colors.palette.grey7,
  fontSize: 20,
  fontFamily: typography.primary.medium,
  textAlign: "center",
}
const $textField: ViewStyle = {
  marginBottom: spacing.xs,
}
const $fieldInputWrapper: ViewStyle = {
  backgroundColor: "transparent",
  borderColor: colors.palette.grey2,
}
const $coachCard: ViewStyle = {
  marginTop: spacing.sm,
  backgroundColor: colors.palette.grey5,
  borderColor: colors.palette.grey6,
  paddingVertical: spacing.md,
}
const $coachBottom: TextStyle = {
  width: 100,
  height: 22,
  lineHeight: 22,
  paddingVertical: 0,
  paddingHorizontal: 10,
}
const $inputLabel: TextStyle = {
  color: "black",
  fontSize: 16,
  fontFamily: typography.fonts.manrope.bold,
  marginBottom: spacing.xs,
}
const $labelStyle: TextStyle = {
  color: colors.palette.black,
  fontFamily: typography.fonts.manrope.bold,
  fontSize: 16,
  marginVertical: spacing.sm,
}
