import styled from "styled-components";
import React, { KeyboardEventHandler } from "react";

export const Container = styled.div<{
  active: boolean;
  error: boolean;
  selected?: boolean;
}>`
  border: 1px solid
    ${(props) => (props.error ? "red" : props.active ? "blue" : "white")};
  display: flex;
  align-items: center;
  background-color: ${(props) => (props.selected ? "#d3edff" : "transparent")};
  outline: none;

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

export const ListItem: React.FC<{
  onDeleteClick: () => void;
  title: string;
  onTitleClick: () => void;
  active: boolean;
  error: boolean;
  onKeyDown?: KeyboardEventHandler<HTMLDivElement>;
  selected?: boolean;
}> = ({
  onTitleClick,
  onDeleteClick,
  active,
  error,
  title,
  selected,
  onKeyDown,
}) => {
  return (
    <Container
      active={active}
      error={error}
      selected={selected}
      onKeyDown={onKeyDown}
      tabIndex={1}
    >
      <div className="title" onClick={onTitleClick}>
        {title}
      </div>
      <div className="delete" onClick={onDeleteClick} />
    </Container>
  );
};
