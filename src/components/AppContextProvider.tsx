'use client'

import { ReactNode, createContext } from 'react'

export interface SiteContextObject {}

export const SiteContext = createContext<SiteContextObject>({})

export function AppContextProvider({ children }: { children: ReactNode }) {
  return <SiteContext.Provider value={{}}>{children}</SiteContext.Provider>
}
