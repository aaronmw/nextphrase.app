'use client'

import {
  AppAction,
  APP_STATE_STORAGE_KEY,
  AppState,
  appStateReducer,
  initialState,
  persistedStateKeys,
} from '@/app/reducer'
import { soundFiles } from '@/app/sounds'
import { supabase } from '@/app/supabase'
import { applyTextOnThemeColors } from '@/app/theme'
import { usePersistedReducer } from '@/lib/usePersistedReducer'
import { useSoundPreloader } from '@/lib/useSoundPreloader'
import keyBy from 'lodash/keyBy'
import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'

interface AppContextObject {
  dispatch: Dispatch<AppAction>
  isLoading: boolean
  state: AppState
  sounds: ReturnType<typeof useSoundPreloader<keyof typeof soundFiles>>
}

const PrivateAppContext = createContext<AppContextObject>({
  dispatch: () => {},
  isLoading: true,
  state: initialState,
  sounds: {
    isPreloading: true,
    loadedSounds: {},
    playSound: () => {},
    stopSound: () => {},
  },
})

export function AppContext({ children }: { children: ReactNode }) {
  const [state, dispatch] = usePersistedReducer({
    initialState,
    key: APP_STATE_STORAGE_KEY,
    persistedKeys: persistedStateKeys,
    reducer: appStateReducer,
  })
  const [isLoadingPhrases, setIsLoadingPhrases] = useState(true)
  const sounds = useSoundPreloader(soundFiles)

  useLayoutEffect(() => {
    applyTextOnThemeColors()
  }, [])

  useEffect(() => {
    let isCancelled = false

    async function getPhrasesById() {
      try {
        const { data: rows, error } = await supabase
          .from('categories')
          .select('*, phrases(*)')

        if (error) throw error
        if (!rows?.length) return

        const categoriesById = keyBy(rows, 'id')

        dispatch({
          type: 'SET_PHRASES_AND_CATEGORIES',
          categoriesById,
        })
      } catch (error) {
        console.error('Failed to load phrases and categories', error)
      } finally {
        if (!isCancelled) {
          setIsLoadingPhrases(false)
        }
      }
    }

    void getPhrasesById()

    return () => {
      isCancelled = true
    }
  }, [dispatch])

  const isLoading = isLoadingPhrases || sounds.isPreloading
  const contextValue = useMemo(
    () => ({
      dispatch,
      isLoading,
      sounds,
      state,
    }),
    [dispatch, isLoading, sounds, state],
  )

  return <PrivateAppContext value={contextValue}>{children}</PrivateAppContext>
}

export function useAppContext() {
  return useContext(PrivateAppContext)
}
