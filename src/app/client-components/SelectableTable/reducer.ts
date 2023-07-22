import {
  SelectableTableState,
  SelectableTableStateAction,
} from "@/app/client-components/SelectableTable/types";
import { Reducer } from "react";

export const initialSelectableTableState: SelectableTableState = {
  currentPage: 1,
  rows: [],
  selectedRows: [],
};

export const selectableTableStateReducer: Reducer<
  SelectableTableState,
  SelectableTableStateAction
> = (state, action) => {
  switch (action.type) {
    case "deselectAll": {
      return {
        ...state,
        selectedRows: [],
      };
    }

    case "selectAll": {
      return {
        ...state,
        selectedRows: [...state.rows],
      };
    }

    case "setCurrentPage": {
      return {
        ...state,
        currentPage: action.currentPage,
      };
    }

    case "toggleRowSelection": {
      const selectedRowValues = state.selectedRows.map((row) => row.value);

      const newSelectedRows = selectedRowValues.includes(action.row.value)
        ? state.selectedRows.filter(
            (selectedRow) => selectedRow.value !== action.row.value
          )
        : [...state.selectedRows, action.row];

      return {
        ...state,
        selectedRows: newSelectedRows,
      };
    }

    case "updateRows": {
      return {
        ...state,
        rows: action.rows,
        selectedRows: state.selectedRows.filter((selectedRow) =>
          action.rows.find((row) => row.value === selectedRow.value)
        ),
      };
    }

    default: {
      return { ...state };
    }
  }
};
