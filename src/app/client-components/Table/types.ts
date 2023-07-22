import { ComponentProps, Dispatch, ReactNode } from "react";

export interface TableState<R extends BaseRowObject, K extends keyof R> {
  columns: ColumnObject<R, K>[];
  dispatch: Dispatch<TableStateAction<R, K>>;
  rows: R[];
  sortedColumnKey: K | null;
  sortedRows: R[];
  sortDirection: SortDirection | null;
}

export type TableStateAction<R extends BaseRowObject, K extends keyof R> = {
  type: "setSortedColumnKey";
  sortedColumnKey: K;
};

export interface BaseRowObject extends Record<string, any> {
  propsForRow?: ComponentProps<"tr">;
}

export interface ColumnObject<R extends BaseRowObject, K extends keyof R> {
  customSortFunction?: (rowObject: R) => string | number;
  initialSortDirection?: SortDirection;
  isSortable?: boolean;
  key: K;
  label: ReactNode;
  propsForCells?: ComponentProps<"td">;
  propsForHeaderCell?: ComponentProps<"th">;
}

export interface TableProps<R extends BaseRowObject, K extends keyof R>
  extends Omit<ComponentProps<"table">, "children"> {
  columns: ColumnObject<R, K>[];
  initialSortedColumnKey?: K;
  renderCells?: Record<K, CellRenderFunction<R, K>>;
  renderHeaderCells?: Record<K, HeaderCellRenderFunction<R, K>>;
  renderHeaderRow?: HeaderRowRenderFunction<R, K>;
  renderRow?: RowRenderFunction<R, K>;
  rows: R[];
}

export interface CellRenderFunction<
  R extends BaseRowObject,
  K extends keyof R
> {
  (renderProps: {}): JSX.Element;
}

export interface HeaderCellRenderFunction<
  R extends BaseRowObject,
  K extends keyof R
> {
  (renderProps: {}): JSX.Element;
}

export interface HeaderRowRenderFunction<
  R extends BaseRowObject,
  K extends keyof R
> {
  (renderProps: {}): JSX.Element;
}

export interface RowRenderFunction<R extends BaseRowObject, K extends keyof R> {
  (renderProps: {
    children: ReactNode;
    row: R;
    rowProps: ComponentProps<"tr">;
  }): JSX.Element;
}

export type SortDirection = "ASC" | "DESC";
