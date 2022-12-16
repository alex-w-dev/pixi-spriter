import React from "react";
import styled from "styled-components";
import { IFrame, spriteSheetStore } from "../store/sprite-sheet.store";
import { observer } from "mobx-react";
import {
  draggingFrameStore,
  ResizeDirection,
} from "../store/dragging-frame.store";
import { onFrameKeydown } from "../utils/on-frame-keydown";

export const EditorContainer = styled.div`
  position: absolute;
  cursor: all-scroll;
  opacity: 0.5;
  outline: none;
  // border: 1px solid gray;

  &:before {
    content: "";
    top: -1px;
    left: -1px;
    position: absolute;
    z-index: -1;
    width: calc(100%);
    height: calc(100%);
    border: 1px dashed #000;
  }

  &.active {
    opacity: 1;
    z-index: 10;

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

  .anchor {
    position: absolute;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: -9px;
    width: 17px;
    height: 17px;
    font-size: 12px;
    line-height: 17px;
    background: rgba(255, 255, 255, 0.4);
    border: 0.5px solid black;
    font-weight: 100;

    :before,
    :after {
      display: block;
      content: "";
      position: absolute;
      left: 8px;
      top: 8px;
      width: 1px;
      margin-top: -40px;
      height: 80px;
      background-color: rgba(0, 0, 0, 0.5);
    }
    :after {
      height: 1px;
      margin-top: 0;
      margin-left: -40px;
      width: 80px;
    }
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
function startAnchoringFrame(frame: IFrame) {
  spriteSheetStore.setActiveFrame(frame);
  draggingFrameStore.setAnchoringFrame(frame);
}

export const FrameEditor: React.FC<{ frame: IFrame }> = observer(
  ({ frame }) => {
    console.log(frame, "frame");
    return (
      <EditorContainer
        tabIndex={1}
        onKeyDown={onFrameKeydown}
        onMouseDown={(e) => {
          const classList = (e.target as HTMLDivElement).classList;

          console.log(111, "111");
          if (classList.contains("resizer")) {
            console.log(Array.from(classList), "Array.from(classList)");
            startResizingFrame(
              frame,
              Array.from(classList)[classList.length - 1] as ResizeDirection
            );
          } else if (classList.contains("anchor")) {
            console.log(77, "77");
            startAnchoringFrame(frame);
          } else {
            startDraggingFrame(frame);
          }
        }}
        className={frame === spriteSheetStore.activeFrame ? "active" : ""}
        style={{
          left: `${Math.round(frame.x)}.px`,
          top: `${Math.round(frame.y)}.px`,
          width: `${Math.round(frame.w)}.px`,
          height: `${Math.round(frame.h)}.px`,
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
        <div
          className="anchor"
          style={{ left: `${frame.anchor.x}px`, top: `${frame.anchor.y}px` }}
        >
          {/*✛*/}
        </div>
      </EditorContainer>
    );
  }
);
