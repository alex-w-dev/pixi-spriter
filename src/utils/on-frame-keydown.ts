import { spriteSheetStore } from "../store/sprite-sheet.store";
import { KeyboardEventHandler } from "react";

export const onFrameKeydown: KeyboardEventHandler<HTMLDivElement> = (e) => {
  if (e.key === "Delete") {
    if (spriteSheetStore.activeFrame) {
      console.log(1, "1");
      spriteSheetStore.removeFrame(spriteSheetStore.activeFrame);
    }
  }
  if (e.key === "a") {
    if (
      spriteSheetStore.activeFrame &&
      spriteSheetStore.activeAnimation &&
      spriteSheetStore.activeAnimation.frames.every(
        (fName) => fName !== spriteSheetStore.activeFrame?.name
      )
    ) {
      console.log(2, "2");
      spriteSheetStore.addFrameToAnimation(
        spriteSheetStore.activeAnimation,
        spriteSheetStore.activeFrame.name
      );
    }
  }
};
