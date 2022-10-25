import React, { useEffect } from "react";
import styled from "styled-components";
import { IFrame, spriteSheetStore } from "../store/sprite-sheet.store";
import { observer } from "mobx-react";
import {
  draggingFrameStore,
  DraggingFrameStore,
} from "../store/dragging-frame.store";

const Container = styled.div`
  position: absolute;
  cursor: all-scroll;
  opacity: 0.5;
  border: 1px solid gray;

  .title {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .resizer {
    position: absolute;
    cursor: nwse-resize;
    width: 30px;
    height: 30px;
    right: -1px;
    bottom: -1px;
    background: url("https://developer.mozilla.org/en-US/docs/Web/CSS/cursor/4-resize.gif")
      no-repeat center;
  }
`;

function startDraggingFrame(frame: IFrame) {
  spriteSheetStore.setActiveFrame(frame);
  draggingFrameStore.setDraggingFrame(frame);
}
function startResizingFrame(frame: IFrame) {
  spriteSheetStore.setActiveFrame(frame);
  draggingFrameStore.setResizingFrame(frame);
}

export const FrameEditor: React.FC<{ frame: IFrame }> = observer(
  ({ frame }) => {
    return (
      <Container
        onMouseDown={(e) => {
          (e.target as HTMLDivElement).classList.contains("resizer")
            ? startResizingFrame(frame)
            : startDraggingFrame(frame);
        }}
        style={{
          opacity: frame === spriteSheetStore.activeFrame ? 1 : 0.5,
          left: `${frame.x}.px`,
          top: `${frame.y}.px`,
          width: `${frame.w}.px`,
          height: `${frame.h}.px`,
        }}
      >
        <div className="title">{frame.name}</div>
        <div className="resizer" />
      </Container>
    );
  }
);
