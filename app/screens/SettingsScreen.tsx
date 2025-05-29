import React, { useContext, useState } from "react"
import { observer } from "mobx-react-lite"
import { Linking, Switch, View, ViewStyle } from "react-native"
import { Text, Screen, Icon, IconTypes, Button } from "../components"
import { spacing } from "../theme"
import { AppStackParamList, AppStackScreenProps } from "app/navigators"
import { TouchableOpacity } from "react-native-gesture-handler"
import { useHeader } from "app/utils/useHeader"
import { useStores } from "app/models"
import { BottomPopup } from "app/components/BottomPopup/BottomPopup"
import { BottomPopupCard } from "app/components/BottomPopup/BottomPopupCard"
import { useTheme } from "@react-navigation/native"
import { ColorsInterface } from "app/theme/colorsInterface"
import { changeIcon } from "react-native-change-icon"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { AppContext } from "app/context/AppContext"

interface ItemProps {
  name: string
  icon: IconTypes
  onPress?: () => void
}

const SettingItem: React.FC<ItemProps> = ({ name, icon, onPress }) => {
  const { colors } = useTheme() as ColorsInterface
  return (
    <TouchableOpacity style={$item} onPress={onPress}>
      <Icon icon={icon} color={colors.primary} size={30} />
      <Text style={{ marginLeft: spacing.lg, color: colors.text }}>{name}</Text>
    </TouchableOpacity>
  )
}

interface SettingsScreenProps extends AppStackScreenProps<"Settings"> {}

