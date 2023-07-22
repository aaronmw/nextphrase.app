import {
  TableState,
  TableStateAction,
} from "@/app/client-components/Table/types";
import sortBy from "lodash/sortBy";
import { Reducer } from "react";

export const initialTableState: TableState<any, any> = {
  columns: [],
  dispatch: () => {},
  rows: [],
  sortDirection: null,
  sortedColumnKey: null,
  sortedRows: [],
};

export const tableStateReducer: Reducer<
  TableState<any, any>,
  TableStateAction<any, any>
> = (state, action) => {
  switch (action.type) {
    case "setSortedColumnKey": {
      const sortDirection =
        state.sortedColumnKey === action.sortedColumnKey
          ? state.sortDirection === "ASC"
            ? "DESC"
            : "ASC"
          : state.sortDirection;

      return {
        ...state,
        sortDirection,
        sortedColumnKey: action.sortedColumnKey,
      };
    }

    default: {
      return { ...state };
    }
  }
};
