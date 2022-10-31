import React from "react";
import { observer } from "mobx-react";
import { spriteSheetStore } from "../store/sprite-sheet.store";
import { ListItem } from "./list-item";
import { onFrameKeydown } from "../utils/on-frame-keydown";

export const FrameList: React.FC = observer(() => {
  return (
    <div className="frame-list">
      {spriteSheetStore.sortedFrames.map((frameData, index) => (
        <ListItem
          key={index}
          active={frameData.active}
          error={frameData.error}
          selected={frameData.inAnimation}
          onTitleClick={() => spriteSheetStore.setActiveFrame(frameData.frame)}
          onKeyDown={onFrameKeydown}
          title={frameData.frame.name}
          onDeleteClick={() => {
            // eslint-disable-next-line no-restricted-globals
            if (confirm("Delete?")) {
              spriteSheetStore.removeFrame(frameData.frame);
            }
          }}
        />
      ))}
    </div>
  );
});
