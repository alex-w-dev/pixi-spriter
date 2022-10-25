import { IFrame, spriteSheetStore } from "./sprite-sheet.store";

export class DraggingFrameStore {
  draggingFrame?: IFrame;
  resizingFrame?: IFrame;
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
      if (this.resizingFrame) {
        spriteSheetStore.frameUpdateTool(() => {
          if (this.resizingFrame) {
            this.resizingFrame.w = Math.max(
              0,
              this.resizingFrame.w + e.x - this.mouseX
            );
            this.resizingFrame.h = Math.max(
              0,
              this.resizingFrame.h + e.y - this.mouseY
            );
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
      if (this.resizingFrame) {
        this.setResizingFrame(undefined);
      }
    });
    window.addEventListener("mouseup", () => {
      if (this.draggingFrame) {
        this.setDraggingFrame(undefined);
      }
      if (this.resizingFrame) {
        this.setResizingFrame(undefined);
      }
    });
  }

  setDraggingFrame(frame?: IFrame): void {
    this.draggingFrame = frame;
  }

  setResizingFrame(frame?: IFrame): void {
    this.resizingFrame = frame;
  }
}
export const draggingFrameStore = new DraggingFrameStore();
