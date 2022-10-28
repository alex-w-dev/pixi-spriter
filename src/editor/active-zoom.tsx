import React, { PropsWithChildren, RefObject } from "react";
import { observer, Observer } from "mobx-react";
import { editorStateStore } from "../store/editor-state.store";

@observer
export class ActiveZoom extends React.Component<PropsWithChildren> {
  myRef: RefObject<HTMLDivElement> = React.createRef();

  componentDidMount() {
    // IMPORTANT: notice the `passive: false` option
    this.myRef.current?.addEventListener("wheel", this.handleWheel, {
      passive: false,
    });
  }

  componentWillUnmount() {
    this.myRef.current?.removeEventListener("wheel", this.handleWheel);
  }

  handleWheel = (e: WheelEvent) => {
    if (e.altKey || e.ctrlKey) {
      e.stopPropagation();
      e.preventDefault();
      editorStateStore.setZoom(editorStateStore.zoom - e.deltaY / 1000);
    }
  };

  render() {
    return (
      <div
        ref={this.myRef}
        style={{ zoom: editorStateStore.zoom }}
        onWheel={(e) => {}}
      >
        {this.props.children}
      </div>
    );
  }

  // ...
}
