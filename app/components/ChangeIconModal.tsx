import { palette, spacing } from "app/theme"
import { Modal, View } from "react-native"
import { Text } from "./Text"
import { Button } from "./Button"
import { changeIcon } from "react-native-change-icon"

interface ChangeIconModalProps {
  showModal: boolean
  setShowModal: (state: boolean) => void
  theme: string
  iconName: string
}

export const ChangeIconModal = ({
  showModal,
  setShowModal,
  theme,
  iconName,
}: ChangeIconModalProps) => {
  function handleChangeIcon() {
    changeIcon(iconName)
    setShowModal(false)
  }
  return (
    <Modal
      visible={showModal}
      transparent={true}
      onRequestClose={() => setShowModal(false)}
      animationType="fade"
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            backgroundColor: theme === "dark" ? palette.black : palette.white,
            padding: spacing.xl,
            borderRadius: spacing.xl,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              marginBottom: spacing.lg,
              color: theme === "dark" ? palette.white : palette.black,
            }}
          >
            We've detected coach custom icon. The app will need to reload to apply these changes.
            Tap 'OK' to proceed!
          </Text>
          <Button onPress={handleChangeIcon} style={{ width: 200 }}>
            OK
          </Button>
        </View>
      </View>
    </Modal>
  )
}
