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
  img: HTMLImageElement;
  src: string;
  name: string;
  w: number;
  h: number;
};
export type IProject = {
  id: number;
  name: string;
};

export class SpriteSheetStore {
  currentProjectIndex = 0;
  projects: IProject[] = [
    {
      name: "Untitled",
      id: Date.now(),
    },
  ];
  get currentProject(): IProject {
    return this.projects[this.currentProjectIndex];
  }
  get currentProjectStorageKey(): string {
    return localStorageKey + "/" + this.currentProject.id;
  }
  images: IImage[] = []; // base64 images;
  allImagesInOne?: IImage;

  spriteSheet?: Spritesheet;

  frames: IFrame[] = [];

  get sortedFrames(): {
    active: boolean;
    error: boolean;
    inAnimation: boolean;
    frame: IFrame;
  }[] {
    return this.frames
      .map((frame) => {
        return {
          frame,
          error: this.frames.filter((f) => f.name === frame.name).length > 1,
          active: frame.name === this.activeFrame?.name,
          inAnimation: this.animations.some((a) =>
            a.frames.includes(frame.name)
          ),
        };
      })
      .sort((a, b) =>
        a.frame.name.localeCompare(b.frame.name, undefined, {
          numeric: true,
          sensitivity: "base",
        })
      );
  }
  animations: IAnimation[] = [];
  activeFrame?: IFrame;
  activeAnimation?: IAnimation;

  constructor() {
    this.reInit();
    makeAutoObservable(this);
  }

  reInit() {
    this.restoreProjectsFromLocalStorage();
    this.restoreCurrentProjectDataFromLocalStorage();
  }

  updateAndSave(cb: () => void) {
    cb();
    this.updatePixiSpriteSheet();
    this.updateAllAnimationsParameters();
    this.saveCurrentProjectBackup();
  }

  getFrameByName(frameName?: string): IFrame | undefined {
    return this.frames.find((f) => f.name === frameName);
  }

  addFrameToAnimation(animation: IAnimation, frameName: string) {
    animation.frames.push(frameName);
    this.updateAnimationParameters(animation);

    this.updatePixiSpriteSheet();
    this.saveCurrentProjectBackup();
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
    this.saveCurrentProjectBackup();
  }

  removeFrameFromAnimation(animation: IAnimation, frameName: string) {
    animation.frames = animation.frames.filter((f) => f !== frameName);
    this.updateAnimationParameters(animation);

    this.updatePixiSpriteSheet();
    this.saveCurrentProjectBackup();
  }

  removeFrame(frame: IFrame) {
    const sortedFrameIndex = this.sortedFrames.indexOf(
      this.sortedFrames.find((sf) => sf.frame === frame)!
    );
    this.frames = this.frames.filter((f) => f !== frame);
    this.animations.forEach(
      (a) => (a.frames = a.frames.filter((f) => f !== frame.name))
    );
    if (this.activeFrame === frame) {
      this.activeFrame =
        this.sortedFrames[sortedFrameIndex]?.frame ||
        this.sortedFrames[sortedFrameIndex - 1]?.frame;
      console.log(this.activeFrame, "this.activeFrame");
    }

    this.updateAllAnimationsParameters();
    this.saveCurrentProjectBackup();
  }

  setActiveFrame(frame?: IFrame): void {
    this.activeFrame = frame;
  }

  addNewAnimation(animation?: IAnimation) {
    animation = animation || {
      name: "Animation" + Date.now(),
      frames: [],
      anchor: { x: 0, y: 0 },
      h: 0,
      w: 0,
    };
    this.animations.push(animation);
    this.setActiveAnimation(
      this.animations.find((a) => a.name === animation!.name)
    );
    this.saveCurrentProjectBackup();
  }

  setActiveAnimation(animation?: IAnimation): void {
    this.activeAnimation = animation;
  }

  removeAnimation(animation: IAnimation): void {
    this.animations = this.animations.filter((a) => a !== animation);
    if (this.activeAnimation === animation) {
      this.activeAnimation = undefined;
    }
    this.saveCurrentProjectBackup();
  }

  removeImage(image: IImage) {
    this.images = this.images.filter((img) => img !== image);
    this.updateAllImagesInOne();
    this.saveCurrentProjectBackup();
    this.updatePixiSpriteSheet();
  }

  addImage(image: IImage) {
    const framesYStart = this.images.reduce((acc, i) => acc + i.h, 0);
    this.images.push(image);

    this.generateNewFrames(image).then((d) => {
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
    this.addNewAnimation({
      name: image.name.replace(".png", ``),
      frames: [],
      anchor: { x: 0, y: 0 },
      h: 0,
      w: 0,
    });
    this.updateAllImagesInOne();
    this.saveCurrentProjectBackup();
    this.updatePixiSpriteSheet();
  }

  async generateNewFrames(image: IImage) {
    return detectPngRectangles(image.src);
  }

  addNewProject() {
    this.currentProjectIndex =
      this.projects.push({ name: "Untitled", id: Date.now() }) - 1;
    this.saveProjectsBackup();
    this.restoreCurrentProjectDataFromLocalStorage();
  }

  selectProject(projectId: IProject["id"]) {
    this.currentProjectIndex = this.projects.indexOf(
      this.projects.find((p) => p.id === projectId)!
    );
    this.saveProjectsBackup();
    this.restoreCurrentProjectDataFromLocalStorage();
  }

  changeCurrentProjectName(name: string) {
    this.currentProject.name = name;
    this.saveProjectsBackup();
    this.restoreCurrentProjectDataFromLocalStorage();
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

    const src = c.toDataURL("image/png");
    const img = new Image();
    img.src = src;
    img.onload = () => {
      runInAction(() => {
        this.allImagesInOne = {
          img,
          src,
          w: canvasWidth,
          h: canvasHeight,
          name: "all-in-one.png",
        };
        this.saveCurrentProjectBackup();
        this.updatePixiSpriteSheet();
      });
    };
  }

  saveCurrentProjectBackup = throttle(() => {
    localStorage.setItem(
      this.currentProjectStorageKey,
      JSON.stringify({
        images: toJS(this.images),
        frames: toJS(this.frames),
        animations: toJS(this.animations),
      })
    );
  }, 1000);

  saveProjectsBackup = throttle(() => {
    localStorage.setItem(
      localStorageKey,
      JSON.stringify({
        projects: toJS(this.projects),
        currentProject: toJS(this.currentProjectIndex),
      })
    );
  }, 1000);

  restoreProjectsFromLocalStorage(): void {
    const data = localStorage.getItem(localStorageKey);
    const parsed = data && JSON.parse(data);

    console.log(parsed, "parsed");

    this.projects = parsed?.projects || this.projects;
    this.currentProjectIndex =
      parsed?.currentProject || this.currentProjectIndex;
  }

  restoreCurrentProjectDataFromLocalStorage(): void {
    this.activeFrame = undefined;
    this.activeAnimation = undefined;
    this.allImagesInOne = undefined;
    this.spriteSheet = undefined;
    const data = localStorage.getItem(this.currentProjectStorageKey);
    const parsed = data && JSON.parse(data);

    this.images = parsed?.images || [];
    this.frames = parsed?.frames || [];
    this.animations = parsed?.animations || [];

    this.updatePixiSpriteSheet();
    this.updateAllImagesInOne();
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
          image:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC",
          scale: "1",
          size: { w: 1, h: 1 },
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
            x: Math.round((myAnimation.anchor.x / myAnimation.w) * 1000) / 1000,
            y: Math.round((myAnimation.anchor.y / myAnimation.h) * 1000) / 1000,
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
