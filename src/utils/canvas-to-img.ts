export function canvasToImg(
  canvas: HTMLCanvasElement
): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const src = canvas.toDataURL("image/png");
    const img = new Image();
    img.src = src;
    img.onload = () => {
      res(img);
    };
    img.onerror = rej;
  });
}
