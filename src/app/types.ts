import { type Dispatch } from "react";

export interface AppContextObject {
  dispatch: Dispatch<AppAction>;
  sounds: Record<
    string,
    {
      isPlaying: boolean;
      play: () => void;
    }
  >;
  state: AppState;
}

export interface AppState {
  activeListNames: string[];
  activePhrases: string[];
  aliasForA: null | string;
  aliasForB: null | string;
  pointsForA: number;
  pointsForB: number;
  rotateScreen: boolean;
  seenPhrases: string[];
}

export type AppAction =
  | {
      type: "setState";
      payload: Partial<AppState>;
    }
  | {
      type: "toggleActiveList";
      payload: {
        listName: string;
      };
    };
