import axiosInterceptorInstance from "app/utils/axiosInterceptorInstance"
import { IProgram, IProgramsListItem, IWorkout } from "app/models/ProgramStore"

class ProgramService {
  async updateWorkout(workout: IWorkout, athlete: number, program: number) {
    await axiosInterceptorInstance.post(
      "/program.php",
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

  async getProgramList(): Promise<IProgramsListItem[]> {
    const response = await axiosInterceptorInstance.get("/program.php", {
      params: {
        function: "getprogramlist",
      },
    })

    return response.data.programs
  }

  async loadProgram(program: number | string): Promise<IProgram[]> {
    const response = await axiosInterceptorInstance.get("/program.php", {
      params: {
        function: "loadappprogram",
        program,
      },
    })

    return response.data
  }

  async startNewCycle(programId: number | string) {
    const response = await axiosInterceptorInstance.get("/program.php", {
      params: {
        function: "startcycle",
        program: programId,
      },
    })

    return response.data
  }

  async getExerciseList() {
    const response = await axiosInterceptorInstance.get("/exercises.php", {
      params: {
        function: "getexerciselist",
      },
    })

    return response.data.exercises
  }

  async mageprograminfo(progdays: number, progfocus: number, prevprog: number) {
    const response = await axiosInterceptorInstance.get("/general.php", {
      params: {
        function: "mageprograminfo",
        progdays: progdays.toString(),
        progfocus: progfocus.toString(),
        prevprog: prevprog.toString(),
      },
    })

    return response.data
  }
  async endProgram(programId: string | number) {
    const response = await axiosInterceptorInstance.post(
      "/program.php",
      {
        program: programId,
      },
      {
        params: {
          function: "endprogram",
        },
      },
    )
    return response.status
  }
}

export default new ProgramService()
