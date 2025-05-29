import { createContext } from "react"

type AppContextType = {
  theme: string
  setTheme: (theme: string) => void
}

export const AppContext = createContext<AppContextType>({
  theme: "",
  setTheme: () => {},
})
