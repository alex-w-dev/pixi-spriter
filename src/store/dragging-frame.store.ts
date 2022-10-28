import { IFrame, spriteSheetStore } from "./sprite-sheet.store";
import { editorStateStore } from "./editor-state.store";

export enum ResizeDirection {
  lt = "lt",
  rt = "rt",
  lb = "lb",
  rb = "rb",
  t = "t",
  r = "r",
  b = "b",
  l = "l",
}

function stayInFrameResized(frame: IFrame): IFrame {
  if (frame.x < 0) {
    frame.x = 0;
  }
  if (frame.y < 0) {
    frame.y = 0;
  }
  if (frame.w < 0) {
    frame.w = 0;
  }
  if (frame.h < 0) {
    frame.h = 0;
  }
  if (frame.x + frame.w > spriteSheetStore.allImagesInOne!.w) {
    frame.w = spriteSheetStore.allImagesInOne!.w - frame.x;
  }
  if (frame.y + frame.h > spriteSheetStore.allImagesInOne!.h) {
    frame.h = spriteSheetStore.allImagesInOne!.h - frame.y;
  }

  return frame;
}

function stayInFrameDragged(frame: IFrame): IFrame {
  if (frame.x < 0) {
    frame.x = 0;
  }
  if (frame.y < 0) {
    frame.y = 0;
  }
  if (frame.x + frame.w > spriteSheetStore.allImagesInOne!.w) {
    frame.x = spriteSheetStore.allImagesInOne!.w - frame.w;
  }
  if (frame.y + frame.h > spriteSheetStore.allImagesInOne!.h) {
    frame.y = spriteSheetStore.allImagesInOne!.h - frame.h;
  }

  return frame;
}

function roundFrameData(frame: IFrame): IFrame {
  frame.x = Math.round(frame.x * 10) / 10;
  frame.y = Math.round(frame.y * 10) / 10;
  frame.w = Math.round(frame.w * 10) / 10;
  frame.h = Math.round(frame.h * 10) / 10;

  return frame;
}

export class DraggingFrameStore {
  draggingFrame?: IFrame;
  resizingFrame?: IFrame;
  anchoringFrame?: IFrame;
  resizeDirection?: ResizeDirection;
  mouseX = 0;
  mouseY = 0;

  constructor() {
    window.addEventListener("mousemove", (e) => {
      const deltaX = (e.x - this.mouseX) / editorStateStore.zoom;
      const deltaY = (e.y - this.mouseY) / editorStateStore.zoom;

      if (this.draggingFrame) {
        spriteSheetStore.updateAndSave(() => {
          if (this.draggingFrame) {
            this.draggingFrame.x = this.draggingFrame.x + deltaX;
            this.draggingFrame.y = this.draggingFrame.y + deltaY;

            stayInFrameDragged(this.draggingFrame);
            roundFrameData(this.draggingFrame);
          }
        });
      }
      if (this.anchoringFrame) {
        spriteSheetStore.updateAndSave(() => {
          if (this.anchoringFrame) {
            console.log(777, "777");
            this.anchoringFrame.anchor.x = Math.max(
              0,
              Math.min(
                this.anchoringFrame.w,
                this.anchoringFrame.anchor.x + deltaX
              )
            );
            this.anchoringFrame.anchor.y = Math.max(
              0,
              Math.min(
                this.anchoringFrame.h,
                this.anchoringFrame.anchor.y + deltaY
              )
            );
          }
        });
      }
      if (this.resizingFrame) {
        spriteSheetStore.updateAndSave(() => {
          if (this.resizingFrame) {
            if (this.resizeDirection === ResizeDirection.lt) {
              this.resizingFrame.w = this.resizingFrame.w - deltaX;
              this.resizingFrame.h = this.resizingFrame.h - deltaY;
              this.resizingFrame.x = this.resizingFrame.x + deltaX;
              this.resizingFrame.y = this.resizingFrame.y + deltaY;
            } else if (this.resizeDirection === ResizeDirection.rt) {
              this.resizingFrame.w = this.resizingFrame.w + deltaX;
              this.resizingFrame.h = this.resizingFrame.h - deltaY;
              this.resizingFrame.y = this.resizingFrame.y + deltaY;
            } else if (this.resizeDirection === ResizeDirection.lb) {
              this.resizingFrame.w = this.resizingFrame.w - deltaX;
              this.resizingFrame.h = this.resizingFrame.h + deltaY;
              this.resizingFrame.x = this.resizingFrame.x + deltaX;
            } else if (this.resizeDirection === ResizeDirection.l) {
              this.resizingFrame.w = this.resizingFrame.w - deltaX;
              this.resizingFrame.x = this.resizingFrame.x + deltaX;
            } else if (this.resizeDirection === ResizeDirection.r) {
              this.resizingFrame.w = this.resizingFrame.w + deltaX;
            } else if (this.resizeDirection === ResizeDirection.b) {
              this.resizingFrame.h = this.resizingFrame.h + deltaY;
            } else if (this.resizeDirection === ResizeDirection.t) {
              this.resizingFrame.h = this.resizingFrame.h - deltaY;
              this.resizingFrame.y = this.resizingFrame.y + deltaY;
            } else {
              this.resizingFrame.w = this.resizingFrame.w + deltaX;
              this.resizingFrame.h = this.resizingFrame.h + deltaY;
            }

            stayInFrameResized(this.resizingFrame);
            roundFrameData(this.resizingFrame);
          }
        });
      }
      this.mouseX = e.x;
      this.mouseY = e.y;
    });
    window.addEventListener("mouseleave", () => {
      this.resetFrames();
    });
    window.addEventListener("mouseup", () => {
      this.resetFrames();
    });
  }

  resetFrames() {
    if (this.draggingFrame) {
      this.setDraggingFrame(undefined);
    }
    if (this.resizingFrame) {
      this.setResizingFrame(undefined);
    }
    if (this.anchoringFrame) {
      this.setAnchoringFrame(undefined);
    }
  }

  setDraggingFrame(frame?: IFrame): void {
    this.draggingFrame = frame;
  }

  setResizingFrame(frame?: IFrame, resizeDirection?: ResizeDirection): void {
    this.resizingFrame = frame;
    this.resizeDirection = resizeDirection;
  }

  setAnchoringFrame(frame?: IFrame): void {
    this.anchoringFrame = frame;
  }
}
export const draggingFrameStore = new DraggingFrameStore();
