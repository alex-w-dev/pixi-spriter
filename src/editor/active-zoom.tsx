import React, { PropsWithChildren, RefObject } from "react";

export class ActiveZoom extends React.Component<PropsWithChildren> {
  myRef: RefObject<HTMLDivElement> = React.createRef();
  state = {
    zoom: 1,
  };

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
      this.setState({
        zoom: this.state.zoom + e.deltaY / 1000,
      });
    }
  };

  render() {
    return (
      <div
        ref={this.myRef}
        style={{ zoom: this.state.zoom }}
        onWheel={(e) => {}}
      >
        {this.props.children}
      </div>
    );
  }

  // ...
}
