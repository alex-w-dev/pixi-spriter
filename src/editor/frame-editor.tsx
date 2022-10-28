import React from "react";
import styled from "styled-components";
import { IFrame, spriteSheetStore } from "../store/sprite-sheet.store";
import { observer } from "mobx-react";
import {
  draggingFrameStore,
  ResizeDirection,
} from "../store/dragging-frame.store";

const Container = styled.div`
  position: absolute;
  cursor: all-scroll;
  opacity: 0.5;
  border: 1px solid gray;

  &.active {
    opacity: 1;

    .resizer {
      display: block;
    }

    .title {
      top: -20px;
    }
  }

  .title {
    white-space: nowrap;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .resizer {
    display: none;
    position: absolute;
    width: 12px;
    height: 12px;
    background: #338cf8;
    border: 1px solid #186dd6;
    border-radius: 50%;

    &:after {
      content: "";
      width: 200%;
      height: 200%;
      position: absolute;
      left: -30%;
      top: -30%;
    }

    &.rb {
      cursor: nwse-resize;
      right: -14px;
      bottom: -14px;
    }
    &.lt {
      cursor: nwse-resize;
      left: -14px;
      top: -14px;
    }
    &.rt {
      cursor: nesw-resize;
      right: -14px;
      top: -14px;
    }
    &.lb {
      cursor: nesw-resize;
      left: -14px;
      bottom: -14px;
    }
    &.l {
      cursor: ew-resize;
      left: -14px;
      top: calc(50% - 6px);
    }
    &.r {
      cursor: ew-resize;
      right: -14px;
      top: calc(50% - 6px);
    }
    &.b {
      cursor: ns-resize;
      bottom: -14px;
      left: calc(50% - 6px);
    }
    &.t {
      cursor: ns-resize;
      top: -14px;
      left: calc(50% - 6px);
    }
  }
`;

function startDraggingFrame(frame: IFrame) {
  spriteSheetStore.setActiveFrame(frame);
  draggingFrameStore.setDraggingFrame(frame);
}
function startResizingFrame(frame: IFrame, resizeDirection: ResizeDirection) {
  spriteSheetStore.setActiveFrame(frame);
  draggingFrameStore.setResizingFrame(frame, resizeDirection);
}

export const FrameEditor: React.FC<{ frame: IFrame }> = observer(
  ({ frame }) => {
    return (
      <Container
        onMouseDown={(e) => {
          const classList = (e.target as HTMLDivElement).classList;

          if (classList.contains("resizer")) {
            console.log(Array.from(classList), "Array.from(classList)");
            startResizingFrame(
              frame,
              Array.from(classList)[classList.length - 1] as ResizeDirection
            );
          } else {
            startDraggingFrame(frame);
          }
        }}
        className={frame === spriteSheetStore.activeFrame ? "active" : ""}
        style={{
          left: `${frame.x}.px`,
          top: `${frame.y}.px`,
          width: `${frame.w}.px`,
          height: `${frame.h}.px`,
        }}
      >
        <div className="title">{frame.name}</div>
        <div className="resizer lt" />
        <div className="resizer rb" />
        <div className="resizer lb" />
        <div className="resizer rt" />
        <div className="resizer l" />
        <div className="resizer r" />
        <div className="resizer t" />
        <div className="resizer b" />
      </Container>
    );
  }
);
