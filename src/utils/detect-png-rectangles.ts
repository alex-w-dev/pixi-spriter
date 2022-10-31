type Rect = {
  x: number;
  y: number;
  w: number;
  h: number;
};

class PngRectDetector {
  private img: HTMLImageElement;
  private width = 0;
  private height = 0;
  private canvas = document.createElement("canvas");
  private ctx = this.canvas.getContext("2d")!;
  private imgData: Uint8ClampedArray = new Uint8ClampedArray();
  private imgLoaded = false;
  private imageLoadingPromiseRes?: (value: unknown) => void;
  private imageLoadingPromise = new Promise(
    (res) => (this.imageLoadingPromiseRes = res)
  );
  private blackList: { [x: number]: { [y: number]: true } } = {};

  constructor(public src: string) {
    this.img = new Image();
    this.img.src = src;
    this.img.onload = () => {
      this.width = this.img.naturalWidth;
      this.height = this.img.naturalHeight;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.ctx.drawImage(this.img, 0, 0, this.width, this.height);
      this.imgData = this.ctx.getImageData(0, 0, this.width, this.height).data;
      this.imgLoaded = true;
      this.imageLoadingPromiseRes!(null);
    };
  }

  async detectRectangles(): Promise<Rect[]> {
    await this.imageLoadingPromise.then(() => Promise.resolve());

    const rects: Rect[] = [];

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.isPointInBlackList(x, y)) {
          continue;
        }

        if (!this.isPointTransparent(x, y)) {
          const rect = this.growRectFromPoint(x, y);
          rects.push(rect);
          this.addRectPointToBlackList(rect);
        }
      }
    }

    return rects;
  }

  private addRectPointToBlackList(rect: Rect): void {
    for (let x0 = 0; x0 < rect.w; x0++) {
      const x = rect.x + x0;
      if (!this.blackList[x]) {
        this.blackList[x] = {};
      }
      for (let y0 = 0; y0 < rect.h; y0++) {
        this.blackList[x][rect.y + y0] = true;
      }
    }
  }

  private isPointInBlackList(x: number, y: number): boolean {
    return !!this.blackList[x]?.[y];
  }

  private isPointTransparent(x: number, y: number): boolean {
    const pointData = this.getColorDataAtPoint(x, y);

    return !pointData[3];
  }

  private getColorDataAtPoint(x: number, y: number): Uint8ClampedArray {
    return this.ctx.getImageData(x, y, 1, 1).data;
  }

  private growRectFromPoint(x: number, y: number): Rect {
    const rect: Rect = {
      x,
      y,
      w: 1,
      h: 1,
    };

    return this.growRect(rect);
  }

  private growRect(rect: Rect): Rect {
    if (this.hasSideColorizedPoints(rect, "b")) {
      rect.h++;

      return this.growRect(rect);
    }

    if (this.hasSideColorizedPoints(rect, "r")) {
      rect.w++;

      return this.growRect(rect);
    }

    if (this.hasSideColorizedPoints(rect, "t")) {
      rect.h++;
      rect.y--;

      return this.growRect(rect);
    }

    if (this.hasSideColorizedPoints(rect, "l")) {
      rect.w++;
      rect.x--;

      return this.growRect(rect);
    }

    rect.x++;
    rect.y++;
    rect.w -= 2;
    rect.h -= 2;

    return rect;
  }

  private hasSideColorizedPoints(
    rect: Rect,
    side: "l" | "t" | "r" | "b"
  ): boolean {
    switch (side) {
      case "l":
        return new Array(rect.h)
          .fill(null)
          .some((n, y0) => !this.isPointTransparent(rect.x, rect.y + y0));
      case "r":
        return new Array(rect.h)
          .fill(null)
          .some(
            (n, y0) =>
              !this.isPointTransparent(rect.x + rect.w - 1, rect.y + y0)
          );
      case "t":
        return new Array(rect.w)
          .fill(null)
          .some((n, x0) => !this.isPointTransparent(rect.x + x0, rect.y));
      case "b":
        return new Array(rect.w)
          .fill(null)
          .some(
            (n, x0) =>
              !this.isPointTransparent(rect.x + x0, rect.y + rect.h - 1)
          );
    }
  }
}

export function detectPngRectangles(src: string): Promise<Rect[]> {
  return new PngRectDetector(src).detectRectangles();
}
