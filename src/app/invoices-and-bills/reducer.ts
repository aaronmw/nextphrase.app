import { InvoicesAction, InvoicesState } from "@/app/invoices-and-bills/types";

export { initialState, reducer };

const initialState: InvoicesState = {
  isBulkImporting: false,
  isCreatingInvoice: false,
  editingId: null,
};

const reducer = (state: InvoicesState, action: InvoicesAction) => {
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
