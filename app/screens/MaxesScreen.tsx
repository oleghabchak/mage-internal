import React, { FC, useState } from "react"
import { observer } from "mobx-react-lite"
import { RefreshControl, ScrollView, TextStyle, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Card, Text } from "app/components"
import { colors, spacing, typography } from "app/theme"
import { useHeader } from "app/utils/useHeader"

import { MaxesGroupCardsList } from "app/components/MaxesComponents/MaxesGroupCardsList"
import { useStores } from "app/models"
import { useTheme } from "@react-navigation/native"
import { ColorsInterface } from "app/theme/colorsInterface"

interface MaxesScreenProps extends AppStackScreenProps<"Maxes"> {}

export const MaxesScreen: FC<MaxesScreenProps> = observer(function MaxesScreen() {
  const {
    programStore: { fetchAbilitiesByGroup },
  } = useStores()
  const [refreshing, setRefreshing] = useState(false)
  const { colors } = useTheme() as ColorsInterface
  useHeader(
    {
      title: "Maxes",
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
    [],
  )

  const handleFetchData = async () => {
    try {
      setRefreshing(true)
      await fetchAbilitiesByGroup()
    } catch {
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <ScrollView
      style={[$container, { backgroundColor: colors.background }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleFetchData} />}
    >
      <Card
        shadow={true}
        style={{
          marginBottom: spacing.ml,
          backgroundColor: colors.primary,
          borderColor: colors.border,
        }}
        verticalAlignment="center"
        ContentComponent={
          <>
            <Text style={[$titleText, { fontSize: spacing.ml, color: colors.alternativeText }]}>
              This is a list of the maxes you have achieved
            </Text>
            <Text style={[$titleText, { color: colors.alternativeText }]}>
              In this you will see the best you have hit and also you will be able to change them
            </Text>
          </>
        }
      />
      <MaxesGroupCardsList />
    </ScrollView>
  )
})

const $titleText: TextStyle = {
  paddingHorizontal: 20,
  paddingVertical: 4,
  color: colors.palette.white,
  fontSize: 16,
  fontFamily: typography.primary.semiBold,
  textAlign: "center",
}

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.palette.white,
  paddingHorizontal: spacing.ml,
  paddingTop: spacing.lg,
}
