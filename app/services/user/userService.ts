import { IAthlete, IUppdateAbility, IUserInfo } from "app/utils/types/UserData"
import axiosInterceptorInstance from "app/utils/axiosInterceptorInstance"
import { IWorkout } from "app/models/ProgramStore"

class UserService {
  async login(username: string, password: string) {
    const response = await axiosInterceptorInstance("/general.php", {
      params: {
        function: "logon",
        username,
        password,
      },
    })

    return { kind: "ok", data: response.data }
  }

  async signUp(username: string, password: string, userProfile: IUserInfo) {
    try {
      const response = await axiosInterceptorInstance.post(
        "/general.php",
        {
          profile: {
            username,
            password,
            user: userProfile,
          },
        },
        {
          params: {
            function: "createathlete",
          },
        },
      )

      return response.data
    } catch (error) {
      console.error("Error setting user profile:", error)
      throw error
    }
  }

  async getProfile() {
    const response = await axiosInterceptorInstance("/general.php", {
      params: {
        function: "getprofile",
      },
    })

    return { kind: "ok", data: response.data }
  }

  async setProfile(athleteProfile: IAthlete, userProfile: IUserInfo) {
    try {
      const response = await axiosInterceptorInstance.post(
        "/general.php",
        {
          profile: {
            user: userProfile,
            athlete: athleteProfile,
          },
        },
        {
          params: {
            function: "saveprofile",
          },
        },
      )

      return response.data
    } catch (error) {
      console.error("Error setting user profile:", error)
      throw error
    }
  }

  async resetPassword(username: string) {
    try {
      const response = await axiosInterceptorInstance.get("/general.php", {
        params: {
          function: "passwordreset",
          username,
        },
      })

      return response.data
    } catch (error) {
      console.error("Error resetPassword:", error)
      throw error
    }
  }

  async setPassword(username: string, code: string, password: string) {
    try {
      const response = await axiosInterceptorInstance.get("/general.php", {
        params: {
          function: "passwordset",
          username,
          code,
          password,
        },
      })

      return response.data
    } catch (error) {
      console.error("Error resetPassword:", error)
      throw error
    }
  }

  async getAbilities(athlete: number) {
    const response = await axiosInterceptorInstance("/general.php", {
      params: {
        function: "getabilities",
        athlete,
      },
    })

    return response.data
  }

  async getAbilitiesByGroup(athlete: number) {
    const response = await axiosInterceptorInstance("/general.php", {
      params: {
        function: "getabilitiesbygroup",
        athlete,
        grouptype: 0,
      },
    })

    return response.data
  }

  async saveAbilities(athlete: number, ability: IUppdateAbility) {
    try {
      const response = await axiosInterceptorInstance.post(
        "/general.php",
        {
          abilities: [{ ...ability }],
        },
        {
          params: {
            function: "saveabilities",
            athlete,
          },
        },
      )

      return response.data
    } catch (error) {
      console.error("Error setting user profile:", error)
      throw error
    }
  }

  async updateWorkout(workout: IWorkout, athlete: number, program: number) {
    await axiosInterceptorInstance.post(
      "/general.php",
      {
        athlete,
        program,
        workoutdata: workout,
      },
      {
        params: {
          function: "updateworkout",
        },
      },
    )
  }

  async getSportsList() {
    const response = await axiosInterceptorInstance("/general.php", {
      params: {
        function: "getreferences",
        type: 2,
      },
    })

    return response.data
  }

  async getEquipmentsList() {
    const response = await axiosInterceptorInstance("/general.php", {
      params: {
        function: "getreferences",
        type: 3,
      },
    })

    return response.data
  }

  async getTrainerList() {
    const response = await axiosInterceptorInstance("/general.php", {
      params: {
        function: "gettrainerlist",
      },
    })

    return response.data
  }

  async setTrainer(trainerId: number) {
    const response = await axiosInterceptorInstance("/general.php", {
      params: {
        function: "settrainer",
        trainer: trainerId,
      },
    })

    return response.data
  }

  async changePassword(newPassword: string) {
    const response = await axiosInterceptorInstance("/general.php", {
      params: {
        function: "passwordchange",
        newpassword: newPassword,
      },
    })

    return response.data.success
  }

  async reportProblem(topic: string, description: string) {
    const response = await axiosInterceptorInstance("/general.php", {
      params: {
        function: "passwordchange",
        topic,
        description,
      },
    })

    return response.data.success
  }

  async deleteAccount() {
    const response = await axiosInterceptorInstance("/general.php", {
      params: {
        function: "deleteathlete",
      },
    })

    return response.data
  }
}

export default new UserService()
