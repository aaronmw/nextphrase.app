'use client'

import { AppAction, AppReducer, AppState, initialState } from '@/app/reducer'
import { Dispatch, ReactNode, createContext, useReducer } from 'react'

export interface SiteContextObject {
  dispath: Dispatch<AppAction>
  state: AppState
}

export const SiteContext = createContext<SiteContextObject>({
  dispath: () => {},
  state: initialState,
})

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [state, dispath] = useReducer(AppReducer, initialState)

  return (
    <SiteContext.Provider
      value={{
        dispath,
        state,
      }}
    >
      {children}
    </SiteContext.Provider>
  )
}
