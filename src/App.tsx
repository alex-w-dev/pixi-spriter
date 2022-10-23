import React from "react";
import "./App.css";
import { InputImage } from "./editor/input-image";
import { ImageList } from "./editor/image-list";
import { FrameList } from "./editor/frame-list";
import styled from "styled-components";

const headerHeight = "100px";

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
  left: 0;
  top: ${headerHeight};
  height: calc(100vh - ${headerHeight});
  overflow: auto;
`;

function App() {
  return (
    <Container>
      <Header>
        <InputImage />
      </Header>
      <Content>
        <div className="editor">
          <ImageList />
        </div>
        <div className="frames">
          <FrameList />
        </div>
      </Content>
    </Container>
  );
}

export default App;
