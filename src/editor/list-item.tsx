import styled from "styled-components";

export const ListItem = styled.div<{ active: boolean; error: boolean }>`
  border: 1px solid
    ${(props) => (props.error ? "red" : props.active ? "blue" : "white")};
  display: flex;
  align-items: center;

  .title {
    flex-grow: 1;
  }
  .delete {
    cursor: pointer;
    width: 16px;
    height: 16px;
    background: url(https://developer.mozilla.org/en-US/docs/Web/CSS/cursor/not-allowed.gif)
      no-repeat center;
    background-size: 100%;
  }
`;
