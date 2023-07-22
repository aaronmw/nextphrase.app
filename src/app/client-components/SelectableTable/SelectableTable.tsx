import { Checkbox } from "@/app/client-components/CheckableInputs";
import { PaginationMenu } from "@/app/client-components/PaginationMenu";
import {
  initialSelectableTableState,
  selectableTableStateReducer,
} from "@/app/client-components/SelectableTable/reducer";
import {
  BaseSelectableRowObject,
  SelectableTableProps,
} from "@/app/client-components/SelectableTable/types";
import { Table } from "@/app/client-components/Table";
import { ColumnObject } from "@/app/client-components/Table/types";
import {
  ChangeEventHandler,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { twMerge } from "tailwind-merge";

export { SelectableTable };

const PER_PAGE = 20;

const SelectableTable = <
  IsMulti extends boolean,
  R extends BaseSelectableRowObject,
  K extends keyof R
>({
  columns,
  defaultValue,
  multiple,
  name,
  renderBulkActionBar,
  renderPagination,
  rows,
  ...otherProps
}: SelectableTableProps<IsMulti, R, K>) => {
  const masterSelectorInputElementRef = useRef<HTMLInputElement>(null);

  const [selectableTableState, selectableTableDispatch] = useReducer(
    selectableTableStateReducer,
    defaultValue,
    (defaultValue) => {
      const selectedRows = rows.filter((row) => {
        return multiple === false
          ? row.value === (defaultValue as string | number)
          : (defaultValue as (string | number)[])?.includes(row.value);
      });

      return {
        ...initialSelectableTableState,
        rows,
        selectedRows,
      };
    }
  );

  const { currentPage, selectedRows } = selectableTableState;

  const selectedRowValues = selectedRows.map((row) => row.value);

  useEffect(() => {
    selectableTableDispatch({
      type: "updateRows",
      rows,
    });
  }, [rows]);

  useEffect(() => {
    const masterSelectorInputElement = masterSelectorInputElementRef.current;

    if (!masterSelectorInputElement) {
      return;
    }

    masterSelectorInputElement.indeterminate =
      selectedRows.length >= 1 && selectedRows.length < rows.length;
  }, [selectedRows, rows]);

  const handleChangeMasterSelectorInput: ChangeEventHandler<
    HTMLInputElement
  > = () => {
    const hasSelectedNothing = selectedRows.length === 0;

    const hasSelectedEverything = selectedRows.length === rows.length;

    const hasSelectedSome = selectedRows.length >= 1 && !hasSelectedEverything;

    if (hasSelectedNothing || hasSelectedSome) {
      selectableTableDispatch({
        type: "selectAll",
      });
    } else {
      selectableTableDispatch({
        type: "deselectAll",
      });
    }
  };

  const columnsWithSelectorInput: ColumnObject<R, K>[] = useMemo(
    () => [
      {
        key: "selectorInput" as K,
        label: (
          <Checkbox
            checked={selectedRows.length >= 1}
            name={name}
            ref={masterSelectorInputElementRef}
            type="checkbox"
            value="all"
            onChange={handleChangeMasterSelectorInput}
          />
        ),
        propsForCells: {
          className: "w-0 pr-0",
        },
      },
      ...columns.map((column) => ({
        ...column,
        propsForCells: {
          ...column.propsForCells,
          className: column.propsForCells?.className,
        },
      })),
    ],
    [columns, selectedRows]
  );

  const rowsWithSelectorInputs: R[] = useMemo(() => {
    const handleClickRow = (row: R) => {
      selectableTableDispatch({
        type: "toggleRowSelection",
        row,
      });
    };

    return rows.map((row) => ({
      ...row,
      propsForRow: {
        className: twMerge(
          selectedRowValues.includes(row.value) && "is-selected",
          `
            cursor-pointer
            [&.is-selected]:!bg-accentColor
            [&.is-selected]:!text-white
            [&.is-selected]:transition
          `
        ),
        onClick: handleClickRow.bind(null, row),
      },
      selectorInput: (
        <div
          className="
            flex
            h-full
            items-center
            justify-center
          "
        >
          <Checkbox
            checked={selectedRowValues.includes(row.value)}
            name={name}
            type="checkbox"
            value={row.value}
            onChange={() => handleClickRow.bind(null, row)}
          />
        </div>
      ),
    }));
  }, [rows, selectedRowValues]);

  const numPages = Math.ceil(rows.length / PER_PAGE);

  const startingIndex = (currentPage - 1) * PER_PAGE;

  const rowsForCurrentPage = rowsWithSelectorInputs.slice(
    startingIndex,
    startingIndex + PER_PAGE
  );

  return (
    <>
      {renderBulkActionBar?.(selectedRows as R[])}

      <Table
        columns={columnsWithSelectorInput}
        rows={rowsForCurrentPage}
        {...otherProps}
      />

      {renderPagination?.(
        <PaginationMenu
          currentPage={currentPage}
          numPages={numPages}
          onClick={(pageNumber) => {
            selectableTableDispatch({
              type: "setCurrentPage",
              currentPage: pageNumber,
            });
          }}
        />
      )}
    </>
  );
};
