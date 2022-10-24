import React, { ChangeEvent } from "react";
import { spriteSheetStore } from "../store/sprite-sheet.store";

function onFileChange(e: ChangeEvent<HTMLInputElement>) {
  for (const file of Array.from(e.target.files || [])) {
    // const objectUrl = URL.createObjectURL(file);

    const fileReader = new FileReader();

    fileReader.addEventListener("load", function (evt) {
      const src = (evt.target!.result || "").toString();
      const img = new Image();

      img.src = src;
      img.onload = () => {
        spriteSheetStore.addImage({
          name: file.name,
          src,
          h: img.naturalHeight,
          w: img.naturalWidth,
        });
      };
    });

    fileReader.readAsDataURL(file);
  }
}

export const InputImage: React.FC = () => {
  return (
    <div>
      <input type="file" accept=".png" onChange={onFileChange} />
    </div>
  );
};
