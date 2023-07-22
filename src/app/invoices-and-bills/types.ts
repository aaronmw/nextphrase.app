export interface InvoicesState {
  editingId: string | null;
  isBulkImporting: boolean;
  isCreatingInvoice: boolean;
}

export type InvoicesAction = {
  type: "setState";
  payload: Partial<InvoicesState>;
};
