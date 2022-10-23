import React, { ChangeEvent } from "react";
import { observer } from "mobx-react";
import { spriteSheetStore } from "../store/sprite-sheet.store";
import styled from "styled-components";

const Frame = styled.div<{ active: boolean }>`
  border: 1px solid ${(props) => (props.active ? "blue" : "white")};
`;

export const FrameList: React.FC = observer(() => {
  return (
    <div className="frame-list">
      {spriteSheetStore.frames.map((frame, index) => (
        <Frame
          key={index}
          active={frame === spriteSheetStore.activeFrame}
          onClick={() => spriteSheetStore.activateFrame(frame)}
        >
          {frame.name}
        </Frame>
      ))}
    </div>
  );
});
