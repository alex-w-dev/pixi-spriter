import React from "react";
import styled from "styled-components";
import { IFrame, spriteSheetStore } from "../store/sprite-sheet.store";

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

export const FrameEditor: React.FC<{ frame: IFrame }> = ({ frame }) => {
  return (
    <Container
      style={{
        opacity: frame === spriteSheetStore.activeFrame ? 1 : 0.5,
        left: `${frame.globalX}.px`,
        top: `${frame.globalY}.px`,
        width: `${frame.w}.px`,
        height: `${frame.h}.px`,
      }}
    >
      <div className="title">{frame.name}</div>
      <div className="resizer" />
    </Container>
  );
};
