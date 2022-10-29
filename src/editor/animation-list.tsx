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
          onTitleClick={() => spriteSheetStore.setActiveAnimation(animation)}
          title={animation.name}
          onDeleteClick={() => {
            // eslint-disable-next-line no-restricted-globals
            if (confirm("Delete?")) {
              spriteSheetStore.removeAnimation(animation);
            }
          }}
        />
      ))}
    </div>
  );
});
