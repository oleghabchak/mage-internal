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

interface LifeContinuedScreenProps extends AppStackScreenProps<"LifeContinued"> {}

export const LifeContinuedScreen: FC<LifeContinuedScreenProps> = observer(
  function LifeContinuedScreen(_props) {
    const {
      authenticationStore: { sport, setSport, updateUser, sportList },
    } = useStores()
    const { navigation } = _props
    const [isLoading, setIsLoading] = useState(false)

    const handlePress = (index: number) => {
      setSport(index)
    }

    const handleSubmit = async () => {
      try {
        setIsLoading(true)
        await updateUser()
        navigation.navigate("Equipment")
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    return (
      <View style={$container}>
        <AuthTitle title="lifeContinuedScreen.title" />
        <LinearProgressBar progress={0.6} containerStyle={{ marginTop: spacing.xl }} />
        <SignUpLayout>
          <AuthTitle subtitle="lifeContinuedScreen.description" />

          <View style={$tapButtonsContainer}>
            {sportList.slice(1).map((item, index) => {
              return (
                <Button
                  key={generateUUID()}
                  preset={"custom"}
                  isActive={sport === index}
                  testID="signup-button"
                  text={item.name}
                  onPress={() => handlePress(index)}
                />
              )
            })}
          </View>
        </SignUpLayout>
        <SignUpButtons isLoading={isLoading} nextDisabled={isLoading} onSubmit={handleSubmit} />
      </View>
    )
  },
)

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
