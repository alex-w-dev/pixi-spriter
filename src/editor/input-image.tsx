import React, { ChangeEvent } from "react";
import { spiteSheetStore } from "../store/sprite-sheet.store";

function onFileChange(e: ChangeEvent<HTMLInputElement>) {
  for (const file of Array.from(e.target.files || [])) {
    const objectUrl = URL.createObjectURL(file);

    spiteSheetStore.addImage(objectUrl);
  }
}

export const InputImage: React.FC = () => {
  return (
    <div>
      <input type="file" accept=".png" onChange={onFileChange} />
    </div>
  );
};
