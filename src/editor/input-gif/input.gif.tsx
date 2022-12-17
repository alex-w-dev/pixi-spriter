import React, { ChangeEvent, useRef, useState } from "react";
import { IFrame, spriteSheetStore } from "../../store/sprite-sheet.store";
import styled from "styled-components";
import { GIF } from "../../utils/gif";
import { FrameEditor } from "../frame-editor";
import { makeAutoObservable, runInAction, toJS } from "mobx";
import { canvasToImg } from "../../utils/canvas-to-img";
import { ActiveFrame } from "../active-frame";

const GifEditorContainer = styled.div`
  position: relative;
`;

function onImport(
  src: string,
  fileName: string,
  frame: IFrame,
  excludeColors: string,
  pixelScale = 1
) {
  var myGif = GIF();
  myGif.load(src);
  /** @link https://stackoverflow.com/questions/48234696/how-to-put-a-gif-with-canvas */
  myGif.onload = ((result: any) => {
    console.log(result.path[0], "result.path[0]");
    const { frames, frameCount, width, height } = result.path[0];
    const resultCanvas = document.createElement("canvas");
    resultCanvas.width = (width * frameCount) / pixelScale;
    resultCanvas.height = height / pixelScale;
    const resultCtx2D = resultCanvas.getContext("2d")!;
    const resultFrames: IFrame[] = [];

    for (const frame1 of frames) {
      const { image: canvas } = frame1;
      const ctx = canvas.getContext("2d");

      if (excludeColors) {
        const excludeColorsArray = excludeColors.trim().split(",");

        for (const hash of excludeColorsArray) {
          const searchR = parseInt(hash.substring(0, 2), 16);
          const searchG = parseInt(hash.substring(2, 4), 16);
          const searchB = parseInt(hash.substring(4, 6), 16);
          const imgd = ctx.getImageData(0, 0, width, height);
          const pix = imgd.data;
          const newColor = { r: 0, g: 0, b: 0, a: 0 };

          for (var i = 0, n = pix.length; i < n; i += 4) {
            var r = pix[i],
              g = pix[i + 1],
              b = pix[i + 2];

            // If its white then change it
            if (r === searchR && g === searchG && b === searchB) {
              pix[i] = newColor.r;
              pix[i + 1] = newColor.g;
              pix[i + 2] = newColor.b;
              pix[i + 3] = newColor.a;
            }
          }

          ctx.putImageData(imgd, 0, 0);
        }
      }

      const conedCanvas = cloneCanvas(canvas, pixelScale);
      const clonedCtx = conedCanvas.getContext("2d")!;
      const resultImageData = clonedCtx.getImageData(
        0,
        0,
        conedCanvas.width,
        conedCanvas.height
      );
      const offsetX = frames.indexOf(frame1) * conedCanvas.width;
      const offsetY = spriteSheetStore.allImagesInOne?.h || 0;
      resultCtx2D.putImageData(resultImageData, offsetX, 0);

      const resultFrame = toJS(frame);
      resultFrame.x = resultFrame.x / pixelScale + offsetX;
      resultFrame.y = resultFrame.y / pixelScale + offsetY;
      resultFrame.h = resultFrame.h / pixelScale;
      resultFrame.w = resultFrame.w / pixelScale;
      resultFrame.anchor.x = Math.floor(resultFrame.anchor.x / pixelScale);
      resultFrame.anchor.y = Math.floor(resultFrame.anchor.y / pixelScale);
      resultFrame.name =
        fileName.replace(".gif", "") + "-" + (frames.indexOf(frame1) + 1);
      resultFrames.push(resultFrame);
    }

    canvasToImg(resultCanvas)
      .then((img) => {
        spriteSheetStore.addImage({
          img,
          name: fileName,
          src: img.src,
          h: resultCanvas.height,
          w: resultCanvas.width,
        });
        spriteSheetStore.addNewAnimation({
          name: fileName.replace(".gif", ""),
        });
        resultFrames.forEach((resFrame) => {
          spriteSheetStore.addNewFrame(resFrame);
          spriteSheetStore.addFrameToAnimation(
            spriteSheetStore.animations[spriteSheetStore.animations.length - 1],
            resFrame.name
          );
        });
      })
      .catch(console.error);
  }) as any;
}

function GifEditor({ src, fileName }: { src: string; fileName: string }) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [excludeColor, setExcludeColor] = useState("FFFFFF");
  const [pixelScale, setPixelScale] = useState(1);
  const [frame] = useState(
    makeAutoObservable<IFrame>({
      x: 10,
      w: 50,
      name: "Input Gif",
      h: 50,
      y: 10,
      anchor: {
        x: 25,
        y: 25,
      },
    })
  );

  return (
    <GifEditorContainer>
      <div style={{ display: "flex" }}>
        <img src={src} alt="" ref={imageRef} />
        <ActiveFrame />
      </div>
      <FrameEditor frame={frame} />
      <div>
        Exclude Color:{" "}
        <input
          type="text"
          value={excludeColor}
          onChange={(e) => setExcludeColor(e.target.value)}
        />
      </div>
      <div>
        Pixel Scale:{" "}
        <input
          type="number"
          step="1"
          value={pixelScale}
          onChange={(e) => setPixelScale(Number(e.target.value) || 1)}
        />
      </div>
      <input
        type="button"
        value="Import!"
        onClick={() => onImport(src, fileName, frame, excludeColor, pixelScale)}
      />
    </GifEditorContainer>
  );
}

export function InputGif() {
  const [src, setSrc] = useState("");
  const [fileName, setFilename] = useState("");

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.addEventListener("load", function (evt) {
      const src = (evt.target!.result || "").toString();
      setSrc(src);
      setFilename(file.name);
    });

    fileReader.readAsDataURL(file);
  }

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    setSrc(e.target.value);
  }

  return (
    <div>
      {src ? (
        <>
          <GifEditor src={src} fileName={fileName} />
          <hr />
        </>
      ) : null}
      {/*<input type="text" value={src} onChange={onInputChange} /> CORS*/}
      <input type="file" accept=".gif" onChange={onFileChange} />
    </div>
  );
}

function cloneCanvas(
  oldCanvas: HTMLCanvasElement,
  pixelScale = 1
): HTMLCanvasElement {
  //create a new canvas
  var newCanvas = document.createElement("canvas");
  var context = newCanvas.getContext("2d")!;

  //set dimensions
  newCanvas.width = oldCanvas.width / pixelScale;
  newCanvas.height = oldCanvas.height / pixelScale;

  //apply the old canvas to the new one
  context.drawImage(
    oldCanvas,
    0,
    0,
    oldCanvas.width,
    oldCanvas.height,
    0,
    0,
    newCanvas.width,
    newCanvas.height
  );

  //return the new canvas
  return newCanvas;
}
