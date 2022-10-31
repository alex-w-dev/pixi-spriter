import React from "react";
import "./App.css";
import { InputImage } from "./editor/input-image";
import { FrameList } from "./editor/frame-list";
import styled from "styled-components";
import { ActiveFrame } from "./editor/active-frame";
import { AddFrameButton } from "./editor/add-frame-button";
import { AllImagesInOne } from "./editor/all-images-in-one";
import { EditorFrameList } from "./editor/editor-frame-list";
import { ActiveAnimation } from "./editor/active-animation";
import { AnimationList } from "./editor/animation-list";
import { AddAnimationButton } from "./editor/add-animation-button";
import { ActiveZoom } from "./editor/active-zoom";
import { ImageList } from "./editor/image-list";

const headerHeight = "50px";
const framesWidth = "204px";

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
  width: calc(100% - ${framesWidth} - ${framesWidth});
  overflow: auto;
`;
const FramesContainer = styled.div`
  height: 100%;
  width: ${framesWidth};
  overflow: auto;
`;
const AnimationsContainer = styled.div`
  height: 100%;
  width: ${framesWidth};
  overflow: auto;
`;

function App() {
  return (
    <Container>
      <Header>
        <AddFrameButton />
        <AddAnimationButton />
      </Header>
      <Content>
        <CanvasContainer>
          <ActiveZoom>
            <AllImagesInOne />
            <EditorFrameList />
          </ActiveZoom>
          <ImageList />
          <InputImage />
        </CanvasContainer>
        <FramesContainer>
          <ActiveFrame />
          <FrameList />
        </FramesContainer>
        <AnimationsContainer>
          <ActiveAnimation />
          <AnimationList />
        </AnimationsContainer>
      </Content>
    </Container>
  );
}

export default App;
