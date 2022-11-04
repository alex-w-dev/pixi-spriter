import React from "react";
import { observer } from "mobx-react";
import { spriteSheetStore } from "../../store/sprite-sheet.store";

export const ProjectsSelect: React.FC = observer(() => {
  return (
    <select
      value={spriteSheetStore.currentProject.id}
      onChange={(e) => {
        spriteSheetStore.selectProject(+e.target.value);
      }}
    >
      {spriteSheetStore.projects.map((project) => {
        return (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        );
      })}
    </select>
  );
});
