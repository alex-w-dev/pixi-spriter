import React from "react";
import { PopupStore } from "../store/popup.store";
import { spriteSheetStore } from "../store/sprite-sheet.store";
import { downloadBlob } from "../utils/download-blob";

export const BackupWindow: React.FC = () => {
  return (
    <div>
      <button
        onClick={() => {
          const blob = new Blob(
            [JSON.stringify(spriteSheetStore.getAllJsonBackup(), null, 2)],
            {
              type: "application/json",
            }
          );
          downloadBlob(blob, "pixi-spriter-backup.json");
        }}
      >
        Download backup
      </button>
      <hr />
      Restore backup:{" "}
      <input
        type="file"
        accept=".json"
        onChange={(e) => {
          e.target.files![0].text().then((jsonText) => {
            if (window.confirm("Old data will be removed. Continue?")) {
              spriteSheetStore.setAllJsonBackup(JSON.parse(jsonText));
            }
          });
        }}
      />
    </div>
  );
};

export const BackupButton: React.FC = () => {
  return (
    <button
      onClick={() => {
        PopupStore.open(<BackupWindow />);
      }}
    >
      Backup
    </button>
  );
};
