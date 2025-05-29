import {
  IAbilityByGroup,
  IActual,
  IExercise,
  IPlanned,
  IProgram,
  IWorkout,
} from "app/models/ProgramStore"
import {
  IBlockDataItem,
  ICycleExercisesFilteredByGroup,
  IDataForDiagram,
} from "./types/DiagramData"

export const trimmTitleString = (value: string, maxLength: number) => {
  if (value.length <= maxLength) {
    return value
  }

  return value.slice(0, maxLength) + "..."
}

export const calculateWeightRange = (planned: IPlanned) => {
  const { weight, max, weightrange, minwgt, maxwgt } = planned
  const calculatedWeight = (+(weight || 0) * +(max || 0)) / 100
  if (!weightrange || weightrange === "0") {
    return `${calculatedWeight.toFixed()}`
  } else {
    return `${minwgt || 0} - ${maxwgt || 0}`
  }
}

export const calculateRepsRange = (planned: IPlanned) => {
  const { reps, reprange } = planned
  const caluculatedReps = +(reps || 0)
  if (!reprange || reprange === "0") {
    return reps?.toString()
  } else {
    return `${caluculatedReps - +reprange} - ${caluculatedReps + +reprange}`
  }
}

export const createPlannedText = (exercise: IExercise) => {
  const { planned, actual, exerciseclass, touched } = exercise

  const exerciseClassWRS = exerciseclass === "wrs"
  const isChecked = !!+touched
  const reps = calculateRepsRange(planned)

  if (exerciseClassWRS) {
    const weight = calculateWeightRange(planned)

    return isChecked
      ? `${actual?.sets} x ${actual?.reps} @ ${actual?.weight}`
      : `${planned.sets} x ${reps} @ ${weight}`
  } else {
    return isChecked ? `${actual?.sets} x ${actual?.reps}` : `${planned.sets} x ${reps}`
  }
}

export const intensityToRPE = (intensity: number) => {
  const intensityRanges = [
    { min: 0, max: 50, rpe: 0 },
    { min: 50.1, max: 52.5, rpe: 0.5 },
    { min: 52.6, max: 55, rpe: 1 },
    { min: 55.1, max: 57.5, rpe: 1.5 },
    { min: 57.6, max: 60, rpe: 2 },
    { min: 60.1, max: 62.5, rpe: 2.5 },
    { min: 62.6, max: 65, rpe: 3 },
    { min: 65.1, max: 67.5, rpe: 3.5 },
    { min: 67.6, max: 70, rpe: 4 },
    { min: 70.1, max: 72.5, rpe: 4.5 },
    { min: 72.6, max: 75, rpe: 5 },
    { min: 75.1, max: 77.5, rpe: 5.5 },
    { min: 77.6, max: 80, rpe: 6 },
    { min: 80.1, max: 82.5, rpe: 6.5 },
    { min: 82.6, max: 85, rpe: 7 },
    { min: 85.1, max: 87.5, rpe: 7.5 },
    { min: 87.6, max: 90, rpe: 8 },
    { min: 90.1, max: 92.5, rpe: 8.5 },
    { min: 92.6, max: 95, rpe: 9 },
    { min: 95.1, max: 97.5, rpe: 9.5 },
    { min: 97.6, max: 100, rpe: 10 },
  ]

  for (const range of intensityRanges) {
    if (intensity >= range.min && intensity <= range.max) {
      return range.rpe
    }
  }

  return null
}

export const createArrayOfExerxisesGroups = (
  program: IProgram,
  groupName: "movement" | "muscle",
) => {
  const uniqueGroupsFromProgram: Set<string> = new Set()

  if (!program || !program.cyclelist || !program.cyclelist.length) {
    return []
  }

  const firstCycle = program.cyclelist[0]

  if (!firstCycle.workouts || !Array.isArray(firstCycle.workouts)) {
    return []
  }

  firstCycle.workouts.forEach((workout) => {
    if (workout && workout.exercises && Array.isArray(workout.exercises)) {
      workout.exercises.forEach((exercise) => {
        if (exercise && exercise.groups && Array.isArray(exercise.groups)) {
          exercise.groups.forEach((group) => {
            if (
              group &&
              group.type_name &&
              group.type_name.toLowerCase() === groupName &&
              group.group_name
            ) {
              uniqueGroupsFromProgram.add(group.group_name)
            }
          })
        }
      })
    }
  })

  return Array.from(uniqueGroupsFromProgram.values())
}

