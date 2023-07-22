import { Icon } from "@/app/client-components/Icon";
import {
  initialTableState,
  tableStateReducer,
} from "@/app/client-components/Table/reducer";
import { BaseRowObject, TableProps } from "@/app/client-components/Table/types";
import sortBy from "lodash/sortBy";
import { MouseEvent, useEffect, useReducer } from "react";
import { twMerge } from "tailwind-merge";

export { Table };

const Table = <R extends BaseRowObject, K extends keyof R>({
  className,
  columns,
  initialSortedColumnKey,
  renderRow,
  rows,
  ...otherProps
}: TableProps<R, K>) => {
  const [tableState, tableDispatch] = useReducer(
    tableStateReducer,
    initialTableState
  );

  useEffect(() => {
    if (!initialSortedColumnKey) {
      return;
    }

    tableDispatch({
      type: "setSortedColumnKey",
      sortedColumnKey: initialSortedColumnKey,
    });
  }, [initialSortedColumnKey]);

  const handleClickToSort = (
    columnKey: K,
    event: MouseEvent<HTMLTableCellElement>
  ) => {
    event.preventDefault();

    tableDispatch({
      type: "setSortedColumnKey",
      sortedColumnKey: columnKey,
    });
  };

  const { sortDirection, sortedColumnKey } = tableState;

  const sortFunction =
    columns.find((column) => column.key === sortedColumnKey)
      ?.customSortFunction ?? ((row) => row![sortedColumnKey]);

  const sortedRows = sortBy(rows, sortFunction);

  if (sortDirection === "DESC") {
    sortedRows.reverse();
  }

  return (
    <div
      className={twMerge(
        `
          overflow-hidden
          rounded-md
          border
          border-borderColor
          dark:border-borderColorInDarkMode
        `,
        className
      )}
      {...otherProps}
    >
      <table
        className="
          group/table
          relative
          box-border
          w-full
          border-collapse
        "
      >
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                className={twMerge(
                  `
                    group/table-cell
                    border-b-border
                    border-b
                    px-6
                    py-1
                    text-left
                    text-xs
                    font-normal
                    text-neutral-400
                    dark:border-b-borderColorInDarkMode
                    xl:py-2
                  `,
                  column.isSortable && "cursor-pointer",
                  column.propsForCells?.className,
                  column.propsForHeaderCell?.className
                )}
                key={String(column.key)}
                onClick={
                  column.isSortable
                    ? handleClickToSort.bind(null, column.key)
                    : undefined
                }
              >
                <div
                  className={twMerge(
                    `
                      flex
                      items-center
                      gap-0
                    `,
                    column.propsForCells?.className?.includes("text-right") &&
                      "flex-row-reverse"
                  )}
                >
                  {column.label || <>&nbsp;</>}
                  {column.isSortable && (
                    <Icon
                      className={twMerge(
                        column.key === sortedColumnKey
                          ? "!opacity-100"
                          : "opacity-0",
                        sortDirection === "ASC" ? "rotate-0" : "rotate-180",
                        `
                          transition-all
                          group-hover/table-cell:opacity-50
                        `
                      )}
                      name="caret-up"
                      variant="solid"
                    />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {sortedRows.map((row, rowIndex) => {
            const rowProps = {
              ...(row.propsForRow ?? {}),
              className: twMerge(
                `
                  group/table-row
                  hover:bg-shadedColor
                  dark:hover:bg-shadedColorInDarkMode
                `,
                sortedRows.length >= 3 &&
                  `
                    odd:bg-shadedColor/70
                    dark:odd:bg-shadedColorInDarkMode/70
                  `,
                row.propsForRow?.className
              ),
            };

            const children = columns.map((column) => (
              <td
                {...(column.propsForCells ?? {})}
                className={twMerge(
                  `
                    group/table-cell
                    px-6
                    py-1
                    xl:py-2
                    2xl:py-3
                  `,
                  column.propsForCells?.className
                )}
                key={String(column.key)}
              >
                {row[column.key]}
              </td>
            ));

            return renderRow ? (
              renderRow({ children, row, rowProps })
            ) : (
              <tr key={rowIndex} {...rowProps}>
                {children}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
