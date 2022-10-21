import React, { ChangeEvent } from "react";
import { observer } from "mobx-react";
import { spiteSheetStore } from "../store/sprite-sheet.store";

export const ImageList: React.FC = observer(() => {
  return (
    <div>
      {spiteSheetStore.images.map((img, index) => (
        <img src={img} key={index} />
      ))}
    </div>
  );
});
