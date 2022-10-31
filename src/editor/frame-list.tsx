import React from "react";
import { observer } from "mobx-react";
import { spriteSheetStore } from "../store/sprite-sheet.store";
import { ListItem } from "./list-item";

export const FrameList: React.FC = observer(() => {
  return (
    <div className="frame-list">
      {spriteSheetStore.sortedFrames.map((frame, index) => (
        <ListItem
          key={index}
          active={frame.active}
          error={frame.error}
          selected={frame.inAnimation}
          onTitleClick={() =>
            spriteSheetStore.setActiveFrame(
              spriteSheetStore.getFrameByName(frame.name)
            )
          }
          title={frame.name}
          onDeleteClick={() => {
            // eslint-disable-next-line no-restricted-globals
            if (confirm("Delete?")) {
              const f = spriteSheetStore.getFrameByName(frame.name);
              f && spriteSheetStore.removeFrame(f);
            }
          }}
        />
      ))}
    </div>
  );
});
