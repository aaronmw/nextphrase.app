"use client";

import { useEffect, useState } from "react";

interface useAudioHook {
  (url: string): { isPlaying: boolean; play: () => void };
}

export const useAudio: useAudioHook = (url) => {
  if (typeof Audio === "undefined") {
    return {
      isPlaying: false,
      play: () => null,
    };
  }

  const [audio] = useState(new Audio(url));

  const [isPlaying, setIsPlaying] = useState(false);

  const play = () => setIsPlaying(!isPlaying);

  useEffect(() => {
    if (isPlaying) {
      audio.currentTime = 0;
      audio.play();
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    audio.addEventListener("ended", () => setIsPlaying(false));

    return () => {
      audio.removeEventListener("ended", () => setIsPlaying(false));
    };
  }, []);

  return { isPlaying, play };
};
