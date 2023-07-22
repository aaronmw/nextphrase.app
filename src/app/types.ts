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

export interface AppState {}

export type AppAction = {
  type: "setState";
  payload: Partial<AppState>;
};
