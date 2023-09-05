"use client"

import { AppContext } from "@/app/context"
import "@/app/globals.css"
import { initialState, reducer } from "@/app/reducer"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import isEqual from "lodash/isEqual"
import { Caveat_Brush } from "next/font/google"
import Script from "next/script"
import { ReactNode, useEffect, useReducer, useState } from "react"
import { twMerge } from "tailwind-merge"

export const sounds = {
  a: "a.trimmed.wav",
  b: "b.trimmed.wav",
  beep: "beep.wav",
  boom: "boom.trimmed.wav",
  buzz: "buzz.wav",
  celebration: "celebration.wav",
  oops: "oops.trimmed.wav",
  tick: "tick.wav",
  typewriter: "typewriter.trimmed.wav",
  woosh: "woosh.wav",
}

const googleFont = Caveat_Brush({
  display: "swap",
  subsets: ["latin"],
  weight: "400",
  variable: "--font-nanum-brush-script",
})

export default function RootLayout({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const [hasLoadedFromLocalStarage, setHasLoadedFromLocalStarage] =
    useState(false)

  const [stateInLocalStorage, setStateInLocalStorage] = useLocalStorage({
    initialValue: initialState,
    key: "game-state",
  })

  const sounds = {
    a: new Audio("/sounds/a.trimmed.wav"),
    b: new Audio("/sounds/b.trimmed.wav"),
    beep: new Audio("/sounds/beep.wav"),
    boom: new Audio("/sounds/boom.trimmed.wav"),
    buzz: new Audio("/sounds/buzz.wav"),
    celebration: new Audio("/sounds/celebration.wav"),
    oops: new Audio("/sounds/oops.trimmed.wav"),
    tick: new Audio("/sounds/tick.wav"),
    typewriter: new Audio("/sounds/typewriter.trimmed.wav"),
    woosh: new Audio("/sounds/woosh.wav"),
  }

  const { soundEffectsQueue } = state

  useEffect(() => {
    if (soundEffectsQueue.length >= 1) {
      soundEffectsQueue.forEach((soundName) => {
        const soundEffect = sounds[soundName]

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
  }, [soundEffectsQueue])

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
  }, [hasLoadedFromLocalStarage, state, stateInLocalStorage])

  const appContext = {
    dispatch,
    sounds,
    state,
  }

  return (
    <html
      className={twMerge(
        `
          touch-manipulation
          bg-appBackgroundColor
        `,
        googleFont.variable,
      )}
      lang="en"
    >
      <head>
        <meta
          name="viewport"
          content="minimal-ui, width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />

        <link
          rel="manifest"
          href="/manifest.json"
        />

        <link
          rel="icon"
          href="/app-icon.png"
        />

        <Script
          src="https://kit.fontawesome.com/401fb1e734.js"
          crossOrigin="anonymous"
        />
      </head>

      <body className="font-brush">
        <AppContext.Provider value={appContext}>{children}</AppContext.Provider>
      </body>
    </html>
  )
}
