import React, { ChangeEvent } from "react";
import { observer } from "mobx-react";
import { spriteSheetStore } from "../store/sprite-sheet.store";
import styled from "styled-components";

const Frame = styled.div<{ active: boolean }>`
  border: 1px solid ${(props) => (props.active ? "blue" : "white")};
`;

export const AnimationList: React.FC = observer(() => {
  return (
    <div>
      {spriteSheetStore.animations.map((animation, index) => (
        <Frame
          key={index}
          active={animation === spriteSheetStore.activeAnimation}
          onClick={() => spriteSheetStore.setActiveAnimation(animation)}
        >
          {animation.name}
        </Frame>
      ))}
    </div>
  );
});
