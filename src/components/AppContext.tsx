'use client'

import {
  AppAction,
  AppState,
  appStateReducer,
  initialState,
  persistedStateKeys,
} from '@/app/reducer'
import { supabase } from '@/app/supabase'
import { usePersistedReducer } from '@/lib/usePersistedReducer'
import { SoundProperties, useSoundPreloader } from '@/lib/useSoundPreloader'
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

const soundFiles = {
  'bonk': { src: '/sounds/bonk.mp3' },
  'cheering': { src: '/sounds/cheering.mp3', trimStart: 0.4 },
  'sad-trombone': { src: '/sounds/sad-trombone.mp3' },
  'pop': { src: '/sounds/pop.mp3' },
  'spacebar-click': { src: '/sounds/spacebar-click.mp3' },
  'glass-explosion': { src: '/sounds/glass-explosion.mp3' },
} satisfies Record<string, SoundProperties>

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
