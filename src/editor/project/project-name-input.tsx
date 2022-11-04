import React from "react";
import { observer } from "mobx-react";
import { spriteSheetStore } from "../../store/sprite-sheet.store";

export const ProjectNameInput: React.FC = observer(() => {
  return (
    <input
      type="text"
      placeholder={"Project Name"}
      value={spriteSheetStore.currentProject.name}
      onChange={(e) => {
        spriteSheetStore.changeCurrentProjectName(e.target.value);
      }}
    />
  );
});
