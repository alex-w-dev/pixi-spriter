import React from "react";
import { spriteSheetStore } from "../../store/sprite-sheet.store";
import { observer } from "mobx-react";
import { exportSpriteSheet } from "../../utils/export-sprite-sheet";

export const CreateNewProjectButton: React.FC = observer(() => {
  return (
    <div>
      <input
        type="button"
        value={"Create new Project"}
        onClick={() => spriteSheetStore.addNewProject()}
      />
    </div>
  );
});
