import React from "react";
import { observer } from "mobx-react";
import { spriteSheetStore } from "../store/sprite-sheet.store";
import styled from "styled-components";
import { Stage } from "@inlet/react-pixi";
import { AnimatedSprite, Container } from "@inlet/react-pixi/animated";
import { AddFrameToAnimation } from "./add-frame-to-animation";

const EmptyContainer = styled.div`
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const SelfContainer = styled.div`
  width: 100%;
  white-space: nowrap;

  input[type="text"] {
    width: 150px;
  }
`;

export const ActiveAnimation: React.FC = observer(() => {
  const spriteSheet = spriteSheetStore.spriteSheet;
  const animation = spriteSheetStore.activeAnimation;

  if (!spriteSheet || !animation || !spriteSheetStore.allImagesInOne) {
    return <EmptyContainer>No active animation</EmptyContainer>;
  }

  const textures = spriteSheet.animations[animation.name];

  return (
    <SelfContainer>
      {animation.frames.length && textures ? (
        <Stage width={100} height={100} options={{ backgroundColor: 0xeef1f5 }}>
          <Container position={[50, 50]}>
            <AnimatedSprite
              key={Math.random()} // always reqrite
              textures={textures}
              isPlaying={true}
              initialFrame={0}
              animationSpeed={0.1}
            />
          </Container>
        </Stage>
      ) : (
        <EmptyContainer>No frames in animation</EmptyContainer>
      )}
      <div>
        Name:{" "}
        <input
          type="text"
          value={animation.name}
          onChange={(e) =>
            spriteSheetStore.updateAndSave(() => {
              animation.name = e.target.value;
            })
          }
        />
      </div>
      <div>
        {animation.frames.map((frame) => (
          <div key={frame}>{frame}</div>
        ))}
      </div>
      <div>
        <AddFrameToAnimation animation={animation} />
      </div>
    </SelfContainer>
  );
});
