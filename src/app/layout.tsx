"use client";

import { AppContext } from "@/app/context";
import "@/app/globals.css";
import { initialState, reducer } from "@/app/reducer";
import { useAudio } from "@/hooks/useAudio";
import { Source_Sans_3 } from "next/font/google";
import Script from "next/script";
import { ReactNode, useReducer } from "react";

const sourceSource_Sans_3 = Source_Sans_3({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [isPlayingA, playA] = useAudio("/sounds/a.wav");
  const [isPlayingB, playB] = useAudio("/sounds/b.wav");
  const [isPlayingTick, playTick] = useAudio("/sounds/tick.wav");
  const [isPlayingTypewriter, playTypewriter] = useAudio(
    "/sounds/typewriter.wav"
  );
  const [isPlayingBeep, playBeep] = useAudio("/sounds/beep.wav");
  const [isPlayingBoom, playBoom] = useAudio("/sounds/boom.wav");
  const [isPlayingBuzz, playBuzz] = useAudio("/sounds/buzz.wav");
  const [isPlayingCelebration, playCelebration] = useAudio(
    "/sounds/celebration.wav"
  );
  const [isPlayingWoosh, playWoosh] = useAudio("/sounds/woosh.wav");
  const [isPlayingOops, playOops] = useAudio("/sounds/oops.wav");

  const appContext = {
    dispatch,
    sounds: {
      a: {
        isPlaying: isPlayingA,
        play: playA,
      },
      b: {
        isPlaying: isPlayingB,
        play: playB,
      },
      tick: {
        isPlaying: isPlayingTick,
        play: playTick,
      },
      typewriter: {
        isPlaying: isPlayingTypewriter,
        play: playTypewriter,
      },
      beep: {
        isPlaying: isPlayingBeep,
        play: playBeep,
      },
      boom: {
        isPlaying: isPlayingBoom,
        play: playBoom,
      },
      buzz: {
        isPlaying: isPlayingBuzz,
        play: playBuzz,
      },
      celebration: {
        isPlaying: isPlayingCelebration,
        play: playCelebration,
      },
      woosh: {
        isPlaying: isPlayingWoosh,
        play: playWoosh,
      },
      oops: {
        isPlaying: isPlayingOops,
        play: playOops,
      },
    },
    state,
  };

  return (
    <html lang="en">
      <head>
        <Script
          crossOrigin="anonymous"
          src="https://kit.fontawesome.com/401fb1e734.js"
        />
      </head>

      <body className={sourceSource_Sans_3.className}>
        <AppContext.Provider value={appContext}>{children}</AppContext.Provider>
      </body>
    </html>
  );
}
