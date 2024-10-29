'use client'

import {
  AppAction,
  AppState,
  appStateReducer,
  initialState,
  persistedStateKeys,
} from '@/app/reducer'
import { soundFiles } from '@/app/sounds'
import { supabase } from '@/app/supabase'
import { usePersistedReducer } from '@/lib/usePersistedReducer'
import { useSoundPreloader } from '@/lib/useSoundPreloader'
import { keyBy } from 'lodash'
import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useEffect,
} from 'react'

interface AppContextObject {
  dispatch: Dispatch<AppAction>
  state: AppState
  sounds: ReturnType<typeof useSoundPreloader<keyof typeof soundFiles>>
}

const PrivateAppContext = createContext<AppContextObject>({
  dispatch: () => {},
  state: initialState,
  sounds: {
    loadedSounds: {},
    playSound: () => {},
    stopSound: () => {},
  },
})

export function AppContext({ children }: { children: ReactNode }) {
  const [state, dispatch] = usePersistedReducer({
    initialState,
    key: 'appState',
    persistedKeys: persistedStateKeys,
    reducer: appStateReducer,
  })

  console.log('Re-rendering AppContext')

  const sounds = useSoundPreloader(soundFiles)

  useEffect(() => {
    async function getPhrasesById() {
      const { data: rows } = await supabase
        .from('categories')
        .select('*, phrases(*)')

      if (!rows?.length) return

      const categoriesById = keyBy(rows, 'id')

      dispatch({
        type: 'SET_PHRASES_AND_CATEGORIES',
        categoriesById,
      })
    }

    getPhrasesById()
  }, [])

  return (
    <PrivateAppContext
      value={{
        dispatch,
        state,
        sounds,
      }}
    >
      {children}
    </PrivateAppContext>
  )
}

export function useAppContext() {
  return useContext(PrivateAppContext)
}
