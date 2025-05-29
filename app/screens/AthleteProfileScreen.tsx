/* eslint-disable react-native/no-inline-styles */
import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { RefreshControl, ScrollView, Text, TextStyle, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Button, Card } from "app/components"
import { useHeader } from "app/utils/useHeader"
import { colors, spacing, typography } from "app/theme"
import { useNavigation, useTheme } from "@react-navigation/native"
import { AthletProfileTextField } from "app/components/AthletProfileTextField"
import { useStores } from "app/models"
import {
  activityData,
  dietData,
  experienceData,
  genderData,
  sleepData,
} from "app/utils/types/PickersData"
import AthletProfilePicker from "app/components/AthletProfilePicker"
import { getTextByDifferentiator } from "app/utils/functions"
import DifferentiatorProgressBar from "../components/DifferentiatorProgressBar"
import { IUserData } from "app/utils/types/UserData"
import userService from "app/services/user/userService"
import { ColorsInterface } from "app/theme/colorsInterface"

interface AthleteProfileScreenProps extends AppStackScreenProps<"AthleteProfile"> {}

export const AthleteProfileScreen: FC<AthleteProfileScreenProps> = observer(
  function AthleteProfileScreen() {
    const { colors } = useTheme() as ColorsInterface
    useHeader(
      {
        title: "Athlete Profile",
        titleContainerStyle: {
          alignItems: "center",
          justifyContent: "flex-start",
          height: "70%",
        },
        titleStyle: {
          fontSize: spacing.lg,
          color: colors.text,
        },
        backgroundColor: colors.background,
        hideRightIcon: false,
      },
      [colors],
    )

    const {
      authenticationStore: {
        height,
        weight,
        gender,
        experience,
        sleep,
        diet,
        activity,
        dob,
        differentiator,
        setHeight,
        setWeight,
        setGender,
        setDob,
        updateUser,
        setExperience,
        setDiet,
        setSleep,
        setActivity,
        setUserData,
        setAthleteData,
      },
    } = useStores()

    const [formHeight, setFormHeight] = useState(height.toString())
    const [formWeight, setFormWeight] = useState(weight.toString())
    const [formGender, setFormGender] = useState(gender)
    const [formDob, setFormDob] = useState(dob)
    const [refreshing, setRefreshing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const { colors: themeColors } = useTheme() as ColorsInterface
    const navigation = useNavigation()
    const defauldGender = genderData.find((genderValue) => genderValue.option === gender)

    const onSubmit = async () => {
      try {
        setIsLoading(true)
        setHeight(formHeight)
        setWeight(formWeight)
        setGender(formGender)
        setDob(formDob)

        await updateUser()
        handleRefreshData()
        goBack()
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    const handleRefreshData = async () => {
      try {
        setRefreshing(true)
        const { data }: { data: IUserData } = await userService.getProfile()

        if (data.user && data.athlete) {
          setUserData(data.user)
          setAthleteData(data.athlete)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setRefreshing(false)
      }
    }

    const goBack = () => {
      navigation.canGoBack() ? navigation.goBack() : navigation.navigate("Settings" as never)
    }

    useEffect(() => {
      if (!+formHeight) setFormHeight("")
      if (!+formWeight) setFormWeight("")
    }, [formHeight, formWeight])

    return (
      <ScrollView
        style={[$screenContentContainer, { backgroundColor: colors.background }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefreshData} />}
      >
        <Card
          verticalAlignment="center"
          style={{ backgroundColor: colors.primary, borderColor: themeColors.border }}
          ContentComponent={
            <Text style={[$titleText, { color: colors.alternativeText }]}>
              {getTextByDifferentiator(differentiator)}
            </Text>
          }
        ></Card>

        <DifferentiatorProgressBar differentiator={differentiator} maxValue={0.36} />
        <View style={$formWrapper}>
          <AthletProfileTextField
            title={"Height"}
            value={formHeight}
            setValue={setFormHeight}
            keyboardType="numeric"
          />
          <AthletProfileTextField
            title={"Weight"}
            value={formWeight}
            setValue={setFormWeight}
            keyboardType="numeric"
          />
          <AthletProfileTextField
            title={"Gender"}
            value={defauldGender?.title || gender}
            setValue={setFormGender}
            editable={false}
          />
          <AthletProfileTextField
            title={"Birthday"}
            value={formDob}
            setValue={setFormDob}
            editable={false}
          />
          <AthletProfilePicker
            data={experienceData}
            defaultValue={experienceData[+experience]}
            onSelect={(value) => setExperience(value.id)}
            title={"Experience"}
            sliceSelector={1}
          />
          <AthletProfilePicker
            data={sleepData}
            defaultValue={sleepData[+sleep]}
            onSelect={(value) => setSleep(value.id)}
            title={"Sleep"}
            sliceSelector={1}
          />
          <AthletProfilePicker
            data={dietData}
            defaultValue={dietData[+diet]}
            onSelect={(value) => setDiet(value.id)}
            title={"Diet"}
            sliceSelector={1}
          />
          <AthletProfilePicker
            data={activityData}
            defaultValue={activityData[+activity]}
            onSelect={(value) => setActivity(value.id)}
            title={"Activity"}
            sliceSelector={1}
          />
        </View>

        <Button
          style={[$save, { backgroundColor: colors.primary, borderColor: themeColors.primary }]}
          textStyle={{ color: colors.alternativeText }}
          text="Save changes"
          onPress={onSubmit}
          isLoading={isLoading}
          disabled={isLoading}
        />
      </ScrollView>
    )
  },
)

const $titleText: TextStyle = {
  paddingHorizontal: 20,
  color: colors.palette.white,
  fontSize: 16,
  fontFamily: typography.primary.medium,
  textAlign: "center",
}

const $save: ViewStyle = {
  marginTop: spacing.xl,
  marginHorizontal: "15%",
}

const $formWrapper: ViewStyle = {
  gap: spacing.md,
  marginVertical: spacing.xxs,
}

const $screenContentContainer: ViewStyle = {
  flex: 1,
  backgroundColor: colors.palette.white,
  paddingHorizontal: spacing.ml,
}
