import { createContext, useContext } from "react"
import { initialState } from "reducer"
import { type AppContextObject } from "types"

export { AppContext, useAppContext }

const AppContext = createContext<AppContextObject>({
  dispatch: () => null,
  state: initialState,
})

const useAppContext = () => useContext(AppContext)
