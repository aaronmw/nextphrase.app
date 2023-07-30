"use client";

import { AppContainer } from "@/app/client-components/AppContainer";
import { IconAnchorButton } from "@/app/client-components/Button";
import { Checkbox } from "@/app/client-components/CheckableInputs";
import { TitleBar } from "@/app/client-components/TitleBar";
import { useAppContext } from "@/app/context";
import { phrasesByListName } from "@/app/phrasesByListName";
import { ChangeEventHandler } from "react";

export default () => {
  const { dispatch, state } = useAppContext();

  const { activeListNames } = state;

  const listNames = Object.keys(phrasesByListName);

  const handleToggleList: ChangeEventHandler<HTMLInputElement> = (event) => {
    dispatch({
      type: "toggleActiveList",
      payload: {
        listName: event.target.value,
      },
    });
  };

  return (
    <AppContainer>
      <TitleBar
        contentInCenter="Settings"
        contentOnLeft={
          <IconAnchorButton
            href="/"
            icon="chevron-left"
            label="back"
            variant="toolbar"
          />
        }
        contentOnRight={
          <IconAnchorButton
            className="invisible"
            href="#"
            icon="chevron-left"
            label="back"
            variant="toolbar"
          />
        }
      />

      <div className="flex flex-col gap-3 p-6">
        {listNames.map((listName) => (
          <label
            className="flex items-center justify-between gap-6"
            key={listName}
          >
            <div>{listName}</div>

            <Checkbox
              checked={activeListNames.includes(listName)}
              value={listName}
              onChange={handleToggleList}
            />
          </label>
        ))}
      </div>
    </AppContainer>
  );
};
