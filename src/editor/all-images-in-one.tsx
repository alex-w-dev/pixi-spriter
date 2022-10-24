import React from "react";
import { observer } from "mobx-react";
import { spriteSheetStore } from "../store/sprite-sheet.store";
import { Sprite, Stage } from "@inlet/react-pixi";

export const AllImagesInOne: React.FC = observer(() => {
  if (!spriteSheetStore.allImagesInOne) {
    return <div>no images yet</div>;
  }

  return <img src={spriteSheetStore.allImagesInOne?.src} alt="" />;

  // const stageHeight = spriteSheetStore.images.reduce(
  //   (h, image) => (h += image.h),
  //   0
  // );
  // const stageWidth = Math.max(
  //   ...spriteSheetStore.images.map((image) => image.w)
  // );
  //
  // let imageY = 0;
  //
  // console.log(stageHeight, "stageHeight");
  // console.log(stageWidth, "stageWidth");
  //
  // return (
  //   <Stage
  //     height={stageHeight}
  //     width={stageWidth}
  //     options={{ backgroundColor: 0xffffff }}
  //   >
  //     {spriteSheetStore.images.map((image, index) => {
  //       const sprite = (
  //         <Sprite
  //           key={index}
  //           image={image.src}
  //           width={image.w}
  //           height={image.h}
  //           x={0}
  //           y={imageY}
  //         />
  //       );
  //
  //       imageY += image.h;
  //
  //       return sprite;
  //     })}
  //   </Stage>
  // );
});
