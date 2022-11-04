import { IFrame, spriteSheetStore } from "../store/sprite-sheet.store";
import merger from "texture-merger";
import { downloadBlob } from "./download-blob";

let exported = false;

export async function exportSpriteSheet() {
  if (!spriteSheetStore.allImagesInOne) {
    return;
  }

  if (exported) {
    return alert("This is bug, please reload page, and then try export again");
  } else {
    exported = true;
  }

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const sprites: { imgSrc: string; imgData: string; frame: IFrame }[] =
    await Promise.all(
      spriteSheetStore.frames.map((frame) => {
        return (async () => {
          canvas.width = frame.w;
          canvas.height = frame.h;
          context!.drawImage(
            spriteSheetStore.allImagesInOne!.img,
            -frame.x,
            -frame.y
          );
          const imgData = canvas.toDataURL();

          return {
            imgSrc: URL.createObjectURL(await (await fetch(imgData)).blob()),
            imgData: imgData,
            frame,
          };
        })();
      })
    );

  console.log(sprites.length, "sprites");
  console.log(sprites, "sprites");

  /*  const frame = spriteSheetStore.frames[0];

  canvas.width = frame.w;
  canvas.height = frame.h;
  context!.drawImage(spriteSheetStore.allImagesInOne!.img, -frame.x, -frame.y);

  setTimeout(() => {
    console.log(canvas.toDataURL(), "canvas.toDataURL()");
  }, 1000);*/

  var merged = await merger(
    sprites.map((s) => s.imgSrc),
    2,
    2
  );

  // take just one, and fix missing sprites
  const mergedOne = merged
    .reverse()
    // and fix missing sprites
    .find((m) => m.layout.length === sprites.length);

  console.log(mergedOne, "merged");
  console.log(
    spriteSheetStore.getPixiSpriteSheetJsonData(),
    "spriteSheetStore.spriteSheet"
  );

  const spriteSheetJson = spriteSheetStore.getPixiSpriteSheetJsonData();
  Object.entries(spriteSheetJson.frames).forEach(([frameName, frameData]) => {
    const frameSprite = sprites.find(
      (s) =>
        s.frame.x === frameData.frame.x &&
        s.frame.y === frameData.frame.y &&
        s.frame.w === frameData.frame.w &&
        s.frame.h === frameData.frame.h
    );
    const neeFramePosition = mergedOne!.layout.find(
      (l) => l.image.src === frameSprite!.imgSrc
    );

    if (!neeFramePosition) {
      throw new Error("Something wrong: cannot find merged frame data");
    }

    frameData.frame.x = neeFramePosition.x;
    frameData.frame.y = neeFramePosition.y;
  });
  const imageName = spriteSheetStore.currentProject.name + ".png";
  spriteSheetJson.meta.image = imageName;

  console.log(imageName, "imageName");

  downloadBlob(mergedOne!.blob, imageName);
  var jsonBlob = new Blob([JSON.stringify(spriteSheetJson, null, 2)], {
    type: "text/plain",
  });
  downloadBlob(jsonBlob, spriteSheetStore.currentProject.name + ".json");

  // merged.map((m) => {
  //   downloadBlob(m.blob, m.key + ".png");
  // });
}
