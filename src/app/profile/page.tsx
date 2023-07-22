"use client";

import { AppContainer } from "@/app/client-components/AppContainer";
import { Button } from "@/app/client-components/Button";
import { Container } from "@/app/client-components/Container";
import { FieldLabel } from "@/app/client-components/FieldLabel";
import { Input } from "@/app/client-components/Input";
import { PageHeader } from "@/app/client-components/PageHeader";
import { SaveButton } from "@/app/client-components/SaveButton";
import { Select } from "@/app/client-components/Select";
import { useAppContext } from "@/app/context";
import currencies from "@/fixtures/currencies";
import { FormEventHandler, MouseEventHandler, useState } from "react";

export default function ProfilePage() {
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const { state: appState } = useAppContext();

  const { authenticatedCompany } = appState;

  const handleClickChangePassword: MouseEventHandler = (event) => {
    event.preventDefault();
    setIsChangingPassword(true);
  };

  const handleClickCancelChangePassword: MouseEventHandler = (event) => {
    event.preventDefault();
    setIsChangingPassword(false);
  };

  const handleSubmit: FormEventHandler = (event) => {
    event.preventDefault();
  };

  const currenciesAsOptions = currencies.map((currency) => ({
    label: currency.name,
    value: currency.id,
  }));

  return (
    <AppContainer>
      <PageHeader actions={<SaveButton variant="primary" />} title="Profile" />

      <Container variant="narrow">
        <form
          className="
            flex
            flex-col
            gap-6
          "
          onSubmit={handleSubmit}
        >
          <FieldLabel label="Email" required={true}>
            <Input type="email" value={authenticatedCompany!.email} />
          </FieldLabel>

          <FieldLabel label="Display Name" required={true}>
            <Input
              name="label"
              type="text"
              value={authenticatedCompany!.name}
            />
          </FieldLabel>

          <FieldLabel label="Default Currency" required={true}>
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

          <FieldLabel label="Password">
            {!isChangingPassword && (
              <Button variant="link" onClick={handleClickChangePassword}>
                Change Password
              </Button>
            )}
            {isChangingPassword && (
              <Button variant="link" onClick={handleClickCancelChangePassword}>
                Cancel and Keep Current Password
              </Button>
            )}
          </FieldLabel>

          {isChangingPassword && (
            <>
              <FieldLabel label="Current Password">
                <Input name="current_password" type="password" />
              </FieldLabel>

              <FieldLabel label="New Password">
                <Input name="new_password" type="password" />
              </FieldLabel>

              <FieldLabel label="Re-Type New Password">
                <Input name="new_password_repeated" type="password" />
              </FieldLabel>
            </>
          )}
        </form>
      </Container>
    </AppContainer>
  );
}
