import React, { useRef } from "react";
import { observer } from "mobx-react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  white-space: nowrap;
`;

export const InZoom: React.FC<{ children: JSX.Element; width: number }> =
  observer(({ children, width }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    let zoom = 1;

    if (containerRef.current) {
      const clientRect = containerRef.current.getBoundingClientRect();
      if (clientRect.width < width) {
        zoom = clientRect.width / width;
      }
    }

    return (
      <Container ref={containerRef}>
        <div
          style={{
            zoom,
            width: `${width}px`,
          }}
        >
          {children}
        </div>
      </Container>
    );
  });
