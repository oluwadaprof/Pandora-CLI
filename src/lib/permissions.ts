import { ipcMain, dialog } from "electron";

export interface PermissionRequest {
  type: "fileSystem" | "network" | "process";
  detail: string;
}

export const setupPermissionHandlers = (mainWindow: Electron.BrowserWindow) => {
  ipcMain.handle(
    "request-permission",
    async (_, request: PermissionRequest) => {
      const { type, detail } = request;

      const response = await dialog.showMessageBox(mainWindow, {
        type: "question",
        buttons: ["Allow", "Deny"],
        defaultId: 1,
        title: "Permission Request",
        message: `The terminal is requesting ${type} permission`,
        detail: `Action: ${detail}\nDo you want to allow this operation?`,
        checkboxLabel: "Remember my choice",
        checkboxChecked: false,
      });

      return {
        granted: response.response === 0,
        remember: response.checkboxChecked,
      };
    },
  );
};
