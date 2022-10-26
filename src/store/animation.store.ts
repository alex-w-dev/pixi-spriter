import { IAnimation } from "./sprite-sheet.store";
import { makeAutoObservable } from "mobx";

export class AnimationStore {
  activeAnimation?: IAnimation;

  constructor() {
    makeAutoObservable(this);
  }

  setActiveAnimation(animation?: IAnimation): void {
    this.activeAnimation = animation;
  }
}
export const animationStore = new AnimationStore();
