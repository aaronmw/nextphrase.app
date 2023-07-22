import { type AppAction, type AppState } from "@/app/types";
import companies from "@/fixtures/companies";

export { initialState, reducer };

const initialState: AppState = {
  authenticatedCompany: companies[0],
  isDarkModeEnabled: false,
  isLoading: false,
};

const reducer = (state: AppState, action: AppAction) => {
  switch (action.type) {
    case "auth/signIn": {
      return {
        ...state,
        authenticatedCompany: action.payload.authenticatedCompany,
      };
    }

    case "auth/signOut": {
      return {
        ...state,
        authenticatedCompany: undefined,
      };
    }

    case "setIsLoading": {
      return {
        ...state,
        isLoading: action.payload.isLoading,
      };
    }

    case "settings/setIsDarkModeEnabled": {
      const { isDarkModeEnabled } = action.payload;

      return {
        ...state,
        isDarkModeEnabled,
      };
    }

    default:
      return { ...state };
  }
};
