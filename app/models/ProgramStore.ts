import {
  types,
  Instance,
  SnapshotOut,
  applySnapshot,
  getSnapshot,
  flow,
  cast,
} from "mobx-state-tree"
import { initialProgramStoreData } from "./InitialProgramStoraData"
import userService from "app/services/user/userService"
import programService from "app/services/user/programService"
import { IUppdateAbility } from "app/utils/types/UserData"

const ExerciseListItem = types.model({
  id: types.number,
  name: types.string,
  description: types.string,
  exerciseclass: types.string,
})

const ProgramsListItem = types.model({
  id: types.number,
  name: types.string,
  description: types.string,
  sport: types.string,
  goal: types.string,
  status: types.number,
  currentcycle: types.number,
  cycles: types.number,
  cycledays: types.number,
  statusname: types.string,
  athlete_id: types.number,
  startdate: types.maybeNull(types.string),
  compperc: types.maybeNull(types.string),
})

const AbilityByGroup = types.model({
  id: types.union(types.string, types.number),
  ability: types.union(types.string, types.number),
  abilitydate: types.maybeNull(types.number),
  athlete_id: types.union(types.string, types.number),
  class: types.string,
  exercise_id: types.union(types.string, types.number),
  name: types.string,
  units: types.string,
  groupname: types.string,
})

const Actual = types.model({
  weight: types.maybeNull(types.union(types.string, types.number)),
  reps: types.maybeNull(types.union(types.string, types.number)),
  sets: types.maybeNull(types.union(types.string, types.number)),
  ease: types.maybeNull(types.union(types.string, types.number)),
})

const Planned = types.model({
  weight: types.maybeNull(types.union(types.string, types.number)),
  reps: types.maybeNull(types.union(types.string, types.number)),
  sets: types.maybeNull(types.union(types.string, types.number)),
  max: types.maybeNull(types.union(types.string, types.number)),
  ease: types.maybeNull(types.union(types.string, types.number)),
  reprange: types.maybeNull(types.union(types.string, types.number)),
  weightrange: types.maybeNull(types.union(types.string, types.number)),
  minwgt: types.maybeNull(types.union(types.string, types.number)),
  maxwgt: types.maybeNull(types.union(types.string, types.number)),
  cyclewgtfield: types.maybeNull(types.union(types.string, types.number)),
  RPE: types.maybeNull(types.union(types.string, types.number)),
  RIR: types.maybeNull(types.union(types.string, types.number)),
  PER: types.maybeNull(types.union(types.string, types.number)),
})

const Group = types.model({
  type_id: types.number,
  type_name: types.string,
  group_id: types.number,
  group_name: types.string,
})

const Settings = types.model({
  userest: types.union(types.string, types.number),
  step: types.union(types.string, types.number),
  intensity: types.maybeNull(types.union(types.string, types.number)),
  progid: types.maybeNull(types.union(types.string, types.number)),
  prog: types.maybeNull(types.union(types.string, types.number)),
  planned: types.maybeNull(
    types.model({
      reps: types.union(types.string, types.number),
      sets: types.union(types.string, types.number),
    }),
  ),
})

const Exercise = types.model({
  id: types.union(types.string, types.number),
  exercisegroupid: types.number,
  exercisegroupname: types.string,
  programexerciseid: types.maybeNull(types.number),
  workoutexerciseid: types.union(types.string, types.number),
  exerciseclass: types.string,
  origname: types.string,
  name: types.string,
  description: types.string,
  videolink: types.maybeNull(types.string),
  intensity: types.number,
  progid: types.union(types.string, types.number),
  prog: types.maybeNull(types.string),
  phase: types.union(types.string, types.number),
  settings: types.maybeNull(Settings),
  planned: Planned,
  actual: types.maybeNull(Actual),
  disregard: types.union(types.string, types.number),
  touched: types.union(types.string, types.number),
  notes: types.string,
  ability: types.union(types.string, types.number),
  extrajson: types.string,
  groups: types.array(Group),
})

const Workout = types.model({
  id: types.number,
  cycleday: types.number,
  scheduled: types.union(types.boolean, types.number),
  started: types.union(types.boolean, types.number),
  ended: types.union(types.boolean, types.number),
  questions: types.maybeNull(types.frozen()),
  exercises: types.array(Exercise),
})

