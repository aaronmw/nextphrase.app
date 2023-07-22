import { BaseRowObject, TableProps } from "@/app/client-components/Table/types";
import { ReactNode } from "react";

export interface BaseSelectableRowObject extends BaseRowObject {
  value: string | number;
}

export interface SelectableTableProps<
  IsMulti extends boolean,
  R extends BaseSelectableRowObject,
  K extends keyof R
> extends Omit<TableProps<R, K>, "defaultValue"> {
  defaultValue?: IsMulti extends true ? (string | number)[] : string | number;
  multiple?: IsMulti;
  name: string;
  renderBulkActionBar?: (selectedRows: R[]) => ReactNode;
  renderPagination?: (children: ReactNode) => ReactNode;
}

export interface SelectableTableState {
  currentPage: number;
  rows: BaseSelectableRowObject[];
  selectedRows: BaseSelectableRowObject[];
}

export type SelectableTableStateAction =
  | {
      type: "deselectAll";
    }
  | {
      type: "selectAll";
    }
  | {
      type: "setCurrentPage";
      currentPage: number;
    }
  | {
      type: "toggleRowSelection";
      row: BaseSelectableRowObject;
    }
  | {
      type: "updateRows";
      rows: BaseSelectableRowObject[];
    };
