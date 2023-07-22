"use client";

import { initialState } from "@/app/reducer";
import { type AppContextObject } from "@/app/types";
import { createContext, useContext } from "react";

export { AppContext, useAppContext };

const AppContext = createContext<AppContextObject>({
  dispatch: () => null,
  sounds: {},
  state: initialState,
});

const useAppContext = () => useContext(AppContext);
