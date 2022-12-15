import { PopupStore } from "../../store/popup.store";
import { InputGif } from "./input.gif";

export function InputGifButton() {
  return (
    <>
      <input
        type="button"
        value="Gif Loader"
        onClick={() => PopupStore.open(<InputGif />)}
      />
    </>
  );
}
