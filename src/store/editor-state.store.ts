import { makeAutoObservable } from "mobx";

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
