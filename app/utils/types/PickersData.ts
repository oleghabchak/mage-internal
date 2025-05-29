export interface IDropdownData {
  title: string
  id: number
}

export interface IDropdownGenderData {
  title: string
  option: "M" | "F" | null
}

export const sessionData: IDropdownData[] = [
  { title: "3", id: 0 },
  { title: "4", id: 1 },
  { title: "5", id: 2 },
]
export const focusData: IDropdownData[] = [
  { title: "Strength", id: 0 },
  { title: "Technique", id: 1 },
  { title: "Getting jacked", id: 2 },
  { title: "Balanced", id: 3 },
]
export const trainingData: IDropdownData[] = [
  { title: "Lower Frequency (Bro Split)", id: 0 },
  { title: "Balanced", id: 1 },
  { title: "Higher Frequency (Full body split)", id: 2 },
]
export const experienceData: IDropdownData[] = [
  { title: "Select an option", id: 0 },
  { title: "Just started >1", id: 1 },
  { title: "Novice 1-3", id: 2 },
  { title: "Intermediate 3-5", id: 3 },
  { title: "Experienced 5+", id: 4 },
]
export const dietData: IDropdownData[] = [
  { title: "Select an option", id: 0 },
  { title: "No focus on Nutriition or not enough calories", id: 1 },
  { title: "Sufficient food for training", id: 2 },
  { title: "Track calories and macros for training", id: 3 },
]
export const sleepData: IDropdownData[] = [
  { title: "Select an option", id: 0 },
  { title: "Less than 6", id: 1 },
  { title: "Around 8", id: 2 },
  { title: "8+", id: 3 },
]
export const activityData: IDropdownData[] = [
  { title: "Select an option", id: 0 },
  { title: "Barely move all day", id: 1 },
  { title: "A few steps/ light activity", id: 2 },
  { title: "Another sport or on your feet all day ", id: 3 },
]
export const genderData: IDropdownGenderData[] = [
  { title: "Select an option", option: null },
  { title: "Male", option: "M" },
  { title: "Female", option: "F" },
]
