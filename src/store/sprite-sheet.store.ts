import { makeAutoObservable, runInAction, toJS } from "mobx";
import * as PIXI from "pixi.js";
import { debounce, throttle } from "lodash";
import { BaseTexture, ISpritesheetData, Spritesheet } from "pixi.js";
import { Dict } from "@pixi/utils";
import { ISpritesheetFrameData } from "@pixi/spritesheet";

const localStorageKey = "pixiSpriterData";

export type IFrame = {
  x: number;
  y: number;
  name: string;
  w: number;
  h: number;
};

export type IAnimation = { name: string; frames: string[] };

interface ISpriteSheetJsonData extends ISpritesheetData {
  meta: {
    image: string;
    size: { w: number; h: number };
    scale: string;
  };
}

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

  spriteSheet?: Spritesheet;

  frames: IFrame[] = [];
  animations: IAnimation[] = [];
  activeFrameIndex?: number;
  activeAnimation?: IAnimation;

  constructor() {
    this.restoreDataFromLocalStorage();
    this.updatePixiSpriteSheet();

    makeAutoObservable(this);
  }

  updateAndSave(cb: () => void) {
    cb();
    this.updatePixiSpriteSheet();
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

  addNewAnimation() {
    const animation: IAnimation = {
      name: "Animation" + Date.now(),
      frames: [],
    };

    this.animations.push(animation);
    this.saveBackup();
  }

  setActiveAnimation(animation: IAnimation): void {
    this.activeAnimation = animation;
    this.saveBackup();
  }

  removeImage(image: IImage) {
    this.images = this.images.filter((img) => img !== image);
    this.updateAllImagesInOne();
    this.saveBackup();
    this.updatePixiSpriteSheet();
  }

  addImage(image: IImage) {
    this.images.push(image);
    this.updateAllImagesInOne();
    this.saveBackup();
    this.updatePixiSpriteSheet();
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
      this.updatePixiSpriteSheet();
    });
  }

  saveBackup = throttle(() => {
    localStorage.setItem(
      localStorageKey,
      JSON.stringify({
        images: toJS(this.images),
        frames: toJS(this.frames),
        animations: toJS(this.animations),
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
      this.frames = parsed.frames || [];
      this.animations = parsed.animations || [];
      this.activeFrameIndex = parsed.activeFrameIndex;
      this.allImagesInOne = parsed.allImagesInOne;
    }
  }

  lastI = 0;
  updatePixiSpriteSheet = debounce(() => {
    const pixiSpriteSheetJsonData =
      spriteSheetStore.getPixiSpriteSheetJsonData();

    const spriteSheet = new Spritesheet(
      BaseTexture.from(pixiSpriteSheetJsonData.meta.image),
      pixiSpriteSheetJsonData
    );
    let i = (this.lastI = Math.random());

    spriteSheet.parse().then(() => {
      if (i === this.lastI) {
        runInAction(() => {
          this.spriteSheet = spriteSheet;
        });
      }
    });
  }, 100);

  getPixiSpriteSheetJsonData(): ISpriteSheetJsonData {
    // Create object to store sprite sheet data
    if (!this.allImagesInOne) {
      return {
        meta: {
          image: "none",
          scale: "1",
          size: { w: 0, h: 0 },
        },
        frames: {},
      };
    }

    return toJS({
      frames: this.frames.reduce((acc, frame) => {
        acc[frame.name] = {
          frame: {
            x: frame.x,
            y: frame.y,
            w: frame.w,
            h: frame.h,
          },
          sourceSize: {
            w: frame.w,
            h: frame.h,
          },
          spriteSourceSize: {
            x: 0,
            y: 0,
          },
          anchor: {
            x: frame.w,
            y: frame.h,
          },
          rotated: false,
        };

        return acc;
      }, {} as Dict<ISpritesheetFrameData>),
      meta: {
        image: this.allImagesInOne.src,
        size: { w: this.allImagesInOne.w, h: this.allImagesInOne.h },
        scale: "1",
      },
      animations: this.animations.reduce((acc, animation) => {
        acc[animation.name] = animation.frames;

        return acc;
      }, {} as Dict<string[]>),
    });
  }
}
export const spriteSheetStore = new SpriteSheetStore();
