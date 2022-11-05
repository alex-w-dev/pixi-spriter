import React from "react";
import { spriteSheetStore } from "../../store/sprite-sheet.store";
import { observer } from "mobx-react";
import { exportSpriteSheet } from "../../utils/export-sprite-sheet";

export const ExportSpriteSheetButton: React.FC = observer(() => {
  return (
    <div>
      <input
        disabled={
          !spriteSheetStore.allImagesInOne || !spriteSheetStore.frames.length
        }
        type="button"
        value={"Export sprite sheet"}
        onClick={exportSpriteSheet}
      />
    </div>
  );
});