export const SettingsScreen: React.FC<SettingsScreenProps> = observer(({ navigation }) => {
  const {
    authenticationStore: { logout, deleteAccount },
    programStore: { reset },
  } = useStores()

  const { colors } = useTheme() as ColorsInterface
  const [isOpenFirstPopup, setIsOpenFirstPopup] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [deletedText, setDeletedText] = useState("")
  const { theme, setTheme } = useContext(AppContext)
  const openPrivacyPolicy = () => {
    const privacyPolicyUrl = "https://www.themageapp.com/privacypolicy"

    Linking.openURL(privacyPolicyUrl).catch((err) => console.error("An error occurred", err))
  }

  useHeader(
    {
      title: "Settings",
      titleContainerStyle: {
        alignItems: "center",
        justifyContent: "flex-start",
        height: "70%",
      },
      titleStyle: {
        fontSize: spacing.lg,
        color: colors.text,
      },
      hideRightIcon: true,
      backgroundColor: colors.background,
    },
    [colors],
  )

  const goTo = (path: keyof AppStackParamList) => {
    navigation.push(path)
  }

  const handleOpenFirstPopup = () => {
    setIsOpenFirstPopup(true)
  }

  const handleCloseFirstPopup = () => {
    if (deletedText) {
      logout()
    } else if (!isLoading) {
      setIsOpenFirstPopup(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      setIsLoading(true)
      const deleteAccountResponse = await deleteAccount()
      if (deleteAccountResponse.success) {
        setDeletedText(deleteAccountResponse.message)
      }
    } catch (error) {
      console.error("delete account error", error)
    } finally {
      setTimeout(() => {
        setIsLoading(false)
      }, 2000)
    }
  }

  const handleLogout = async () => {
    await reset()
    await logout()
    await AsyncStorage.removeItem("theme")
    await changeIcon("Default").then().catch()
  }
  const handleThemeChange = async () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    await AsyncStorage.setItem("theme", JSON.stringify(newTheme))
  }
  return (
    <Screen statusBarStyle="dark" preset="auto" contentContainerStyle={$screenContentContainer}>
      <View>
        <Text preset="bold" style={{ color: colors.text }}>
          Account
        </Text>

        <View style={[$sectionCard, { backgroundColor: colors.grey }]}>
          <SettingItem
            name={"General Information"}
            icon={"profile"}
            onPress={() => goTo("EditProfile")}
          />
          <SettingItem
            name={"Athlete Profile"}
            icon={"flag"}
            onPress={() => goTo("AthleteProfile")}
          />
          <SettingItem name={"Maxes"} icon={"lock"} onPress={() => goTo("Maxes")} />
          <SettingItem name={"Privacy Policy"} icon={"insurance"} onPress={openPrivacyPolicy} />
          {/* <SettingItem name={"Notifications"} icon={"bell"} onPress={() => goTo("Notification")} /> */}
        </View>
      </View>

      <View>
        <Text preset="bold" style={{ color: colors.text }}>
          Actions
        </Text>

        <View style={[$sectionCard, { backgroundColor: colors.grey }]}>
          <SettingItem
            name={"Report a problem"}
            icon={"flag"}
            onPress={() => goTo("ReportProblem" as never)}
          />
          <SettingItem name={"Coach"} icon={"people"} onPress={() => goTo("Coach")} />
          <SettingItem name={"Delete account"} icon={"delete"} onPress={handleOpenFirstPopup} />
          <SettingItem name={"Log out"} icon={"logout"} onPress={handleLogout} />
        </View>
      </View>

      <View style={[$changeThemeWrapper, { backgroundColor: colors.grey }]}>
        <Text style={{ color: colors.text }}>Night mode</Text>
        <Switch
          trackColor={{ false: colors.secondary, true: colors.primary }}
          thumbColor={colors.primary}
          value={theme == "dark"}
          onValueChange={handleThemeChange}
        />
      </View>

      <BottomPopup isVisible={isOpenFirstPopup} onClose={handleCloseFirstPopup} minHeight={"67%"}>
        {deletedText ? (
          <BottomPopupCard title={"Account successfully deleted"}>
            <View style={[$popupButtonsContainer, { backgroundColor: colors.background }]}>
              <Text style={$popupText}>{deletedText}</Text>
              <Button style={$popupButton} onPress={handleCloseFirstPopup}>
                Logout
              </Button>
            </View>
          </BottomPopupCard>
        ) : (
          <BottomPopupCard title={"Delete account"}>
            <View style={[$popupButtonsContainer, { backgroundColor: colors.grey }]}>
              <Text style={[$popupText, { color: colors.text }]}>
                You have decided to cancel your account. Please confirm that you really want to do
                this. to do so. If you click "Please cancel my account", the cancellation and data
                deletion process will begin. the data deletion process will begin. If not, just
                click "No, I want to stay"
              </Text>
              <Button
                style={[$popupButton, { backgroundColor: colors.primary }]}
                textStyle={{ color: colors.alternativeText }}
                onPress={handleDeleteAccount}
                isLoading={isLoading}
                disabled={isLoading}
              >
                Please cancel my account
              </Button>
              <Button
                style={[$popupButton, { backgroundColor: colors.primary }]}
                textStyle={{ color: colors.alternativeText }}
                onPress={handleCloseFirstPopup}
              >
                No, I want to stay
              </Button>
            </View>
          </BottomPopupCard>
        )}
      </BottomPopup>

      {/* <View>
        <Text preset="bold">Actions for test version</Text>

        <View style={$sectionCard}>
          <SettingItem
            name={"Navigate to welcome screen"}
            icon={"settings"}
            onPress={() => goTo("Welcome" as never)}
          />
          <SettingItem
            name={"Navigate to pre-block maxes screen"}
            icon={"settings"}
            onPress={async () => {
              navigation.navigate("PreBlockMaxes" as never)
            }}
          />
          <SettingItem
            name={"Navigate to finished block screen"}
            icon={"settings"}
            onPress={async () => {
              navigation.navigate("FinishedBlock" as never)
            }}
          />
          <SettingItem
            name={"Reset program to initial data"}
            icon={"settings"}
            onPress={() => reset()}
          />
        </View>
      </View> */}
    </Screen>
  )
})

const $shadow: ViewStyle = {
  shadowColor: "#000000",
  shadowOffset: {
    width: 0,
    height: 3,
  },
  shadowOpacity: 0.17,
  shadowRadius: 3.05,
  elevation: 4,
}

const $item: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  width: "100%",
  paddingVertical: spacing.xxs,
}

const $screenContentContainer: ViewStyle = {
  gap: spacing.lg,
}

const $sectionCard: ViewStyle = {
  gap: spacing.xs,
  paddingHorizontal: spacing.md,
  paddingVertical: spacing.xs,
  marginTop: spacing.xs,
  marginBottom: spacing.xs,
  borderRadius: spacing.sm,
  margin: spacing.xxs,
  ...$shadow,
}
const $popupText: ViewStyle = {
  marginHorizontal: spacing.sm,
}

const $popupButtonsContainer: ViewStyle = {
  gap: spacing.lg,
  marginVertical: spacing.sm,
}

const $popupButton: ViewStyle = {
  marginHorizontal: spacing.sm,
}

const $changeThemeWrapper: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  padding: spacing.md,
  marginHorizontal: spacing.xxxs,
  borderRadius: 10,
}
