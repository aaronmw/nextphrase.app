"use client";

import { AmountAsCurrency } from "@/app/client-components/AmountAsCurrency";
import { AppContainer } from "@/app/client-components/AppContainer";
import { Button } from "@/app/client-components/Button";
import { Container } from "@/app/client-components/Container";
import { EmptyContainer } from "@/app/client-components/EmptyContainer";
import { Icon } from "@/app/client-components/Icon";
import { ModalWindowForBulkImport } from "@/app/client-components/ModalWindowForBulkImport";
import { ModalWindowForObligationEditor } from "@/app/client-components/ModalWindowForObligationEditor";
import { PageHeader } from "@/app/client-components/PageHeader";
import { SelectableTable } from "@/app/client-components/SelectableTable";
import { StyledText } from "@/app/client-components/StyledText";
import { initialState, reducer } from "@/app/invoices-and-bills/reducer";
import companies from "@/fixtures/companies";
import invoices from "@/fixtures/invoices";
import { MouseEventHandler, useReducer } from "react";

export default function InvoicesPage() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { isBulkImporting, isCreatingInvoice, editingId } = state;

  const companiesById = Object.fromEntries(
    companies.map((company) => [company.id, company])
  );

  const handleClickBulkImport: MouseEventHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();

    dispatch({
      type: "setState",
      payload: {
        isBulkImporting: true,
      },
    });
  };

  const handleClickCreateNew: MouseEventHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();

    dispatch({
      type: "setState",
      payload: {
        isCreatingInvoice: true,
      },
    });
  };

  const handleCloseBulkImportModal = () => {
    dispatch({
      type: "setState",
      payload: {
        isBulkImporting: false,
      },
    });
  };

  const handleCloseCreationModal = () => {
    dispatch({
      type: "setState",
      payload: {
        isCreatingInvoice: false,
      },
    });
  };

  return (
    <AppContainer>
      <PageHeader
        actions={
          <div className="space-x-3">
            <Button
              iconLeft="cloud-arrow-up"
              variant="secondary"
              onClick={handleClickBulkImport}
            >
              Import from CSV
            </Button>

            <Button
              iconLeft="plus"
              variant="primary"
              onClick={handleClickCreateNew}
            >
              Create New
            </Button>
          </div>
        }
        title="Invoices & Bills"
      />

      <Container
        className="
          md:grid
          md:auto-rows-min
          md:grid-cols-2
          md:gap-6
        "
      >
        <form className="space-y-6">
          <StyledText
            as="h3"
            className="flex items-baseline gap-2"
            variant="h3"
          >
            <Icon className="opacity-50" name="file-invoice-dollar" />
            Invoices
          </StyledText>

          <SelectableTable
            columns={[
              {
                key: "debtor",
                label: "Debtor",
              },
              {
                customSortFunction: (rowObject) => rowObject!.invoice.amount,
                isSortable: true,
                key: "amount",
                label: "Amount",
                propsForCells: {
                  className: "text-right",
                },
              },
            ]}
            name="selected_invoice"
            rows={invoices.map((invoice) => ({
              amount: (
                <AmountAsCurrency
                  amount={invoice.amount}
                  currencyCode={invoice.currencyCode}
                />
              ),
              debtor: companiesById[invoice.companyIdOfDebtor].name,
              invoice,
              value: invoice.id,
            }))}
          />
        </form>

        <form className="flex h-full flex-col gap-6">
          <StyledText
            as="h3"
            className="flex items-baseline gap-2"
            variant="h3"
          >
            <Icon className="opacity-50" name="building-columns" />
            Bills
          </StyledText>

          <EmptyContainer className="flex flex-col gap-1">
            <div>No Bills (Yay!)</div>
            <Button variant="link">Add a Bill</Button>
          </EmptyContainer>
        </form>
      </Container>

      <ModalWindowForObligationEditor
        title="New Invoice"
        isOpen={isCreatingInvoice}
        onClose={handleCloseCreationModal}
      />

      <ModalWindowForBulkImport
        isOpen={isBulkImporting}
        onClose={handleCloseBulkImportModal}
      />
    </AppContainer>
  );
}
