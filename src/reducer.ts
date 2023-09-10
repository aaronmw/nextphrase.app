import xor from "lodash/xor"
import { phrasesByListName } from "phrasesByListName"
import { ListName, type AppAction, type AppState } from "types"

export { initialState, reducer }

const initialState: AppState = {
  activeListNames: Object.keys(phrasesByListName) as ListName[],
  activePhrases: Object.values(phrasesByListName).flatMap((phrases) => phrases),
  activeScreenName: "intro",
  dispatch: () => null,
  isLoading: true,
  pointsForA: 0,
  pointsForB: 0,
  pointsToWin: 7,
  roundTimeMax: 120,
  roundTimeMin: 90,
  seenPhrases: [],
  shouldRotateScreen: false,
  soundEffectsQueue: [],
}

const reducer = (state: AppState, action: AppAction): AppState => {
  console.log(
    `${action.type}:`,
    "payload" in action ? action.payload : "No payload",
  )

  switch (action.type) {
    case "addPoint": {
      const key = `pointsFor${action.payload.team}` as const

      return {
        ...state,
        [key]: state[key] + 1,
        soundEffectsQueue: ["boom", ...state.soundEffectsQueue],
      }
    }

    case "resetScores": {
      return {
        ...state,
        pointsForA: 0,
        pointsForB: 0,
      }
    }

    case "setState": {
      return {
        ...state,
        ...action.payload,
      }
    }

    case "toggleActiveList": {
      const newActiveListNames = xor(state.activeListNames, [
        action.payload.listName,
      ])

      const newActivePhrases = newActiveListNames.flatMap((activeListName) => {
        const phrasesInList = phrasesByListName[activeListName]

        return phrasesInList
      })

      return {
        ...state,
        activeListNames: newActiveListNames,
        activePhrases: newActivePhrases,
      }
    }

    default:
      return { ...state }
  }
}
