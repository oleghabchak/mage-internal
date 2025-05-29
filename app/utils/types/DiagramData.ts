import { IActual, IExercise } from "app/models/ProgramStore"

export interface ICycleExercisesFilteredByGroup {
  cycleno: number
  exercises: IExercise[]
}

export interface IDataForDiagram {
  value: number
}

export interface IBlockDataItem {
  name: string
  firstCycleData: IActual | null
  lastCycleData: IActual | null
}
