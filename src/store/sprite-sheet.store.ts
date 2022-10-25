import { makeAutoObservable, runInAction, toJS } from "mobx";
import * as PIXI from "pixi.js";
import { throttle } from "lodash";

const localStorageKey = "pixiSpriterData";

export type IFrame = {
  x: number;
  y: number;
  name: string;
  w: number;
  h: number;
};

export type IImage = {
  src: string;
  name: string;
  w: number;
  h: number;
};

export class SpriteSheetStore {
  get activeFrame(): IFrame | undefined {
    if (this.activeFrameIndex === undefined) {
      return undefined;
    } else {
      return this.frames[this.activeFrameIndex];
    }
  }
  draggingFrame?: IFrame;
  images: IImage[] = []; // base64 images;
  allImagesInOne?: IImage;

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

  frameUpdateTool(cb: () => void) {
    cb();
    this.saveBackup();
  }

  addNewFrame() {
    const frame: IFrame = {
      name: "Sprite" + Date.now(),
      w: 100,
      h: 100,
      x: 0,
      y: 0,
    };

    this.frames.push(frame);
    this.saveBackup();
  }

  setActiveFrame(frame: IFrame): void {
    this.activeFrameIndex = this.frames.indexOf(frame);
    this.saveBackup();
  }

  removeImage(image: IImage) {
    this.images = this.images.filter((img) => img !== image);
    this.updateAllImagesInOne();
    this.saveBackup();
  }

  addImage(image: IImage) {
    this.images.push(image);
    this.updateAllImagesInOne();
    this.saveBackup();
  }

  async updateAllImagesInOne() {
    const canvasHeight = this.images.reduce((h, image) => (h += image.h), 0);
    const canvasWidth = Math.max(...this.images.map((image) => image.w));
    const c = document.createElement("canvas");
    c.height = canvasHeight;
    c.width = canvasWidth;
    const ctx = c.getContext("2d");
    let imageY = 0;

    await Promise.all(
      this.images.map((image) => {
        const imageTag = new Image();
        imageTag.src = image.src;
        const selfImageY = imageY;
        imageY += image.h;

        return new Promise((res) => {
          imageTag.onload = () => {
            ctx!.drawImage(imageTag, 0, selfImageY, image.w, image.h);
            res(imageTag);
          };
        });
      })
    );

    runInAction(() => {
      this.allImagesInOne = {
        src: c.toDataURL("image/png"),
        w: canvasWidth,
        h: canvasHeight,
        name: "all-in-one.png",
      };
      this.saveBackup();
    });
  }

  saveBackup = throttle(() => {
    localStorage.setItem(
      localStorageKey,
      JSON.stringify({
        images: toJS(this.images),
        frames: toJS(this.frames),
        activeFrameIndex: toJS(this.activeFrameIndex),
        allImagesInOne: toJS(this.allImagesInOne),
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
      this.allImagesInOne = parsed.allImagesInOne;
    }
  }
}
export const spriteSheetStore = new SpriteSheetStore();
