import { phrasesByListName } from "@/app/phrasesByListName";
import { type AppAction, type AppState } from "@/app/types";
import xor from "lodash/xor";

export { initialState, reducer };

const initialState: AppState = {
  activeListNames: Object.keys(phrasesByListName),
  activePhrases: Object.entries(phrasesByListName).flatMap(
    ([listName, phrases]) => phrases
  ),
  aliasForA: "A",
  aliasForB: "B",
  pointsForA: 0,
  pointsForB: 0,
  rotateScreen: false,
  seenPhrases: [],
};

const reducer = (state: AppState, action: AppAction) => {
  console.log(`${action.type}:`, action.payload);

  switch (action.type) {
    case "setState": {
      return {
        ...state,
        ...action.payload,
      };
    }

    case "toggleActiveList": {
      console.log({
        activeListNames: state.activeListNames,
        payload: action.payload,
        result: xor(state.activeListNames, [action.payload.listName]),
      });

      return {
        ...state,
        activeListNames: xor(state.activeListNames, [action.payload.listName]),
      };
    }

    default:
      return { ...state };
  }
};
