import { type AppAction, type AppState } from "@/app/types";

export { initialState, reducer };

const initialState: AppState = {};

const reducer = (state: AppState, action: AppAction) => {
  switch (action.type) {
    case "setState": {
      return {
        ...state,
        ...action.payload,
      };
    }

    default:
      return { ...state };
  }
};
