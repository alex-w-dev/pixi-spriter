import styled from "styled-components";
import { ReactNode } from "react";
import React from "react";
import { BehaviorSubject, Subscription } from "rxjs";

export class PopupStore {
  static history = new BehaviorSubject<{ el: ReactNode }[]>([]);
  static open(el: ReactNode): void {
    // this.history.next([...this.history.value, { el }]); // TODO check history useless
    this.history.next([{ el }]);
  }
  static closeCurrent(): void {
    if (this.history.value.length) {
      const temp = [...this.history.value];
      temp.length--;
      this.history.next(temp);
    }
  }
}

const PopupBackground = styled.div`
  left: 0;
  top: 0;
  display: flex;
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
`;
const PopupContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  background-color: white;
  width: 100vw;
  height: 100vh;
`;
const PopupContent = styled.div`
  width: 100%;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const PopupHeader = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 50px;
  position: relative;
  height: 50px;
`;
const PopupTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const PopupClose = styled.div`
  width: 50px;
  position: relative;
  height: 50px;
  background-color: goldenrod;
`;

export class PopupProvider extends React.Component<any, any> {
  private subscription?: Subscription;

  componentDidMount(): void {
    this.subscription = PopupStore.history.subscribe(() => this.forceUpdate());
  }

  componentWillUnmount(): void {
    this.subscription?.unsubscribe();
  }

  render(): ReactNode {
    if (!PopupStore.history.value.length) {
      return null;
    }

    const toRender =
      PopupStore.history.value[PopupStore.history.value.length - 1];

    return (
      <>
        <PopupBackground onClick={() => PopupStore.closeCurrent()} />
        <PopupContainer>
          <PopupHeader>
            <PopupTitle>Popup</PopupTitle>
            <PopupClose onClick={() => PopupStore.closeCurrent()} />
          </PopupHeader>
          <PopupContent>{toRender.el}</PopupContent>
        </PopupContainer>
      </>
    );
  }
}
