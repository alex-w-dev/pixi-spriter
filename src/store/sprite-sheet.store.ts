import { makeAutoObservable, toJS } from "mobx";
import * as PIXI from "pixi.js";
import { throttle } from "lodash";

const localStorageKey = "pixiSpriterData";

export type IFrame = {
  imageUrl?: string;
  x?: number;
  y?: number;
  name: string;
  w: number;
  h: number;
  globalX: number;
  globalY: number;
};

export type IImage = {
  src: string;
  name: string;
};

export class SpriteSheetStore {
  get activeFrame(): IFrame | undefined {
    if (this.activeFrameIndex === undefined) {
      return undefined;
    } else {
      return this.frames[this.activeFrameIndex];
    }
  }
  images: IImage[] = []; // base64 images

  spriteSheet: PIXI.ISpritesheetData = {
    frames: {},
    animations: {},
    meta: {
      scale: "1",
    },
  };

  frames: IFrame[] = [];
  activeFrameIndex?: number;

  constructor() {
    this.restoreDataFromLocalStorage();

    makeAutoObservable(this);
  }

  activeFrameUpdate(cb: () => void) {
    cb();
    this.saveBackup();
  }

  addNewFrame() {
    const frame: IFrame = {
      name: "Sprite" + Date.now(),
      w: 100,
      h: 100,
      globalX: 0,
      globalY: 0,
    };

    if (this.images.length) {
      frame.imageUrl = this.images[0].src;
      frame.x = 0;
      frame.y = 0;
    }

    this.frames.push(frame);
    this.saveBackup();
  }

  activateFrame(frame: IFrame): void {
    this.activeFrameIndex = this.frames.indexOf(frame);
    this.saveBackup();
  }

  removeImage(image: IImage) {
    this.images = this.images.filter((img) => img !== image);
    this.saveBackup();
  }

  addImage(image: IImage) {
    this.images.push(image);
    this.saveBackup();
  }

  saveBackup = throttle(() => {
    localStorage.setItem(
      localStorageKey,
      JSON.stringify({
        images: toJS(this.images),
        frames: toJS(this.frames),
        activeFrameIndex: toJS(this.activeFrameIndex),
      })
    );
  }, 1000);

  restoreDataFromLocalStorage(): void {
    const data = localStorage.getItem(localStorageKey);
    if (data) {
      const parsed = JSON.parse(data);

      this.images = parsed.images;
      this.frames = parsed.frames;
      this.activeFrameIndex = parsed.activeFrameIndex;
    }
  }
}
export const spriteSheetStore = new SpriteSheetStore();
