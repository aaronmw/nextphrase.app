"use client";

import { AppOutspaceContainer } from "@/app/client-components/AppOutspaceContainer";
import { AnchorButton, Button } from "@/app/client-components/Button";
import { Input } from "@/app/client-components/Input";
import { StyledText } from "@/app/client-components/StyledText";
import { useRouter } from "next/navigation";
import { FormEventHandler } from "react";

export default () => {
  const router = useRouter();

  const handleSubmit: FormEventHandler = (event) => {
    event.preventDefault();
    router.push("/invoices-and-bills");
  };

  return (
    <AppOutspaceContainer>
      <div className="dark">
        <StyledText as="h1" variant="h1">
          Log In
        </StyledText>
      </div>

      <form
        className="
          flex
          w-64
          flex-col
          gap-3
        "
        onSubmit={handleSubmit}
      >
        <Input
          name="email"
          placeholder="Email Address"
          required={true}
          type="email"
        />

        <div className="relative">
          <Input
            name="password"
            placeholder="Password"
            required={true}
            type="password"
          />

          <AnchorButton
            className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              text-xs
            "
            href="/forgot"
            variant="link"
          >
            Forgot?
          </AnchorButton>
        </div>

        <Button className="w-full" variant="primary">
          Sign In
        </Button>
      </form>

      <StyledText as="div" className="text-center" variant="footnote">
        Not a member?{" "}
        <AnchorButton href="/signup">Create an Account</AnchorButton>
      </StyledText>
    </AppOutspaceContainer>
  );
};
