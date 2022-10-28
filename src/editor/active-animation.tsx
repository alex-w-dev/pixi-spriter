import React from "react";
import { observer } from "mobx-react";
import { spriteSheetStore } from "../store/sprite-sheet.store";
import styled from "styled-components";
import { Stage } from "@inlet/react-pixi";
import { AnimatedSprite, Container } from "@inlet/react-pixi/animated";
import { AddFrameToAnimation } from "./add-frame-to-animation";
import { toJS } from "mobx";

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

  console.log(
    spriteSheet.animations[animation.name],
    "spriteSheet.animations[animation.name]"
  );
  console.log(spriteSheet.animations, "spriteSheet.animations");
  console.log(toJS(animation.name), "animation.name");
  console.log(toJS(animation), "animation");
  console.log(toJS(animation.frames), "animation.frames");

  return (
    <SelfContainer>
      {animation.frames.length ? (
        <Stage width={100} height={100} options={{ backgroundColor: 0xeef1f5 }}>
          <Container position={[50, 50]}>
            <AnimatedSprite
              key={Math.random()} // always reqrite
              anchor={0.5}
              textures={spriteSheet.animations[animation.name]}
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
