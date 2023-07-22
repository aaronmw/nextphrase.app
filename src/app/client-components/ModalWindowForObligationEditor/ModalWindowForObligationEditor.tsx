import { Button } from "@/app/client-components/Button";
import { RadioGroup } from "@/app/client-components/CheckableInputs";
import { FieldLabel } from "@/app/client-components/FieldLabel";
import { Input } from "@/app/client-components/Input";
import {
  ModalWindow,
  ModalWindowProps,
} from "@/app/client-components/ModalWindow";
import { SaveButton } from "@/app/client-components/SaveButton";
import { Select } from "@/app/client-components/Select";
import { useAppContext } from "@/app/context";
import currencies from "@/fixtures/currencies";
import padStart from "lodash/padStart";
import { useState } from "react";
import { ObligationType } from "./types";

export const ModalWindowForObligationEditor = ({
  isOpen,
  onClose,
  ...otherProps
}: ModalWindowProps) => {
  const [obligationType, setObligationType] =
    useState<ObligationType>("invoice");

  const { state: appState } = useAppContext();

  const { authenticatedCompany } = appState;

  const currenciesAsOptions = currencies.map((currency) => ({
    label: currency.name,
    value: currency.id,
  }));

  const today = new Date();

  const todaysDate = [
    today.getFullYear(),
    padStart(today.getMonth().toString(), 2, "0"),
    padStart(today.getDate().toString(), 2, "0"),
  ].join("-");

  return (
    <ModalWindow
      isOpen={isOpen}
      variant="narrow"
      onClose={onClose}
      {...otherProps}
    >
      <form
        className="
          flex
          flex-col
          gap-3
          px-6
          py-3
        "
      >
        <FieldLabel label="Obligation Type" required={true}>
          <RadioGroup
            defaultValue="invoice"
            name="obligation_type"
            options={[
              { label: "Invoice", value: "invoice" },
              { label: "Bill", value: "bill" },
            ]}
            variant="vertical"
            onChange={(newValue) => {
              setObligationType(newValue as ObligationType);
            }}
          />
        </FieldLabel>

        <FieldLabel
          label={`${
            obligationType === "invoice" ? "Creditor" : "Debtor"
          }'s Email`}
          required={true}
        >
          <Input type="email" />
        </FieldLabel>

        <FieldLabel label="Amount" required={true}>
          <Input type="number" />
        </FieldLabel>

        <FieldLabel label="Currency">
          <Select
            defaultValue={currenciesAsOptions.find(
              (currencyOption) =>
                currencyOption.value ===
                authenticatedCompany?.defaultCurrencyCode
            )}
            options={currenciesAsOptions}
            renderOptionLabel={(option) => option.label}
          />
        </FieldLabel>

        <FieldLabel label="Due Date">
          <Input type="date" defaultValue={todaysDate} />
        </FieldLabel>

        <div className="flex flex-row-reverse gap-3">
          <SaveButton />

          <Button preventDefault={true} variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </ModalWindow>
  );
};
