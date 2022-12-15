import React, { ChangeEvent, useRef, useState } from "react";
import { spriteSheetStore } from "../../store/sprite-sheet.store";
import styled from "styled-components";

const GifEditorContainer = styled.div`
  position: relative;
`;
const GifEditorCross = styled.div`
  position: absolute;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: -9px;
  width: 17px;
  height: 17px;
  font-size: 12px;
  line-height: 17px;
  background: rgba(255, 255, 255, 0.4);
  border: 0.5px solid black;
  font-weight: 100;

  :before,
  :after {
    display: block;
    content: "";
    position: absolute;
    left: 8px;
    top: 8px;
    width: 1px;
    margin-top: -40px;
    height: 80px;
    background-color: rgba(0, 0, 0, 0.5);
  }
  :after {
    height: 1px;
    margin-top: 0;
    margin-left: -40px;
    width: 80px;
  }
`;

function onImport(src: string, anchorX: number, anchorY: number) {}

function GifEditor({ src }: { src: string }) {
  const [down, setDown] = useState(false);
  const [anchorLeft, setAnchorLeft] = useState(1);
  const [anchorTop, setAnchorTop] = useState(1);
  const [lastClientX, setLastClientX] = useState(0);
  const [lastClientY, setLastClientY] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);

  return (
    <GifEditorContainer
      onMouseLeave={() => setDown(false)}
      onMouseUp={() => setDown(false)}
      onMouseMove={(e) => {
        if (down) {
          setAnchorLeft(
            Math.max(
              0,
              Math.min(
                anchorLeft + (e.clientX - lastClientX),
                imageRef.current!.width - 1 || 0
              )
            )
          );
          setAnchorTop(
            Math.max(
              0,
              Math.min(
                anchorTop + (e.clientY - lastClientY),
                imageRef.current!.height - 1 || 0
              )
            )
          );

          setLastClientX(e.clientX);
          setLastClientY(e.clientY);
        }
      }}
    >
      <div>
        <img src={src} alt="" ref={imageRef} />
      </div>
      <GifEditorCross
        style={{
          left: `${anchorLeft}px`,
          top: `${anchorTop}px`,
        }}
        onMouseDown={(e) => {
          setLastClientX(e.clientX);
          setLastClientY(e.clientY);
          setDown(true);
        }}
      />
      <input
        type="button"
        value="Import!"
        onClick={() => onImport(src, anchorLeft, anchorTop)}
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

  return (
    <div>
      {src ? (
        <>
          <GifEditor src={src} />
          <hr />
        </>
      ) : null}

      <input type="file" accept=".gif" onChange={onFileChange} />
    </div>
  );
}
