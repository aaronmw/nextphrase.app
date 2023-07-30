"use client";

import { AppContext } from "@/app/context";
import "@/app/globals.css";
import { initialState, reducer } from "@/app/reducer";
import { useAudio } from "@/hooks/useAudio";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import isEqual from "lodash/isEqual";
import { Source_Sans_3 } from "next/font/google";
import Script from "next/script";
import { ReactNode, useEffect, useReducer, useState } from "react";

const sourceSource_Sans_3 = Source_Sans_3({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [hasLoadedFromLocalStarage, setHasLoadedFromLocalStarage] =
    useState(false);

  const [stateInLocalStorage, setStateInLocalStorage] = useLocalStorage({
    initialValue: initialState,
    key: "game-state",
  });

  useEffect(() => {
    if (hasLoadedFromLocalStarage || !stateInLocalStorage) {
      return;
    }

    dispatch({
      type: "setState",
      payload: stateInLocalStorage,
    });

    setHasLoadedFromLocalStarage(true);
  }, [hasLoadedFromLocalStarage, stateInLocalStorage]);

  useEffect(() => {
    if (!hasLoadedFromLocalStarage) {
      return;
    }

    if (!isEqual(state, stateInLocalStorage)) {
      setStateInLocalStorage(state);
    }
  }, [hasLoadedFromLocalStarage, state, stateInLocalStorage]);

  const sounds = {
    a: useAudio("/sounds/a.trimmed.wav"),
    b: useAudio("/sounds/b.trimmed.wav"),
    beep: useAudio("/sounds/beep.wav"),
    boom: useAudio("/sounds/boom.trimmed.wav"),
    buzz: useAudio("/sounds/buzz.wav"),
    celebration: useAudio("/sounds/celebration.wav"),
    oops: useAudio("/sounds/oops.trimmed.wav"),
    tick: useAudio("/sounds/tick.wav"),
    typewriter: useAudio("/sounds/typewriter.trimmed.wav"),
    woosh: useAudio("/sounds/woosh.wav"),
  };

  const appContext = {
    dispatch,
    sounds,
    state,
  };

  return (
    <html className="touch-manipulation text-[22px]" lang="en">
      <head>
        <meta
          name="viewport"
          content="initial-scale=1.0,width=device-width,user-scalable=no"
        />
        <Script
          src="https://kit.fontawesome.com/401fb1e734.js"
          crossOrigin="anonymous"
        />
      </head>

      <body className={sourceSource_Sans_3.className}>
        <AppContext.Provider value={appContext}>{children}</AppContext.Provider>
      </body>
    </html>
  );
}
