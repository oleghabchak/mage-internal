import { observer } from "mobx-react-lite"
import React, { FC, useState } from "react"
import { View, ViewStyle } from "react-native"
import { Button } from "app/components"
import { AppStackScreenProps } from "../../navigators"
import { colors, spacing } from "../../theme"
import { SignUpLayout } from "./SignUpLayout"
import { AuthTitle } from "app/components/AuthTitle"
import { SignUpButtons } from "app/components/SignUpButtons"
import LinearProgressBar from "app/components/LinearProgressBar"
import { generateUUID } from "app/utils/uuid"
import { useStores } from "app/models"

interface EquipmentScreenProps extends AppStackScreenProps<"Equipment"> {}

export const EquipmentScreen: FC<EquipmentScreenProps> = observer(function EquipmentScreen(_props) {
  const [isLoading, setIsLoading] = useState(false)
  const { navigation } = _props
  const {
    authenticationStore: { equipmentsList, equipment, setEquipment, updateUser },
  } = useStores()

  const handlePress = (index: number) => {
    setEquipment(index)
  }
  const handleSubmitEquipment = async () => {
    try {
      setIsLoading(true)
      await updateUser()
      navigation.navigate("Goals")
    } catch (error) {
      console.error("Submit error", error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <View style={$container}>
      <AuthTitle title="equipmentScreen.title" />
      <LinearProgressBar progress={0.8} containerStyle={{ marginTop: spacing.xl }} />
      <SignUpLayout>
        <AuthTitle subtitle="equipmentScreen.description" />

        <View style={$tapButtonsContainer}>
          {equipmentsList.slice(1).map((item) => {
            return (
              <Button
                key={generateUUID()}
                preset={"custom"}
                isActive={equipment === item.value}
                testID="signup-button"
                text={item.name}
                onPress={() => handlePress(item.value)}
              />
            )
          })}
        </View>
      </SignUpLayout>
      <SignUpButtons
        onSubmit={handleSubmitEquipment}
        isLoading={isLoading}
        nextDisabled={isLoading}
      />
    </View>
  )
})

const $container: ViewStyle = {
  paddingVertical: spacing.xxxl,
  paddingBottom: spacing.xl,
  paddingHorizontal: spacing.lg,
  justifyContent: "space-around",
  flex: 1,
  backgroundColor: colors.palette.primary,
}

const $tapButtonsContainer: ViewStyle = {
  display: "flex",
  justifyContent: "space-between",
  gap: spacing.lg,
}
