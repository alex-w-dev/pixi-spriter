import React from "react";
import { observer } from "mobx-react";
import { spriteSheetStore } from "../store/sprite-sheet.store";
import { ListItem } from "./list-item";

export const FrameList: React.FC = observer(() => {
  return (
    <div className="frame-list">
      {spriteSheetStore.frames.map((frame, index) => (
        <ListItem
          key={index}
          active={frame === spriteSheetStore.activeFrame}
          error={
            spriteSheetStore.frames.filter((f) => f.name === frame.name)
              .length > 1
          }
          onTitleClick={() => spriteSheetStore.setActiveFrame(frame)}
          title={frame.name}
          onDeleteClick={() => {
            // eslint-disable-next-line no-restricted-globals
            if (confirm("Delete?")) {
              spriteSheetStore.removeFrame(frame);
            }
          }}
        />
      ))}
    </div>
  );
});
