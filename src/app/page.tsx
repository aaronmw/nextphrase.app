"use client";

import { Button } from "@/app/client-components/Button";
import { useAppContext } from "./context";

export default () => {
  const { sounds } = useAppContext();

  return (
    <div className="flex flex-col gap-1">
      {Object.entries(sounds).map(([soundName, controls]) => (
        <Button
          iconLeft={controls.isPlaying ? "pause" : "play"}
          variant="primary"
          onClick={controls.play}
        >
          {soundName}
        </Button>
      ))}
    </div>
  );
};
