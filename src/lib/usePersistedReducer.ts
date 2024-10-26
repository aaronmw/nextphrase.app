import { Reducer, useEffect, useReducer } from 'react'

export function usePersistedReducer({
  reducer,
  initialState = {},
  key,
  persistedKeys = [],
}: {
  reducer: Reducer<any, any>
  initialState: any
  key: string
  persistedKeys: string[]
}) {
  // Initialize state from localStorage, or fall back to initialState
  const [state, dispatch] = useReducer(
    reducer,
    initialState,
    (initial = {}) => {
      if (typeof localStorage === 'undefined') return initial
      const persisted = localStorage.getItem(key)
      return persisted ? { ...initial, ...JSON.parse(persisted) } : initial
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

    localStorage.setItem(key, JSON.stringify(filteredState))
  }, [key, state, persistedKeys])

  return [state, dispatch]
}
