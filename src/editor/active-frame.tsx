import React from "react";
import { observer } from "mobx-react";
import { spriteSheetStore } from "../store/sprite-sheet.store";
import styled from "styled-components";

const EmptyContainer = styled.div`
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Container = styled.div`
  width: 100%;
`;

export const ActiveFrame: React.FC = observer(() => {
  if (!spriteSheetStore.activeFrame) {
    return <EmptyContainer>No active frame</EmptyContainer>;
  }

  const frame = spriteSheetStore.activeFrame;

  return (
    <Container>
      <div
        style={{
          width: `${frame.w}px`,
          height: `${frame.h}px`,
          backgroundImage: `url(${spriteSheetStore.allImagesInOne?.src})`,
          backgroundPosition: `${-frame.x}px ${-frame.y}px`,
        }}
      />
      <div>
        <table>
          <tbody>
            <tr>
              <td colSpan={2}>Name:</td>
              <td colSpan={2}>
                <input
                  type="text"
                  step="1"
                  value={frame.name}
                  onChange={(e) =>
                    spriteSheetStore.frameUpdateTool(() => {
                      frame.name = e.target.value;
                    })
                  }
                />
              </td>
            </tr>
            <tr>
              <td>w:</td>
              <td>
                <input
                  type="number"
                  step="1"
                  value={frame.w}
                  onChange={(e) =>
                    spriteSheetStore.frameUpdateTool(() => {
                      frame.w = +e.target.value;
                    })
                  }
                />
              </td>
              <td>h:</td>
              <td>
                <input
                  type="number"
                  step="1"
                  value={frame.h}
                  onChange={(e) =>
                    spriteSheetStore.frameUpdateTool(() => {
                      frame.h = +e.target.value;
                    })
                  }
                />
              </td>
            </tr>
            <tr>
              <td>x:</td>
              <td>
                <input
                  type="number"
                  step="1"
                  value={frame.x}
                  onChange={(e) =>
                    spriteSheetStore.frameUpdateTool(() => {
                      frame.x = +e.target.value;
                    })
                  }
                />
              </td>
              <td>y:</td>
              <td>
                <input
                  type="number"
                  step="1"
                  value={frame.y}
                  onChange={(e) =>
                    spriteSheetStore.frameUpdateTool(() => {
                      frame.y = +e.target.value;
                    })
                  }
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Container>
  );
});
