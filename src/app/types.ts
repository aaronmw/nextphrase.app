import { sounds } from "@/app/layout"
import { phrasesByListName } from "@/app/phrasesByListName"
import { type Dispatch } from "react"

export interface AppContextObject {
  dispatch: Dispatch<AppAction>
  sounds: Record<SoundName, HTMLAudioElement>
  state: AppState
}

export interface AppState {
  activeListNames: ListName[]
  activePhrases: string[]
  dispatch: Dispatch<AppAction>
  isLoading: boolean
  pointsForA: number
  pointsForB: number
  pointsToWin: number
  roundTimeMax: number
  roundTimeMin: number
  seenPhrases: string[]
  shouldRotateScreen: boolean
  soundEffectsQueue: SoundName[]
}

export type AppAction =
  | {
      type: "addPoint"
      payload: { team: TeamName }
    }
  | {
      type: "resetScores"
    }
  | {
      type: "setState"
      payload: Partial<AppState>
    }
  | {
      type: "toggleActiveList"
      payload: {
        listName: ListName
      }
    }

export type ListName = keyof typeof phrasesByListName

export type SoundName = keyof typeof sounds

export type TeamName = "A" | "B"