const Cycle = types.model({
  id: types.number,
  cycleno: types.number,
  startdate: types.number,
  days: types.number,
  phase: types.number,
  workouts: types.array(Workout),
})

const ProgramData = types.model({
  id: types.number,
  trainerid: types.number,
  traineruid: types.number,
  athleteid: types.number,
  userid: types.number,
  name: types.string,
  description: types.string,
  sport: types.optional(types.string, ""),
  goal: types.optional(types.string, ""),
  status: types.number,
  cycles: types.number,
  currentcycle: types.number,
  cycledays: types.number,
  deloadcycles: types.number,
  cyclelist: types.array(Cycle),
})

export const ProgramDataStoreModel = types
  .model("ProgramDataStore", {
    programsList: types.optional(types.array(ProgramsListItem), []),
    programData: types.optional(ProgramData, initialProgramStoreData),
    currentSession: types.optional(types.number, 1),
    currentCycle: types.optional(types.number, 1),
    abilitiesByGroup: types.optional(types.array(AbilityByGroup), []),
    currentPastProgramId: types.optional(types.maybeNull(types.number), null),
    isLoading: types.optional(types.boolean, false),
    exercisesList: types.optional(types.array(ExerciseListItem), []),
    lastChange: types.optional(types.string, ""),
  })
  .views((store) => ({
    get id() {
      return store.programData.id
    },

    get currentCycleOpened() {
      return store.programData.currentcycle === store.currentCycle
    },

    get currentCycleFinished() {
      const cycleCompleted = store.programData.cyclelist[
        store.programData.currentcycle - 1
      ].workouts.every((workout) => workout.exercises.every((exercise) => !!+exercise.touched))

      return cycleCompleted
    },

    get currentSessionFinished() {
      const sessionComplited = store.programData.cyclelist[
        store.programData.currentcycle - 1
      ].workouts[store.currentSession - 1].exercises.every((exercise) => !!+exercise.touched)
      return sessionComplited
    },

    get currentCycleIsLast() {
      return store.currentCycle === store.programData.cycles
    },

    get currentSessionIsLast() {
      return store.currentSession === store.programData.cyclelist[0].workouts.length
    },

    get currentCycleIndex() {
      return store.currentCycle - 1
    },

    get pastPrograms() {
      return store.programsList.filter((program) => program.status === 2)
    },

    get getLastUnfinishedSession() {
      let actualCycle = 1
      store.programData.cyclelist[store.currentCycle - 1]?.workouts.find((workout, index) => {
        const unfinishedWorkout = workout.exercises.some((exercise) => {
          return !+exercise?.touched
        })

        if (unfinishedWorkout) {
          actualCycle = index + 1
          return true
        }

        return false
      })

      return actualCycle
    },

    get activeProgram() {
      return store.programsList.find((program) => program.statusname === "Active")
    },

    get getCurrentCycle() {
      return store.programData.cyclelist[store.programData.currentcycle - 1]
    },
  }))
  .actions((store) => ({
    reset() {
      const initialData = getSnapshot(ProgramData.create(initialProgramStoreData))
      applySnapshot(store, initialData)
    },

    setCurrentSession(value: number) {
      store.currentSession = value
    },

    setCurrentCycle(value: number) {
      if (value > 0 && value <= store.programData.cycles && value <= store.programData.currentcycle)
        store.currentCycle = value
    },

    setCycle(value: number) {
      if (value > 0 && value <= store.programData.cycles) store.programData.currentcycle = value
    },

    setNextCycle: flow(function* () {
      try {
        yield programService.startNewCycle(store.programData.id)
        if (store.activeProgram) {
          const fetchedProgram: IProgram = yield programService.loadProgram(store.activeProgram.id)
          store.programData = cast(fetchedProgram)
          store.currentSession = 1
        }
      } catch (error) {
        console.error("setNextCycle error", error)
      }
    }),

    setNextSession: flow(function* () {
      store.currentSession = store.currentSession + 1
    }),

    setNote(workoutId: number, workoutexerciseid: number | string, note: string) {
      store.programData.cyclelist[store.currentCycleIndex].workouts
        .find((item) => item.id === workoutId)
        ?.exercises.map(
          (item) => item.workoutexerciseid === workoutexerciseid && (item.notes = note),
        )
    },

    setExerciseMax(workoutId: number, workoutexerciseid: number | string, max: number | string) {
      store.programData.cyclelist[store.currentCycleIndex].workouts
        .find((workout) => {
          programService.updateWorkout(workout, store.programData.athleteid, store.programData.id)

          return workout.id === workoutId
        })
        ?.exercises.map(
          (item) => item.workoutexerciseid === workoutexerciseid && (item.planned.max = max),
        )
    },

    setEvaluation(workoutId: number, workoutexerciseid: number | string, evaluation: number) {
      store.programData.cyclelist[store.currentCycleIndex].workouts
        .find((workout) => {
          programService.updateWorkout(workout, store.programData.athleteid, store.programData.id)

          return workout.id === workoutId
        })
        ?.exercises.map((exercise) => {
          const { reps, sets } = exercise.planned
          const exerciseClassWRS = exercise.exerciseclass === "wrs"

          const repsByClass = exerciseClassWRS ? reps : ""

          if (exercise.workoutexerciseid === workoutexerciseid)
            exercise.actual
              ? (exercise.actual = {
                  weight: exercise.actual.weight,
                  reps: exercise.actual.reps || repsByClass,
                  sets: exercise.actual.sets || sets,
                  ease: evaluation.toString(),
                })
              : (exercise.actual = {
                  weight: null,
                  reps: repsByClass,
                  sets,
                  ease: evaluation.toString(),
                })

          return 0
        })
      store.lastChange = new Date().toString()
    },

    setSets(workoutId: number, workoutexerciseid: number | string, sets: string) {
      store.programData.cyclelist[store.currentCycleIndex].workouts
        .find((item) => item.id === workoutId)
        ?.exercises.map((exercise) => {
          if (exercise.workoutexerciseid === workoutexerciseid)
            exercise.actual
              ? (exercise.actual.sets = sets)
              : (exercise.actual = {
                  weight: null,
                  reps: null,
                  sets,
                  ease: null,
                })

          return null
        })
      store.lastChange = new Date().toString()
    },

    setReps(workoutId: number, workoutexerciseid: number | string, reps: string) {
      store.programData.cyclelist[store.currentCycleIndex].workouts
        .find((item) => item.id === workoutId)
        ?.exercises.map((exercise) => {
          if (exercise.workoutexerciseid === workoutexerciseid)
            exercise.actual
              ? (exercise.actual.reps = reps)
              : (exercise.actual = {
                  weight: null,
                  reps,
                  sets: null,
                  ease: null,
                })

          return null
        })
    },

    setWeight(workoutId: number, workoutexerciseid: number | string, weight: string) {
      store.programData.cyclelist[store.currentCycleIndex].workouts
        .find((item) => item.id === workoutId)
        ?.exercises.map((exercise) => {
          if (exercise.workoutexerciseid === workoutexerciseid) {
            exercise.actual
              ? (exercise.actual.weight = weight)
              : (exercise.actual = {
                  weight,
                  reps: null,
                  sets: null,
                  ease: null,
                })
          }

          return null
        })
      store.lastChange = new Date().toString()
    },

    setTouched(workoutexerciseid: number | string, value: "0" | "1") {
      const exercise = store.programData.cyclelist[store.currentCycleIndex].workouts[
        store.currentSession - 1
      ]?.exercises.find((exercise) => exercise.workoutexerciseid === workoutexerciseid)
      if (exercise) exercise.touched = value
    },

    setCurrentPastProgramId(pastProgramId: number) {
      store.currentPastProgramId = pastProgramId
    },

    setNextCurrentPastProgram() {
      const pastProgramIndex = store.pastPrograms.findIndex(
        (pastProgram) => pastProgram.id === store.currentPastProgramId,
      )

      if (pastProgramIndex < store.pastPrograms.length - 1) {
        const nextPastProgramId = store.pastPrograms[pastProgramIndex + 1].id
        store.currentPastProgramId = nextPastProgramId
      }
    },

    setPrevCurrentPastProgram() {
      const pastProgramIndex = store.pastPrograms.findIndex(
        (pastProgram) => pastProgram.id === store.currentPastProgramId,
      )

      if (pastProgramIndex > 0) {
        const nextPastProgramId = store.pastPrograms[pastProgramIndex - 1].id
        store.currentPastProgramId = nextPastProgramId
      }
    },

    setLoading(value: boolean) {
      store.isLoading = value
    },

    getPreviousActual(exerciseId: number | string, uniqueId: number | string, index: number) {
      if (store.currentCycle > 1) {
        const previousActual =
          store.programData.cyclelist[store.currentCycle - 2].workouts[store.currentSession - 1]
            ?.exercises[index]?.actual

        return previousActual
      }

      return null
    },

    fetchAbilitiesByGroup: flow(function* () {
      const abilitiesByGroup: IAbilityByGroup[] = yield userService.getAbilitiesByGroup(
        store.programData.athleteid,
      )

      abilitiesByGroup.sort((a, b) => +a.id - +b.id)

      store.abilitiesByGroup = cast(abilitiesByGroup)
    }),

    fetchProgramList: flow(function* () {
      const programsList: IProgramsListItem[] = yield programService.getProgramList()
      store.programsList = cast(programsList)

      return programsList
    }),

    setMaxes: flow(function* (ability: IUppdateAbility) {
      try {
        store.isLoading = true

        yield userService.saveAbilities(store.programData.athleteid, ability)
        store.programData.cyclelist.map((cycle) =>
          cycle.workouts.map((workout) =>
            workout.exercises.map(
              (exercise) =>
                exercise.id === ability.exercise_id && (exercise.ability = ability.ability),
            ),
          ),
        )
        const abilitiesByGroup: IAbilityByGroup[] = yield userService.getAbilitiesByGroup(
          store.programData.athleteid,
        )
        store.abilitiesByGroup = cast(abilitiesByGroup)
      } catch (error) {
        console.error("setMaxes error", error)
      } finally {
        store.isLoading = false
      }
    }),

    setLastChange: flow(function* () {
      store.lastChange = new Date().toDateString()
    }),

    fetchProgram: flow(function* () {
      if (store.activeProgram) {
        const fetchedProgram: IProgram = yield programService.loadProgram(store.activeProgram.id)
        store.programData = cast(fetchedProgram)

        return fetchedProgram
      }

      return null
    }),

    fetchProgramById: flow(function* (programId: number) {
      const fetchedProgram: IProgram = yield programService.loadProgram(programId)

      return fetchedProgram
    }),

    getAbilityIdByExerciseId(exerciseid: number | string) {
      return store.abilitiesByGroup.findLast((ability) => ability.exercise_id === exerciseid)?.id
    },

    fetchExerciseList: flow(function* () {
      const fetchedExerciseList: IExerciseListItem[] = yield programService.getExerciseList()
      store.exercisesList = cast(fetchedExerciseList)
      return fetchedExerciseList
    }),

    buildProgram: flow(function* (progdays: number, progfocus: number, prevprog: number) {
      yield programService.mageprograminfo(progdays, progfocus, prevprog)
    }),

    endProgram(programId: string | number) {
      const endProgramResult = programService.endProgram(programId)
      return endProgramResult
    },
  }))

export interface IExerciseListItem extends Instance<typeof ExerciseListItem> {}
export interface IGroup extends Instance<typeof Group> {}
export interface IAbilityByGroup extends Instance<typeof AbilityByGroup> {}
export interface IActual extends Instance<typeof Actual> {}
export interface IPlanned extends Instance<typeof Planned> {}
export interface IWorkout extends Instance<typeof Workout> {}
export interface IExercise extends Instance<typeof Exercise> {}
export interface IProgram extends Instance<typeof ProgramData> {}
export interface IProgramsListItem extends Instance<typeof ProgramsListItem> {}
export interface ProgramDataStore extends Instance<typeof ProgramDataStoreModel> {}
export interface ProgramDataStoreSnapshot extends SnapshotOut<typeof ProgramDataStoreModel> {}
