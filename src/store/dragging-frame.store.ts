import { IFrame, spriteSheetStore } from "./sprite-sheet.store";

export class DraggingFrameStore {
  draggingFrame?: IFrame;
  mouseX = 0;
  mouseY = 0;

  constructor() {
    window.addEventListener("mousemove", (e) => {
      if (this.draggingFrame) {
        spriteSheetStore.frameUpdateTool(() => {
          if (this.draggingFrame) {
            this.draggingFrame.x += e.x - this.mouseX;
            this.draggingFrame.y += e.y - this.mouseY;
          }
        });
      }
      this.mouseX = e.x;
      this.mouseY = e.y;
    });
    window.addEventListener("mouseleave", () => {
      if (this.draggingFrame) {
        this.setDraggingFrame(undefined);
      }
    });
    window.addEventListener("mouseup", () => {
      if (this.draggingFrame) {
        this.setDraggingFrame(undefined);
      }
    });
  }

  setDraggingFrame(frame?: IFrame): void {
    this.draggingFrame = frame;
  }
}
export const draggingFrameStore = new DraggingFrameStore();
