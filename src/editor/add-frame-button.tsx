import React from "react";
import { spriteSheetStore } from "../store/sprite-sheet.store";

export const AddFrameButton: React.FC = () => {
  return (
    <div>
      <input
        type="button"
        value={"Add Frame"}
        onClick={spriteSheetStore.addNewFrame.bind(spriteSheetStore)}
      />
    </div>
  );
};
