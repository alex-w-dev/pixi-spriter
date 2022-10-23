import { intercept, makeAutoObservable, observe, reaction, toJS } from "mobx";
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
  images: IImage[] = []; // base64 images

  spriteSheet: PIXI.ISpritesheetData = {
    frames: {},
    animations: {},
    meta: {
      scale: "1",
    },
  };

  frames: IFrame[] = [];
  activeFrame?: IFrame;

  constructor() {
    this.restoreDataFromLocalStorage();

    makeAutoObservable(this);
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
    this.activeFrame = frame;
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
        images: toJS(spiteSheetStore.images),
        frames: toJS(spiteSheetStore.frames),
        activeFrame: toJS(spiteSheetStore.activeFrame),
      })
    );
  }, 1000);

  restoreDataFromLocalStorage(): void {
    const data = localStorage.getItem(localStorageKey);
    if (data) {
      const parsed: SpriteSheetStore = JSON.parse(data);
      Object.assign(this, parsed);
    }
  }
}
export const spiteSheetStore = new SpriteSheetStore();
