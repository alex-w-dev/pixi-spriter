import React from "react";
import { observer } from "mobx-react";
import { spriteSheetStore } from "../store/sprite-sheet.store";
import styled from "styled-components";

const Container = styled.div`
  justify-content: flex-start;
  align-items: flex-start;
  display: flex;
  flex-direction: column;
`;
const ImageFrame = styled.div`
  position: relative;
`;

export const ImageList: React.FC = observer(() => {
  return (
    <Container>
      {spriteSheetStore.images.map((img, index) => (
        <ImageFrame key={index}>
          {img.name}{" "}
          <button onClick={() => spriteSheetStore.removeImage(img)}>
            Remove
          </button>
        </ImageFrame>
      ))}
    </Container>
  );
});
