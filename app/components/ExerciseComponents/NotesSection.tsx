import { colors, spacing } from "app/theme"
import React, { useState } from "react"
import { Text, TouchableOpacity, ViewStyle } from "react-native"
import { NotesPopup } from "./NotesPopup"

interface EvaluationSectionProps {
  notes: string
  onSave: (arg: string) => void
  backgroundColor: string
  color: string
  greyBg: string
}

export const NotesSection: React.FC<EvaluationSectionProps> = ({
  notes,
  onSave,
  backgroundColor,
  color,
  greyBg,
}) => {
  const [isNotesPopupOpen, setIsNotesPopupOpen] = useState(false)
  const [notesText, setNotesText] = useState(notes || "")

  const handleChangeNotesPopupStatus = () => {
    setIsNotesPopupOpen((prev) => {
      if (prev) {
        const clearedNotesText = notesText.trim()

        onSave(clearedNotesText)
        setNotesText(clearedNotesText)
      }
      return !prev
    })
  }

  return (
    <>
      <TouchableOpacity
        style={[$container, { backgroundColor: backgroundColor }]}
        onPress={handleChangeNotesPopupStatus}
      >
        <Text style={{ color: color }}>{!notesText ? "Notes" : notesText}</Text>
      </TouchableOpacity>

      <NotesPopup
        isVisible={isNotesPopupOpen}
        onClose={handleChangeNotesPopupStatus}
        value={notesText}
        setValue={setNotesText}
        backgroundColor={greyBg}
        color={color}
      />
    </>
  )
}

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.palette.white,
  padding: 10,
  borderRadius: spacing.xs,
  maxHeight: 200,
}
