import { AppContext } from "context"
import { useLocalStorage } from "hooks/useLocalStorage"
import { isEqual, mapValues } from "lodash"
import { useEffect, useReducer, useState } from "react"
import { initialState, reducer } from "reducer"
import { InstructionsScreen } from "screens/InstructionsScreen"
import { IntroScreen } from "screens/IntroScreen"
import { LobbyScreen } from "screens/LobbyScreen"
import { OptionsScreen } from "screens/OptionsScreen"
import { sounds } from "sounds"
import { SoundName } from "types"

const useSoundEffects = (sounds: Record<string, string>) => {
  return mapValues(sounds, (sound) => new Audio(`/sounds/${sound}`)) as Record<
    SoundName,
    HTMLAudioElement
  >
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const [hasLoadedFromLocalStarage, setHasLoadedFromLocalStarage] =
    useState(false)

  const [stateInLocalStorage, setStateInLocalStorage] = useLocalStorage({
    initialValue: initialState,
    key: "game-state",
  })

  const { activeScreenName, soundEffectsQueue } = state

  const soundEffects = useSoundEffects(sounds)

  useEffect(() => {
    if (soundEffectsQueue.length >= 1) {
      soundEffectsQueue.forEach((soundName) => {
        const soundEffect = soundEffects[soundName]

        soundEffect.currentTime = 0

        soundEffect.play()
      })

      dispatch({
        type: "setState",
        payload: {
          soundEffectsQueue: [],
        },
      })
    }
  }, [soundEffects, soundEffectsQueue])

  useEffect(() => {
    if (hasLoadedFromLocalStarage || !stateInLocalStorage) {
      return
    }

    dispatch({
      type: "setState",
      payload: {
        ...stateInLocalStorage,
        dispatch,
      },
    })

    setHasLoadedFromLocalStarage(true)
  }, [hasLoadedFromLocalStarage, stateInLocalStorage])

  useEffect(() => {
    if (hasLoadedFromLocalStarage === false) {
      return
    }

    if (!isEqual(state, stateInLocalStorage)) {
      setStateInLocalStorage(state)
    }
  }, [
    hasLoadedFromLocalStarage,
    setStateInLocalStorage,
    state,
    stateInLocalStorage,
  ])

  const appContext = {
    dispatch,
    soundEffects,
    state,
  }

  if (process.env.NODE_ENV === "development") {
    console.log({ activeScreenName })
  }

  return (
    <AppContext.Provider value={appContext}>
      <IntroScreen isActive={activeScreenName === "intro"} />
      <InstructionsScreen isActive={activeScreenName === "instructions"} />
      <LobbyScreen isActive={activeScreenName === "lobby"} />
      <OptionsScreen isActive={activeScreenName === "options"} />
    </AppContext.Provider>
  )
}

export default App
