import React from "react";
import { observer } from "mobx-react";
import { spriteSheetStore } from "../store/sprite-sheet.store";
import styled from "styled-components";
import { Stage } from "@inlet/react-pixi";
import { AnimatedSprite, Container } from "@inlet/react-pixi/animated";
import { AddFrameToAnimation } from "./add-frame-to-animation";
import { ListItem } from "../support/list-item";
import { InZoom } from "../support/in-zoom";
import { SortableList } from "../support/sortable-list";

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
    spriteSheetStore.activeAnimation,
    "spriteSheetStore.activeAnimation"
  );

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
        <input
          type="button"
          value={`Rename frames to ${animation.name} with indexes`}
          onClick={(e) =>
            spriteSheetStore.updateAndSave(() => {
              const oldFrames = animation.frames;
              animation.frames = animation.frames.map(
                (fName, index) =>
                  `${animation.name.replace(".png", ``)}-${index + 1}.png`
              );
              oldFrames
                .map((frameName, index) => {
                  return spriteSheetStore.frames.find(
                    (f) => f.name === frameName
                  );
                })
                .filter((frame) => !!frame)
                .forEach((frame, index) => {
                  frame!.name = animation.frames[index];
                });
            })
          }
        />
      </div>
      <div>
        {animation.frames.length ? (
          <SortableList
            items={animation.frames.map((frame, index) => {
              return {
                item: frame,
                id: frame + index,
                content: (
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
                      spriteSheetStore.removeFrameFromAnimation(
                        animation,
                        frame
                      )
                    }
                  />
                ),
              };
            })}
            onDragEnd={(sortedItems) => {
              spriteSheetStore.updateAndSave(() => {
                animation.frames = sortedItems.map((item) => item.item);
              });
            }}
          />
        ) : (
          <div>No Frames in Animation</div>
        )}
      </div>
      <div>
        <AddFrameToAnimation animation={animation} />
      </div>
    </SelfContainer>
  );
});