export const findExercisesByGroup = (
  program: IProgram,
  groupName: string,
): ICycleExercisesFilteredByGroup[] => {
  const cyclesWithFilteredExeercises: ICycleExercisesFilteredByGroup[] = []

  if (!program || !program.cyclelist || !Array.isArray(program.cyclelist)) {
    return cyclesWithFilteredExeercises
  }

  program.cyclelist.forEach((cycle) => {
    const cycleFilteredExercises: ICycleExercisesFilteredByGroup = {
      cycleno: cycle.cycleno,
      exercises: [],
    }

    if (cycle && cycle.workouts && Array.isArray(cycle.workouts)) {
      cycle.workouts.forEach((workout) => {
        if (workout && workout.exercises && Array.isArray(workout.exercises)) {
          workout.exercises.forEach((exercise) => {
            if (exercise && exercise.groups && Array.isArray(exercise.groups)) {
              const matchingGroup = exercise.groups.find(
                (group) => group && group.group_name === groupName,
              )

              if (matchingGroup) {
                cycleFilteredExercises.exercises.push(exercise)
              }
            }
          })
        }
      })
    }

    cyclesWithFilteredExeercises.push(cycleFilteredExercises)
  })

  return cyclesWithFilteredExeercises
}

export const countAmountByGroupForCycle = (
  workouts: IWorkout[],
  groupItem: string,
  groupName: "movement" | "muscle",
) => {
  let amount = 0
  workouts.map((workout) =>
    workout.exercises.map((exercise) =>
      exercise.groups.map(
        (group) =>
          group.type_name.toLowerCase() === groupName &&
          group.group_name === groupItem &&
          exercise.actual?.sets &&
          (amount += +exercise.actual?.sets),
      ),
    ),
  )

  return amount
}

export const createArrayWithDataLength = (dataLength: number) => {
  const newArray = [""]

  for (let i = 2; i <= dataLength + 1; i++) {
    newArray.push((i - 1).toString())
  }
  return newArray
}

export const getValuesForWRSDiagram = (filteredCycles: ICycleExercisesFilteredByGroup[]) => {
  const data: IDataForDiagram[][] = []

  if (filteredCycles.length > 0) {
    filteredCycles[0].exercises.forEach((exercise) => {
      if (exercise.exerciseclass === "wrs") {
        data.push([])
      }
    })
  }

  filteredCycles.forEach((filteredCycle) => {
    let wrsIndex = 0

    filteredCycle.exercises.forEach((exercise) => {
      if (exercise.exerciseclass === "wrs") {
        const value = exercise.actual?.weight ? +exercise.actual.weight : 0

        if (data[wrsIndex]) {
          data[wrsIndex].push({ value })
        }

        wrsIndex++
      }
    })
  })

  return data
}
export const getValuesForBodyDiagram = (filteredCycles: ICycleExercisesFilteredByGroup[]) => {
  const data: IDataForDiagram[][] = []

  filteredCycles[0]?.exercises.forEach((exercise) => {
    if (exercise.exerciseclass === "body") {
      data.push([])
    }
  })

  let bodyExerciseIndex = 0

  filteredCycles.forEach((filteredCycle) => {
    bodyExerciseIndex = 0

    filteredCycle.exercises.forEach((exercise) => {
      if (exercise.exerciseclass === "body") {
        const value = exercise.actual?.reps ? +exercise.actual.reps : 0

        if (data[bodyExerciseIndex]) {
          data[bodyExerciseIndex].push({ value })
        }

        bodyExerciseIndex++
      }
    })
  })

  return data
}

export const getBlockWRSData = (filteredCycles: ICycleExercisesFilteredByGroup[]) => {
  const exercisesData: IBlockDataItem[] = []

  if (!filteredCycles || filteredCycles.length === 0) {
    return exercisesData
  }

  const firstCycle = filteredCycles[0]
  const lastCycle = filteredCycles[filteredCycles.length - 1]

  if (!firstCycle.exercises || !Array.isArray(firstCycle.exercises)) {
    return exercisesData
  }

  firstCycle.exercises.forEach((exercise, index) => {
    if (exercise.exerciseclass === "wrs") {
      const lastExercise = lastCycle && lastCycle.exercises && lastCycle.exercises[index]

      exercisesData.push({
        name: exercise.name,
        firstCycleData: exercise.actual || null,
        lastCycleData: lastExercise && lastExercise.actual ? lastExercise.actual : null,
      })
    }
  })

  return exercisesData
}

