import { BulkImportAction, BulkImportState } from "./types";

export { initialState, reducer };

const initialState: BulkImportState = {
  progress: null,
};

const reducer = (state: BulkImportState, action: BulkImportAction) => {
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
