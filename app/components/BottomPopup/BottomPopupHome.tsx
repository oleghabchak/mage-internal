import { spacing } from "app/theme"
import React, { useState } from "react"
import { View } from "react-native"

import { SignUpChoiceModal } from "./SignUpChoiceModal"
import { SignUpVideoProposal } from "./SignUpVideoProposal"

interface BottomPopupHomeProps {
  expanded: boolean
  onClose: () => void
  onExpand: (type: string) => void
}

export const BottomPopupHome: React.FC<BottomPopupHomeProps> = ({
  expanded,
  onClose,
  onExpand,
}) => {
  const [isTutorialMenuDisplayed, setIsTutorialMenuDisplayed] = useState(true)
  function handleNextPopup() {
    if (expanded) {
      onExpand("")
    }
    setIsTutorialMenuDisplayed(false)
  }
  return (
    <View style={{ marginHorizontal: spacing.ml, gap: spacing.ml }}>
      {isTutorialMenuDisplayed ? (
        <SignUpVideoProposal
          handleNextPopup={handleNextPopup}
          expanded={expanded}
          onExpand={onExpand}
        />
      ) : (
        <SignUpChoiceModal
          expanded={expanded}
          onClose={onClose}
          onExpand={onExpand}
          handleNextPopup={handleNextPopup}
        />
      )}
    </View>
  )
}
