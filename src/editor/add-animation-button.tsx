import React from "react";
import { spriteSheetStore } from "../store/sprite-sheet.store";
import { observer } from "mobx-react";

export const AddAnimationButton: React.FC = observer(() => {
  return (
    <div>
      <input
        disabled={!spriteSheetStore.allImagesInOne}
        type="button"
        value={"Add Animation"}
        onClick={spriteSheetStore.addNewAnimation.bind(spriteSheetStore)}
      />
    </div>
  );
});
