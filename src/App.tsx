import React from "react";
import "./App.css";
import { InputImage } from "./editor/input-image";
import { ImageList } from "./editor/image-list";
import { FrameList } from "./editor/frame-list";
import styled from "styled-components";
import { ActiveFrame } from "./editor/active-frame";
import { AddFrameButton } from "./editor/add-frame-button";
import { spriteSheetStore } from "./store/sprite-sheet.store";
import { FrameEditor } from "./editor/frame-editor";
import { AllImagesInOne } from "./editor/all-images-in-one";

const headerHeight = "50px";
const framesWidth = "400px";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
`;
const Header = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: ${headerHeight};
  display: flex;
  align-items: center;
`;
const Content = styled.div`
  position: absolute;
  display: flex;
  left: 0;
  top: ${headerHeight};
  width: 100%;
  height: calc(100vh - ${headerHeight});
`;
const CanvasContainer = styled.div`
  position: relative;
  height: 100%;
  width: calc(100% - ${framesWidth});
  overflow: auto;
`;
const FramesContainer = styled.div`
  height: 100%;
  width: ${framesWidth};
  overflow: auto;
`;

function App() {
  return (
    <Container>
      <Header>
        <AddFrameButton />
      </Header>
      <Content>
        <CanvasContainer>
          {/*<ImageList />*/}
          <AllImagesInOne />
          <InputImage />
          {spriteSheetStore.frames.map((frame) => (
            <FrameEditor frame={frame} key={frame.name} />
          ))}
        </CanvasContainer>
        <FramesContainer>
          <ActiveFrame />
          <FrameList />
        </FramesContainer>
      </Content>
    </Container>
  );
}

export default App;
