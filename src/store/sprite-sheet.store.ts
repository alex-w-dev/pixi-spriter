import { makeAutoObservable } from "mobx";

export class SpriteSheetStore {
  images: string[]; // base64 images

  constructor() {
    makeAutoObservable(this);

    this.images = [];
  }

  addImage(image: string) {
    this.images.push(image);
  }
}
export const spiteSheetStore = new SpriteSheetStore();
