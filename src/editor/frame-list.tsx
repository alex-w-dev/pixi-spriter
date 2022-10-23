import React, { ChangeEvent } from "react";
import { observer } from "mobx-react";
import { spiteSheetStore } from "../store/sprite-sheet.store";

export const FrameList: React.FC = observer(() => {
  return (
    <div className="frame-list">
      {spiteSheetStore.frames.map((frame, index) => (
        <div key={index}>{frame.name}</div>
      ))}
    </div>
  );
});
