import React, { FC, useEffect, useState } from "react"
import { Platform, RefreshControl, ScrollView, StatusBar, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { useStores } from "app/models"
import { spacing } from "app/theme"
import { observer } from "mobx-react-lite"
import { BottomPopup } from "app/components/BottomPopup/BottomPopup"
import { HomeEmptyContent } from "app/components/HomeComponents/HomeEmptyContent"
import { HomeContent } from "app/components/HomeComponents/HomeContent"
import { BottomPopupHome } from "app/components/BottomPopup/BottomPopupHome"
import { PastProgramsBlock } from "app/components/PastProgramsBlock"
import { useTheme } from "@react-navigation/native"
import { ColorsInterface } from "app/theme/colorsInterface"

interface HomeScreenProps extends AppStackScreenProps<"HomeScreen"> {}

export const HomeScreen: FC<HomeScreenProps> = observer(function HomeScreen() {
  const {
    programStore: { fetchProgramList, fetchProgram, activeProgram },
    authenticationStore: { firstVisit, setFirstVisit },
  } = useStores()

  const [openedSection, setOpenedSection] = useState<boolean>(false)
  const [expanded, setExpanded] = useState<boolean>(false)
  const [popUpHeight, setPopUpHeight] = useState<string>("30%")
  const [refreshing, setRefreshing] = useState(false)
  const { colors: themeColors } = useTheme() as ColorsInterface
  const fetchProgramData = async () => {
    try {
      setRefreshing(true)
      const fetchedProgramList = await fetchProgramList()
      if (
        (!fetchedProgramList.length && !firstVisit) ||
        (!fetchedProgramList.length && Platform.OS === "ios")
      ) {
        handleOpenBottomPopup()
      }
      await fetchProgram()
    } catch (error) {
      console.error("fetchProgramData error on HomeScreen:", error)
    } finally {
      setRefreshing(false)
      if (firstVisit) {
        setFirstVisit(false)
      }
    }
  }

  useEffect(() => {
    fetchProgramData()
    if (Platform.OS === "android") {
      StatusBar.setBackgroundColor(themeColors.background)
      StatusBar.setBarStyle(themeColors.text === "#000000" ? "dark-content" : "light-content")
    }
  }, [])

  const handleOpenBottomPopup = () => setOpenedSection(true)
  const handleCloseBottomPopup = () => {
    setOpenedSection(false)
    setExpanded(false)
    setPopUpHeight("30%")
  }
  const expandBottomPopup = (type = "") => {
    if (expanded) {
      setPopUpHeight("30%")
      setExpanded(false)
    } else if (type == "video") {
      setPopUpHeight("50%")
      setExpanded(true)
    } else {
      setPopUpHeight("80%")
      setExpanded(true)
    }
  }

  return (
    <ScrollView
      style={$container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchProgramData} />}
    >
      {activeProgram ? <HomeContent /> : <HomeEmptyContent />}
      <PastProgramsBlock />
      <BottomPopup
        minHeight={popUpHeight}
        isVisible={openedSection}
        onClose={handleCloseBottomPopup}
      >
        <BottomPopupHome
          expanded={expanded}
          onClose={handleCloseBottomPopup}
          onExpand={expandBottomPopup}
        />
      </BottomPopup>
    </ScrollView>
  )
})
const $container: ViewStyle = {
  flex: 1,
  paddingHorizontal: spacing.ml,
  paddingTop: spacing.lg,
}
