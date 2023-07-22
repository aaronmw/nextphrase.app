import { Button } from "@/app/client-components/Button";
import isNumber from "lodash/isNumber";
import range from "lodash/range";
import uniq from "lodash/uniq";
import { ComponentPropsWithoutRef, MouseEvent } from "react";
import { twMerge } from "tailwind-merge";

interface PaginationMenuProps
  extends Omit<ComponentPropsWithoutRef<"nav">, "children" | "onClick"> {
  currentPage: number;
  numPages: number;
  onClick: (pageNumber: number, event: MouseEvent) => void;
}

const pageButtonClasses = twMerge(`
  text-brandColor
  [&.is-active]:border-brandColor
  block
  rounded-md
  border-2
  border-transparent
  px-3
  py-1
  hover:bg-neutral-100
  [&.is-active]:font-bold
`);

const PaginationMenu = ({
  className,
  currentPage,
  numPages,
  onClick,
  ...otherProps
}: PaginationMenuProps) => {
  const pageNumbers = range(1, numPages + 1);

  const fiveVisiblePages = pageNumbers.slice(
    Math.max(0, currentPage - 3),
    Math.min(numPages, currentPage + 2)
  );

  const firstPage = pageNumbers.slice(0, 1);

  const lastPage = pageNumbers.slice(-1);

  const finalVisiblePageNumbers = uniq(
    firstPage.concat(fiveVisiblePages, lastPage)
  ).flatMap((pageNumber, index, pageNumbers) => {
    const prevPageNumber = pageNumbers[index - 1];

    if (prevPageNumber && prevPageNumber !== pageNumber - 1) {
      return ["...", pageNumber];
    }

    return pageNumber;
  });

  const handleClickPageNumber = (pageNumber: number, event: MouseEvent) => {
    event.preventDefault();

    onClick(pageNumber, event);
  };

  return (
    <div
      className={twMerge(
        `
          flex
          items-center
          justify-center
          gap-0.5
          py-2
          text-sm
        `,
        className
      )}
      {...otherProps}
    >
      <Button
        className={pageButtonClasses}
        disabled={currentPage === 1}
        icon="chevron-left"
        variant="unstyled"
        onClick={handleClickPageNumber.bind(null, currentPage - 1)}
      >
        Previous
      </Button>

      {finalVisiblePageNumbers.map((pageNumber) =>
        isNumber(pageNumber) ? (
          <Button
            className={twMerge(
              pageButtonClasses,
              pageNumber === currentPage && "is-active",
              pageNumber >= 1000 ? "px-1" : pageNumber >= 100 ? "px-2" : ""
            )}
            key={pageNumber}
            variant="unstyled"
            onClick={handleClickPageNumber.bind(null, pageNumber)}
          >
            {pageNumber}
          </Button>
        ) : (
          <span className="text-neutral-400" key={pageNumber}>
            {pageNumber}
          </span>
        )
      )}

      <Button
        className={pageButtonClasses}
        disabled={currentPage === numPages}
        iconRight="chevron-right"
        variant="unstyled"
        onClick={handleClickPageNumber.bind(null, currentPage + 1)}
      >
        Next
      </Button>
    </div>
  );
};

PaginationMenu.displayName = "PaginationMenu";

export { PaginationMenu };
