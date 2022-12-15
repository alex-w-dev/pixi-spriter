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
import { ActiveZoom } from "./support/active-zoom";
import { ImageList } from "./editor/image-list";
import { ExportSpriteSheetButton } from "./editor/project/export-sprite-sheet-button";
import { ProjectNameInput } from "./editor/project/project-name-input";
import { ProjectsSelect } from "./editor/project/projects-select";
import { CreateNewProjectButton } from "./editor/project/create-new-project-button";
import { PopupProvider } from "./store/popup.store";
import { InputGifButton } from "./editor/input-gif/input-gif-button";

const headerHeight = "60px";
const framesWidth = "260px";

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
  flex-direction: column;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid black;
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
  padding: 6px;
  width: ${framesWidth};
  overflow: auto;
`;
const AnimationsContainer = styled.div`
  height: 100%;
  padding: 6px;
  width: ${framesWidth};
  overflow: auto;
`;
const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;
const HeaderDown = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
`;
const Flex = styled.div`
  display: flex;
`;
const Hr = styled.hr`
  margin: 3px;
  height: 1px;
  padding: 0;
  background-color: aliceblue;
`;

function App() {
  return (
    <Container>
      <Header>
        <HeaderTop>
          <Flex>
            <CreateNewProjectButton />
            ...
            <label>
              <span>Chosen one:</span>
              <ProjectsSelect />
            </label>
          </Flex>
          <Flex>
            <ProjectNameInput />
            <ExportSpriteSheetButton />
          </Flex>
        </HeaderTop>
        <Hr />
        <HeaderDown>
          <AddFrameButton />
          <AddAnimationButton />
        </HeaderDown>
      </Header>
      <Content>
        <CanvasContainer>
          <ActiveZoom>
            <AllImagesInOne />
            <EditorFrameList />
          </ActiveZoom>
          <ImageList />
          <InputImage />
          <InputGifButton />
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
      <PopupProvider />
    </Container>
  );
}

export default App;
