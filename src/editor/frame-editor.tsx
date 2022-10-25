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
    cursor: ew-resize;
    width: 30px;
    height: 30px;
    right: 0;
    bottom: 0;
  }
`;

function onMouseDown(frame: IFrame) {
  spriteSheetStore.setActiveFrame(frame);
  draggingFrameStore.setDraggingFrame(frame);
}

export const FrameEditor: React.FC<{ frame: IFrame }> = observer(
  ({ frame }) => {
    return (
      <Container
        onMouseDown={onMouseDown.bind(null, frame)}
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
