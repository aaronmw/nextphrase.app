import { Reducer, useEffect, useReducer } from 'react'

export function usePersistedReducer({
  reducer,
  initialState = {},
  key,
  persistedKeys = [],
  restoreState,
}: {
  reducer: Reducer<any, any>
  initialState: any
  key: string
  persistedKeys: string[]
  restoreState?: (state: any) => any
}) {
  // Initialize state from localStorage, or fall back to initialState
  const [state, dispatch] = useReducer(
    reducer,
    initialState,
    (initial = {}) => {
      const persisted =
        typeof localStorage !== 'undefined' &&
        typeof localStorage.getItem === 'function'
          ? localStorage.getItem(key)
          : null
      const restored = persisted
        ? { ...initial, ...JSON.parse(persisted) }
        : initial
      return restoreState ? restoreState(restored) : restored
    },
  )

  // Update localStorage whenever state changes
  useEffect(() => {
    const getFilteredState = (state: any = {}) => {
      if (!persistedKeys.length) return state
      return Object.fromEntries(
        Object.entries(state).filter(([k]) => persistedKeys.includes(k)),
      )
    }

    const filteredState = getFilteredState(state)

    if (typeof localStorage?.setItem === 'function') {
      localStorage.setItem(key, JSON.stringify(filteredState))
    }
  }, [key, state, persistedKeys])

  return [state, dispatch]
}
