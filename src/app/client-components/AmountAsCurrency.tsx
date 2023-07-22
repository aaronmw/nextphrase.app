import { ComponentProps, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

interface AmountAsCurrencyProps extends ComponentProps<"var"> {
  amount: number;
  currencyCode: string;
  includeAmount?: boolean;
  includeCurrencyCode?: boolean;
  includeSymbol?: boolean;
}

const currencyPrefixPattern = /^[A-Z]+/;

const currencySymbolPattern = /[^A-Z0-9,.\s]/;

const currencyAmountPattern = /[0-9,.]+/;

const AmountAsCurrency = forwardRef<HTMLSpanElement, AmountAsCurrencyProps>(
  (
    {
      amount,
      className,
      currencyCode,
      includeAmount = true,
      includeCurrencyCode = true,
      includeSymbol = true,
      ...otherProps
    },
    ref
  ) => {
    const formatter = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
    });

    const formattedAmount = formatter.format(amount);

    const currencyPrefix =
      formattedAmount.match(currencyPrefixPattern)?.[0] ?? "";

    const currencySymbol =
      formattedAmount.match(currencySymbolPattern)?.[0] ?? "";

    const currencyAmount =
      formattedAmount.match(currencyAmountPattern)?.[0] ?? "";

    return (
      <var
        className={twMerge("inline-flex gap-1 not-italic", className)}
        ref={ref}
        {...otherProps}
      >
        {includeCurrencyCode && !!currencyPrefix && (
          <span className="text-neutral-400">{currencyPrefix}</span>
        )}
        <span className="flex">
          {includeSymbol && currencySymbol}
          {includeAmount && currencyAmount}
        </span>
      </var>
    );
  }
);

AmountAsCurrency.displayName = "AmountAsCurrency";

export { AmountAsCurrency };
