import React from "react";
import { spriteSheetStore } from "../store/sprite-sheet.store";
import { observer } from "mobx-react";

export const AddFrameButton: React.FC = observer(() => {
  return (
    <div>
      <input
        disabled={!spriteSheetStore.allImagesInOne}
        type="button"
        value={"Add Frame"}
        onClick={spriteSheetStore.addNewFrame.bind(spriteSheetStore, undefined)}
      />
    </div>
  );
});
