import { app, BrowserWindow, ipcMain, session, dialog } from "electron";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";
import { exec } from "child_process";
import { setupPermissionHandlers } from "../src/lib/permissions";

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: true,
      allowRunningInsecureContent: false,
      enableRemoteModule: true,
      permissions: [
        "clipboard-read",
        "clipboard-sanitized-write",
        "media",
        "display-capture",
        "mediaKeySystem",
        "geolocation",
        "notifications",
        "midi",
        "midiSysex",
        "pointerLock",
        "fullscreen",
        "openExternal",
      ],
    },
    titleBarStyle: "hiddenInset",
  });

  // Set up CSP
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [
          "default-src 'self' https: http: data: 'unsafe-inline' 'unsafe-eval';",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval';",
          "style-src 'self' 'unsafe-inline';",
          "img-src 'self' data: https: http:;",
          "connect-src 'self' https: http: ws: wss:;",
        ],
      },
    });
  });

  // Set up permission handlers
  setupPermissionHandlers(mainWindow);

  // Handle file system permissions
  mainWindow.webContents.session.setPermissionRequestHandler(
    (webContents, permission, callback) => {
      const allowedPermissions = [
        "media",
        "display-capture",
        "mediaKeySystem",
        "geolocation",
        "notifications",
        "midi",
        "midiSysex",
        "pointerLock",
        "fullscreen",
        "openExternal",
      ];

      if (allowedPermissions.includes(permission)) {
        callback(true);
      } else {
        dialog
          .showMessageBox(mainWindow!, {
            type: "question",
            buttons: ["Allow", "Deny"],
            message: `The application is requesting ${permission} permission`,
            detail: "Do you want to allow this?",
          })
          .then(({ response }) => {
            callback(response === 0);
          });
      }
    },
  );

  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  // File system operations
  ipcMain.handle("fs:pwd", async () => process.cwd());
  ipcMain.handle("fs:ls", async (_, dirPath?: string) => {
    const targetPath = dirPath || process.cwd();
    return fs.readdirSync(targetPath);
  });
  ipcMain.handle("fs:cd", async (_, dirPath: string) => {
    try {
      process.chdir(dirPath);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  // System information
  ipcMain.handle("system:computerName", async () => os.hostname());

  // Network operations
  ipcMain.handle("net:request", async (_, url: string) => {
    try {
      const response = await fetch(url);
      return { success: true, data: await response.text() };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  // Process management
  ipcMain.handle("process:execute", async (_, command: string) => {
    try {
      const { stdout, stderr } = await exec(command);
      return { success: true, stdout, stderr };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  // Window control operations
  ipcMain.handle("window:minimize", () => mainWindow?.minimize());
  ipcMain.handle("window:maximize", () => {
    if (mainWindow?.isMaximized()) {
      mainWindow?.unmaximize();
    } else {
      mainWindow?.maximize();
    }
  });
  ipcMain.handle("window:close", () => mainWindow?.close());
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle permission requests for file system operations
app.on("will-finish-launching", () => {
  app.on("open-file", (event, path) => {
    event.preventDefault();
    if (mainWindow) {
      mainWindow.webContents.send("file-opened", path);
    }
  });
});

// Handle permission requests for network operations
app.on(
  "certificate-error",
  (event, webContents, url, error, certificate, callback) => {
    event.preventDefault();
    callback(true);
  },
);

// Handle Squirrel events for Windows installer
if (require("electron-squirrel-startup")) app.quit();
