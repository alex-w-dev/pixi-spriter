import React from "react";
import { observer } from "mobx-react";
import { spriteSheetStore } from "../store/sprite-sheet.store";
import { ListItem } from "./list-item";

export const AnimationList: React.FC = observer(() => {
  return (
    <div>
      {spriteSheetStore.animations.map((animation, index) => (
        <ListItem
          key={index}
          active={animation === spriteSheetStore.activeAnimation}
          error={
            spriteSheetStore.animations.filter((a) => a.name === animation.name)
              .length > 1
          }
        >
          <div
            className="title"
            onClick={() => spriteSheetStore.setActiveAnimation(animation)}
          >
            {animation.name}
          </div>

          <div
            className="delete"
            onClick={() => spriteSheetStore.removeAnimation(animation)}
          />
        </ListItem>
      ))}
    </div>
  );
});