export const getBlockBodyData = (filteredCycles: ICycleExercisesFilteredByGroup[]) => {
  const exercisesData: IBlockDataItem[] = []

  if (!filteredCycles || filteredCycles.length === 0) {
    return exercisesData
  }

  const firstCycle = filteredCycles[0]
  const lastCycle = filteredCycles[filteredCycles.length - 1]

  if (!firstCycle.exercises || !Array.isArray(firstCycle.exercises)) {
    return exercisesData
  }

  firstCycle.exercises.forEach((exercise, index) => {
    if (exercise.exerciseclass === "body") {
      const lastExercise = lastCycle && lastCycle.exercises && lastCycle.exercises[index]

      exercisesData.push({
        name: exercise.name,
        firstCycleData: exercise.actual || null,
        lastCycleData: lastExercise && lastExercise.actual ? lastExercise.actual : null,
      })
    }
  })

  return exercisesData
}
export const generateExerciseDescription = ({ sets, reps, weight }: IActual): string => {
  return `${sets || 0} set of ${reps || 0} @ ${weight || 0}kg`
}

export const generateExerciseBodyDescription = ({ sets, reps }: IActual): string => {
  return `${sets || 0} set of ${reps || 0}`
}

export const generateWRSProgress = (blockItem: IBlockDataItem) => {
  const results: string[] = []

  if (blockItem.lastCycleData?.weight && blockItem.firstCycleData?.weight) {
    const weight = +blockItem.lastCycleData.weight - +blockItem.firstCycleData.weight
    const weightString = `${weight > 0 ? "+" : "-"}${weight}kg`

    weight !== 0 && results.push(weightString)
  }

  if (blockItem.lastCycleData?.reps && blockItem.firstCycleData?.reps) {
    const reps = +blockItem.lastCycleData.reps - +blockItem.firstCycleData.reps
    const weightString = `${reps > 0 ? "+" : "-"}${reps}reps`

    reps !== 0 && results.push(weightString)
  }
  return results.join(" and ")
}

export const generateBodyProgress = (blockItem: IBlockDataItem) => {
  const results: string[] = []

  if (blockItem.lastCycleData?.reps && blockItem.firstCycleData?.reps) {
    const reps = +blockItem.lastCycleData.reps - +blockItem.firstCycleData.reps
    const weightString = `${reps > 0 ? "+" : "-"}${reps}reps`

    reps !== 0 && results.push(weightString)
  }
  return results.join(" and ")
}

export const filterUniqueExercises = (abilities: IAbilityByGroup[]): IAbilityByGroup[] => {
  const uniqueExercisesMap = new Map()

  abilities.forEach((abilityItem) => {
    uniqueExercisesMap.set(abilityItem.exercise_id, abilityItem)
  })

  const uniqueExercisesArray = Array.from(uniqueExercisesMap.values())

  return uniqueExercisesArray
}

export const getTextByDifferentiator = (differentiator: number) => {
  const text = "With your details we think "

  switch (true) {
    case differentiator < -0.2:
      return text + "you can handle less volume than average."
    case differentiator < -0.1:
      return text + "you can handle a little less volume than average."
    case differentiator < 0.1:
      return text + "you will do best under an average amount of volume."
    case differentiator < 0.2:
      return text + "you can handle a little more volume than average."
    default:
      return text + "you can handle more volume than average."
  }
}

export function calculatePercentage(
  values: { value: number; color: string; shadowColor: string; label: string }[],
) {
  const total = values.reduce(
    (acc: any, currentValue: { value: any }) => acc + currentValue.value,
    0,
  )
  let accumulatedAngle = 0
  const percentages = values.map(({ value, ...rest }: any) => {
    const percentage = (value / total) * 100
    const angle = (value / total) * 2 * Math.PI
    const rotationAngle = (percentage / 100) * 2 * Math.PI
    accumulatedAngle += rotationAngle
    const cumulativeRotation = accumulatedAngle - rotationAngle
    return {
      ...rest,
      value,
      percentage,
      angle,
      cumulativeRotation,
    }
  })

  let prevAngle = 0
  const output = percentages.map((item: { cumulativeRotation: any }) => {
    const angle = item.cumulativeRotation
    const newItem = { ...item, angle: angle + prevAngle }
    prevAngle = newItem.angle
    return newItem
  })

  return output
}
