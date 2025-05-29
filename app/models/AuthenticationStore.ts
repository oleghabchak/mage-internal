import UserService from "app/services/user/userService"
import { Instance, SnapshotOut, cast, flow, types } from "mobx-state-tree"
import * as FileSystem from "expo-file-system"
import * as SecureStore from "expo-secure-store"
import { IAthlete, IUser, IUserInfo } from "app/utils/types/UserData"

const Sport = types.model({
  value: types.number,
  name: types.string,
  description: types.string,
})

const Equipment = types.model({
  value: types.number,
  name: types.string,
  description: types.string,
})
const Trainer = types.model({
  id: types.number,
  u_id: types.number,
  firstname: types.string,
  lastname: types.union(types.string, types.null),
})

export const AuthenticationStoreModel = types
  .model("authenticationStore")
  .props({
    athleteId: types.optional(types.number, 0),
    userId: types.optional(types.number, 0),
    isLoading: types.optional(types.boolean, false),
    photo: types.optional(types.string, ""),
    authenticated: types.maybe(types.boolean),
    firstName: types.optional(types.string, ""),
    lastName: types.optional(types.string, ""),
    email: types.optional(types.string, ""),
    username: types.optional(types.string, ""),
    password: types.optional(types.string, ""),
    diet: types.optional(types.number, 0),
    dob: types.optional(types.string, ""),
    experience: types.optional(types.number, 0),
    gender: types.optional(types.string, ""),
    height: types.optional(types.union(types.number, types.string), ""),
    recovery: types.optional(types.number, 1),
    sleep: types.optional(types.number, 0),
    stress: types.optional(types.number, 0),
    weight: types.optional(types.union(types.number, types.string), ""),
    activity: types.optional(types.number, 0),
    OTPcode: types.optional(types.string, ""),
    sport: types.optional(types.number, 0),
    differentiator: types.optional(types.number, 0),
    equipmentsList: types.optional(types.array(Equipment), []),
    trainerList: types.optional(types.array(Trainer), []),
    sportList: types.optional(types.array(Sport), []),
    returnScreen: types.optional(types.string, ""),
    athletetrainer: types.optional(types.number, 0),
    equipment: types.optional(types.number, 0),
    firstVisit: types.optional(types.boolean, false),
    goals: types.optional(types.string, ""),
    notes: types.optional(types.string, ""),
  })
  .views((store) => ({
    get isAuthenticated() {
      return store.authenticated
    },
    get trainerName() {
      return store.trainerList.find((trainer) => trainer.id === store.athletetrainer)?.firstname
    },
  }))
  .actions((store) => ({
    setLoading(value: boolean) {
      store.isLoading = value
    },
    setAthleteId(value: number) {
      store.athleteId = value
    },
    setPhoto(value: string) {
      store.photo = value
    },
    setAuthenticated(value?: boolean) {
      store.authenticated = value
    },
    setFirstName(value: string) {
      store.firstName = value.replace(/ /g, "")
    },
    setLastName(value: string) {
      store.lastName = value.replace(/ /g, "")
    },
    setEmail(value: string) {
      store.email = value.replace(/ /g, "")
    },
    setUserName(value: string) {
      store.username = value.replace(/ /g, "")
    },
    setPassword(value: string) {
      store.password = value.replace(/ /g, "")
    },
    setDiet(value: number) {
      store.diet = value
    },
    setDob(value: string) {
      store.dob = value.replace(/ /g, "")
    },
    setExperience(value: number) {
      store.experience = value
    },
    setGender(value: string) {
      store.gender = value.replace(/ /g, "")
    },
    setHeight(value: string) {
      if (!+value) {
        store.height = ""
      } else {
        store.height = value
      }
    },
    setRecovery(value: number) {
      store.recovery = value
    },
    setSleep(value: number) {
      store.sleep = value
    },
    setStress(value: number) {
      store.stress = value
    },
    setWeight(value: number | string) {
      if (!+value) {
        store.weight = ""
      } else {
        store.weight = value
      }
    },
    setActivity(value: number) {
      store.activity = value
    },
    setOTPcode(value: string) {
      store.OTPcode = value
    },
    setSport(value: number) {
      store.sport = value
    },
    setDifferentiator(value: number) {
      store.differentiator = value
    },
    setReturnScreen(value: string) {
      store.returnScreen = value
    },
    setEquipment(value: number) {
      store.equipment = value
    },
    resetReturnScreen() {
      store.returnScreen = ""
    },
    setFirstVisit(value: boolean) {
      store.firstVisit = value
    },
    setGoals(value: string) {
      store.goals = value
    },
    setGeneralNote(value: string) {
      store.notes = value
    },
    setUserId(value: number) {
      store.userId = value
    },
    setAthleteData: flow(function* (athlete: IAthlete) {
      store.athleteId = athlete.id
      store.diet = athlete.diet
      store.dob = athlete.dob
      store.experience = athlete.experience
      store.gender = athlete.gender
      store.height = athlete.height
      store.recovery = athlete.recovery
      store.sleep = athlete.sleep
      store.stress = athlete.stress
      store.weight = athlete.weight
      store.sport = athlete.sport
      store.activity = athlete.activity
      store.differentiator = athlete.differentiator
      store.goals = athlete.goals
      store.notes = athlete.notes
    }),
    setUserData: flow(function* (userData: IUser) {
      store.firstName = userData.firstname
      store.lastName = userData.lastname
      store.email = userData.email
      store.username = userData.username
    }),
    login: flow(function* (username: string, password: string) {
      const response = yield UserService.login(username, password)

      if (response.kind === "ok") {
        SecureStore.setItem("password", password)
        SecureStore.setItem("authToken", response.data.token)

        const userId = response.data.user

        const fileUri = `${FileSystem.documentDirectory}profilePhoto${userId}.jpg`
        const fileInfo = yield FileSystem.getInfoAsync(fileUri)
        if (fileInfo.exists) {
          store.photo = fileUri
        }

        store.userId = userId
        store.athletetrainer = response.data.athletetrainer
        store.password = ""
        store.authenticated = true
      }
    }),
    signUp: flow(function* () {
      const { username, email, firstName, lastName, password } = store
      const userProfile: IUserInfo = {
        email,
        firstname: firstName,
        lastname: lastName,
      }
      const response = yield UserService.signUp(username, password, userProfile)
      return response
    }),
    logout() {
      store.isLoading = false
      store.photo = ""
      store.authenticated = false
      store.firstName = ""
      store.lastName = ""
      store.email = ""
      store.username = ""
      store.password = ""
      store.diet = 0
      store.dob = ""
      store.experience = 0
      store.gender = ""
      store.height = 0
      store.athleteId = 0
      store.recovery = 0
      store.sleep = 0
      store.stress = 0
      store.weight = 0
      store.activity = 0
      store.athletetrainer = 0
      store.differentiator = 0
      store.notes = ""

      SecureStore.deleteItemAsync("password")
      SecureStore.deleteItemAsync("authToken")
    },
    updateUser: flow(function* () {
      const athleteProfile: IAthlete = {
        diet: store.diet,
        dob: store.dob,
        experience: store.experience,
        gender: store.gender,
        height: store.height,
        id: store.athleteId,
        recovery: store.recovery,
        sleep: store.sleep,
        stress: store.stress,
        weight: store.weight,
        activity: store.activity,
        sport: store.sport,
        equipment: store.equipment,
        notes: store.notes,
        differentiator: store.differentiator,
        goals: store.goals,
      }

      const userProfile: IUserInfo = {
        email: store.email,
        firstname: store.firstName,
        lastname: store.lastName,
      }

      yield UserService.setProfile(athleteProfile, userProfile)
    }),
    resetPassword: flow(function* () {
      return yield UserService.resetPassword(store.username)
    }),
    setNewPassword: flow(function* () {
      return yield UserService.setPassword(store.username, store.OTPcode, store.password)
    }),
    fetchEquipmentsList: flow(function* () {
      const equipmentsList: IEquipment[] = yield UserService.getEquipmentsList()

      store.equipmentsList = cast(equipmentsList)
    }),
    fetchTrainerList: flow(function* () {
      const trainerList: ITrainer[] = yield UserService.getTrainerList()

      store.trainerList = cast(trainerList)
    }),
    fetchSportsList: flow(function* () {
      const sportsList: ISport[] = yield UserService.getSportsList()

      store.sportList = cast(sportsList)
    }),
    changePassword: flow(function* (newPassword: string) {
      const responseStatus: boolean = yield UserService.changePassword(newPassword)

      return responseStatus
    }),
    setTrainer: flow(function* (trainerId: number) {
      try {
        const response = yield UserService.setTrainer(trainerId)
        store.athletetrainer = trainerId

        return response
      } catch (error) {
        console.error("setTrainer error", error)
      }
    }),
    reportProblem: flow(function* (topic: string, description: string) {
      try {
        const response = yield UserService.reportProblem(topic, description)
        return response
      } catch (error) {
        console.error("setTrainer error", error)
      }
    }),
    deleteAccount: flow(function* () {
      try {
        const response = yield UserService.deleteAccount()
        return response
      } catch (error) {
        console.error("setTrainer error", error)
      }
    }),
  }))

export interface ISport extends Instance<typeof Sport> {}
export interface IEquipment extends Instance<typeof Equipment> {}
export interface ITrainer extends Instance<typeof Trainer> {}
export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}
