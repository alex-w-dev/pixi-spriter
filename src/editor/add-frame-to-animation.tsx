import React, { useState } from "react";
import { IAnimation, spriteSheetStore } from "../store/sprite-sheet.store";
import { observer } from "mobx-react";

export const AddFrameToAnimation: React.FC<{ animation: IAnimation }> =
  observer(({ animation }) => {
    const [selectedFrame, selectFrame] = useState<string>("");

    return (
      <div>
        <select
          onChange={(e) => selectFrame(e.target.value)}
          value={selectedFrame}
        >
          <option>None</option>
          {spriteSheetStore.frames.map((frame) => {
            return (
              <option key={frame.name} value={frame.name}>
                {frame.name}
              </option>
            );
          })}
        </select>
        <input
          disabled={!selectedFrame}
          type="button"
          value={"Add Frame"}
          onClick={() => {
            spriteSheetStore.updateAndSave(() => {
              animation.frames.push(selectedFrame);
            });
          }}
        />
      </div>
    );
  });
