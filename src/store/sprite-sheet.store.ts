import { makeAutoObservable, runInAction, toJS } from "mobx";
import { debounce, throttle } from "lodash";
import { BaseTexture, ISpritesheetData, Rectangle, Spritesheet } from "pixi.js";
import { Dict } from "@pixi/utils";
import { ISpritesheetFrameData } from "@pixi/spritesheet";
import { detectPngRectangles } from "../utils/detect-png-rectangles";

const localStorageKey = "pixiSpriterData";

export type IFrame = {
  x: number;
  y: number;
  name: string;
  w: number;
  h: number;
  anchor: {
    x: number;
    y: number;
  };
};

export type IAnimation = {
  name: string;
  frames: string[];
  w: number;
  h: number;
  anchor: { x: number; y: number };
};

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
  draggingFrame?: IFrame;
  images: IImage[] = []; // base64 images;
  allImagesInOne?: IImage;

  spriteSheet?: Spritesheet;

  frames: IFrame[] = [];

  get sortedFrames(): (IFrame & {
    active: boolean;
    error: boolean;
    inAnimation: boolean;
  })[] {
    return [...this.frames]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((frame) => {
        return {
          ...frame,
          error: this.frames.filter((f) => f.name === frame.name).length > 1,
          active: frame.name === this.activeFrame?.name,
          inAnimation: this.animations.some((a) =>
            a.frames.includes(frame.name)
          ),
        };
      });
  }
  animations: IAnimation[] = [];
  activeFrame?: IFrame;
  activeAnimation?: IAnimation;

  constructor() {
    this.restoreDataFromLocalStorage();
    this.updatePixiSpriteSheet();

    makeAutoObservable(this);
  }

  updateAndSave(cb: () => void) {
    cb();
    this.updatePixiSpriteSheet();
    this.updateAllAnimationsParameters();
    this.saveBackup();
  }

  getFrameByName(frameName?: string): IFrame | undefined {
    return this.frames.find((f) => f.name === frameName);
  }

  addFrameToAnimation(animation: IAnimation, frameName: string) {
    animation.frames.push(frameName);
    this.updateAnimationParameters(animation);

    this.updatePixiSpriteSheet();
    this.saveBackup();
  }

  updateAllAnimationsParameters() {
    this.animations.forEach((a) => this.updateAnimationParameters(a));
  }

  updateAnimationParameters(animation: IAnimation) {
    const animationFrames = this.frames.filter((f) =>
      animation.frames.includes(f.name)
    );

    if (animationFrames.length) {
      const maxAnchorLeft = Math.max(...animationFrames.map((f) => f.anchor.x));
      const maxAnchorRight = Math.max(
        ...animationFrames.map((f) => f.w - f.anchor.x)
      );
      const maxAnchorTop = Math.max(...animationFrames.map((f) => f.anchor.y));
      const maxAnchorBottom = Math.max(
        ...animationFrames.map((f) => f.h - f.anchor.y)
      );
      animation.anchor.y = maxAnchorTop;
      animation.anchor.x = maxAnchorLeft;
      animation.w = maxAnchorRight + maxAnchorLeft;
      animation.h = maxAnchorTop + maxAnchorBottom;
    } else {
      animation.anchor.y = 0;
      animation.anchor.x = 0;
      animation.w = 0;
      animation.h = 0;
    }
  }

  addNewFrame(frame?: IFrame) {
    frame = frame || {
      name: "Sprite" + Date.now(),
      w: 100,
      h: 100,
      x: 0,
      y: 0,
      anchor: {
        x: 50,
        y: 50,
      },
    };

    this.frames.push(frame);
    this.saveBackup();
  }

  removeFrameFromAnimation(animation: IAnimation, frameName: string) {
    animation.frames = animation.frames.filter((f) => f !== frameName);
    this.updateAnimationParameters(animation);

    this.updatePixiSpriteSheet();
    this.saveBackup();
  }

  removeFrame(frame: IFrame) {
    this.frames = this.frames.filter((f) => f !== frame);
    this.animations.forEach(
      (a) => (a.frames = a.frames.filter((f) => f !== frame.name))
    );
    if (this.activeFrame === frame) {
      this.activeFrame = undefined;
    }

    this.updateAllAnimationsParameters();
    this.saveBackup();
  }

  setActiveFrame(frame?: IFrame): void {
    this.activeFrame = frame;
  }

  addNewAnimation() {
    const animation: IAnimation = {
      name: "Animation" + Date.now(),
      frames: [],
      anchor: { x: 0, y: 0 },
      h: 0,
      w: 0,
    };
    this.animations.push(animation);
    this.setActiveAnimation(
      this.animations.find((a) => a.name === animation.name)
    );
    this.saveBackup();
  }

  setActiveAnimation(animation?: IAnimation): void {
    this.activeAnimation = animation;
  }

  removeAnimation(animation: IAnimation): void {
    this.animations = this.animations.filter((a) => a !== animation);
    if (this.activeAnimation === animation) {
      this.activeAnimation = undefined;
    }
    this.saveBackup();
  }

  removeImage(image: IImage) {
    this.images = this.images.filter((img) => img !== image);
    this.updateAllImagesInOne();
    this.saveBackup();
    this.updatePixiSpriteSheet();
  }

  addImage(image: IImage) {
    const framesYStart = this.images.reduce((acc, i) => acc + i.h, 0);
    this.images.push(image);

    this.generateNewFrames(image).then((d) => {
      console.log(d, "d");
      d.forEach((rect, index) => {
        this.addNewFrame({
          x: rect.x,
          y: rect.y + framesYStart,
          w: rect.w,
          h: rect.h,
          name: image.name.replace(".png", `-${index + 1}.png`),
          anchor: {
            x: Math.round(rect.w / 2),
            y: Math.round(rect.h / 2),
          },
        });
      });
    });
    this.updateAllImagesInOne();
    this.saveBackup();
    this.updatePixiSpriteSheet();
  }

  async generateNewFrames(image: IImage) {
    return detectPngRectangles(image.src);
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
      this.allImagesInOne = parsed.allImagesInOne;
    }
  }

  lastI = 0;
  updatePixiSpriteSheet = debounce(() => {
    const pixiSpriteSheetJsonData =
      spriteSheetStore.getPixiSpriteSheetJsonData();
    console.log(pixiSpriteSheetJsonData, "pixiSpriteSheetJsonData");

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
        const myAnimation = this.animations.find((a) =>
          a.frames.includes(frame.name)
        );

        acc[frame.name] = {
          frame: {
            x: frame.x,
            y: frame.y,
            w: frame.w,
            h: frame.h,
          },
          rotated: false,
          trimmed: true,
        };

        if (myAnimation) {
          acc[frame.name].anchor = {
            x: myAnimation.anchor.x / myAnimation.w,
            y: myAnimation.anchor.y / myAnimation.h,
          };
          acc[frame.name].sourceSize = {
            w: myAnimation.w,
            h: myAnimation.h,
          };
          acc[frame.name].spriteSourceSize = {
            x: myAnimation.anchor.x - frame.anchor.x,
            y: myAnimation.anchor.y - frame.anchor.y,
          };
          acc[frame.name].trimmed = true;
        } else {
          acc[frame.name].anchor = {
            x: frame.anchor.x,
            y: frame.anchor.y,
          };
        }

        return acc;
      }, {} as Dict<ISpritesheetFrameData>),
      meta: {
        image: this.allImagesInOne.src,
        size: { w: this.allImagesInOne.w, h: this.allImagesInOne.h },
        scale: "1",
      },
      animations: this.animations.reduce((acc, animation) => {
        acc[animation.name] = toJS(animation.frames);

        return acc;
      }, {} as Dict<string[]>),
    });
  }
}
export const spriteSheetStore = new SpriteSheetStore();
