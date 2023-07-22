export interface BulkImportState {
  progress: null | number;
}

export type BulkImportAction = {
  type: "setState";
  payload: Partial<BulkImportState>;
};
