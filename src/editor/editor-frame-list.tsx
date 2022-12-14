import React from "react";
import { observer } from "mobx-react";
import { spriteSheetStore } from "../store/sprite-sheet.store";
import { FrameEditor } from "./frame-editor";

export const EditorFrameList: React.FC = observer(() => {
  return (
    <>
      {spriteSheetStore.frames.map((frame, index) => (
        <FrameEditor frame={frame} key={index} />
      ))}
    </>
  );
});
