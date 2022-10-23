import React, { ChangeEvent } from "react";
import { spiteSheetStore } from "../store/sprite-sheet.store";

function onFileChange(e: ChangeEvent<HTMLInputElement>) {
  for (const file of Array.from(e.target.files || [])) {
    // const objectUrl = URL.createObjectURL(file);

    const fileReader = new FileReader();

    fileReader.addEventListener("load", function (evt) {
      spiteSheetStore.addImage({
        name: file.name,
        src: (evt.target!.result || "").toString(),
      });
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
