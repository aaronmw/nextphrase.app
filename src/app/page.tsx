"use client";

import { AppContainer } from "@/app/client-components/AppContainer";
import { AnchorButton, IconAnchorButton } from "@/app/client-components/Button";
import { Logo } from "@/app/client-components/Logo";
import { TitleBar } from "@/app/client-components/TitleBar";
import { useAppContext } from "./context";

export default () => {
  const { sounds } = useAppContext();

  return (
    <AppContainer className="gap-1">
      <TitleBar
        contentInCenter={
          <IconAnchorButton
            href="/settings"
            icon="gear"
            label="Settings"
            variant="toolbar"
          />
        }
      />

      <div
        className="
          relative
          flex
          flex-grow
          items-center
          justify-center
        "
      >
        <div className="relative aspect-square w-[70vw]">
          <Logo />
        </div>
      </div>
    </AppContainer>
  );
};
