import React from "react";
import "./App.css";
import { InputImage } from "./editor/input-image";
import { ImageList } from "./editor/image-list";

function App() {
  return (
    <div className="App">
      <InputImage />
      <ImageList />
    </div>
  );
}

export default App;
