import { makeAutoObservable } from "mobx";
import { spriteSheetStore } from "./sprite-sheet.store";

export class EditorStateStore {
  zoom = 1;

  constructor() {
    makeAutoObservable(this);

    // todo move it to another store
    window.addEventListener("keydown", (e) => {
      console.log(e, "e");
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
    });
  }

  setZoom(zoom: number): void {
    this.zoom = zoom;
  }
}
export const editorStateStore = new EditorStateStore();
