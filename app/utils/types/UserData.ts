export interface IAthlete {
  id: number
  gender: string
  dob: string
  height: number | string
  weight: number | string
  experience: number
  diet: number
  sleep: number
  stress: number
  activity: number
  recovery: number
  sport: number
  equipment: number
  notes: string
  differentiator: number
  goals: string
  colormode: string
  accentcolor: string
}

export interface IAthleteUnchecked {
  diet?: string
  dob?: string
  experience?: string
  gender?: string
  height?: string
  id?: string
  recovery?: string
  sleep?: string
  stress?: string
  weight?: string
}

export interface IUser extends IUserInfo, IUserName {}

export interface IUserInfo {
  email: string
  firstname: string
  lastname: string
}

export interface IUserName {
  username: string
}

export interface IUserUnchecked {
  email?: string
  firstname?: string
  lastname?: string
  username?: string
}

export interface IUserData {
  athlete?: IAthlete
  user?: IUser
}

export interface IUppdateAbility {
  id?: number | string
  exercise_id: number | string
  ability: number | string
}
