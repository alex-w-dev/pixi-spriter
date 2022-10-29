import React from "react";
import { observer } from "mobx-react";
import { spriteSheetStore } from "../store/sprite-sheet.store";
import styled from "styled-components";
import { Stage } from "@inlet/react-pixi";
import { AnimatedSprite, Container } from "@inlet/react-pixi/animated";
import { AddFrameToAnimation } from "./add-frame-to-animation";
import { ListItem } from "./list-item";
import { InZoom } from "./in-zoom";

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
  console.log(textures, "textures");

  return (
    <SelfContainer>
      {animation.frames.length && textures?.length ? (
        <InZoom width={animation.w}>
          <Stage
            width={animation.w}
            height={animation.h}
            options={{ backgroundColor: 0xeef1f5 }}
          >
            <Container position={[animation.anchor.x, animation.anchor.y]}>
              <AnimatedSprite
                key={Math.random()} // always reqrite
                textures={textures}
                updateAnchor={true}
                isPlaying={true}
                initialFrame={0}
                animationSpeed={0.08}
              />
            </Container>
          </Stage>
        </InZoom>
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
          <ListItem
            error={false}
            active={frame === spriteSheetStore.activeFrame?.name}
            title={frame}
            onTitleClick={() =>
              spriteSheetStore.setActiveFrame(
                spriteSheetStore.frames.find((f) => f.name === frame)
              )
            }
            onDeleteClick={() =>
              spriteSheetStore.removeFrameFromAnimation(animation, frame)
            }
            key={frame}
          />
        ))}
      </div>
      <div>
        <AddFrameToAnimation animation={animation} />
      </div>
    </SelfContainer>
  );
});
