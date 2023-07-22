import { type Dispatch } from "react";

export interface AppContextObject {
  dispatch: Dispatch<AppAction>;
  state: AppState;
}

export interface AppState {
  authenticatedCompany?: Company;
  isDarkModeEnabled: boolean;
  isLoading: boolean;
}

export type AppAction =
  | {
      type: "auth/signIn";
      payload: { authenticatedCompany: Company };
    }
  | {
      type: "auth/signOut";
    }
  | {
      type: "setIsLoading";
      payload: { isLoading: boolean };
    }
  | {
      type: "settings/setIsDarkModeEnabled";
      payload: { isDarkModeEnabled: boolean };
    };

export interface Company {
  country: string;
  dateCreated: Date;
  defaultCurrencyCode: string;
  email: string;
  emailVerified: boolean;
  id: string;
  name: string;
}

export interface Invoice {
  amount: number;
  companyIdOfCreditor: string;
  companyIdOfDebtor: string;
  currencyCode: string;
  dateDue: Date;
  id: string;
  isAscertained: boolean;
}
