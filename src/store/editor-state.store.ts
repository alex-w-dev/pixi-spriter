import { makeAutoObservable } from "mobx";
import { spriteSheetStore } from "./sprite-sheet.store";

export class EditorStateStore {
  zoom = 1;

  constructor() {
    makeAutoObservable(this);
  }

  setZoom(zoom: number): void {
    this.zoom = zoom;
  }
}
export const editorStateStore = new EditorStateStore();
