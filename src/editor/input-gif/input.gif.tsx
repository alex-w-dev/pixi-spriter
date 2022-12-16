import React, { ChangeEvent, useRef, useState } from "react";
import { IFrame, spriteSheetStore } from "../../store/sprite-sheet.store";
import styled from "styled-components";
import { GIF } from "../../utils/gif";
import { FrameEditor } from "../frame-editor";
import { makeAutoObservable } from "mobx";

const GifEditorContainer = styled.div`
  position: relative;
`;

function onImport(src: string, frame: IFrame) {
  var myGif = GIF();
  myGif.load(src);
  /** @link https://stackoverflow.com/questions/48234696/how-to-put-a-gif-with-canvas */
  myGif.onload = console.log as any;
}

function GifEditor({ src }: { src: string }) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [frame] = useState(
    makeAutoObservable<IFrame>({
      x: 0,
      w: 10,
      name: "",
      h: 10,
      y: 0,
      anchor: {
        x: 5,
        y: 5,
      },
    })
  );

  return (
    <GifEditorContainer>
      <div>
        <img src={src} alt="" ref={imageRef} />
      </div>
      <FrameEditor frame={frame} />
      <input
        type="button"
        value="Import!"
        onClick={() => onImport(src, frame)}
      />
    </GifEditorContainer>
  );
}

export function InputGif() {
  const [src, setSrc] = useState("");

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];
    const fileReader = new FileReader();

    fileReader.addEventListener("load", function (evt) {
      const src = (evt.target!.result || "").toString();
      setSrc(src);
    });

    fileReader.readAsDataURL(file);
  }

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    setSrc(e.target.value);
  }

  return (
    <div>
      {src ? (
        <>
          <GifEditor src={src} />
          <hr />
        </>
      ) : null}
      {/*<input type="text" value={src} onChange={onInputChange} /> CORS*/}
      <input type="file" accept=".gif" onChange={onFileChange} />
    </div>
  );
}
