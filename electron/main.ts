import { app, BrowserWindow, ipcMain, ipcRenderer } from "electron";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";
import { exec } from "child_process";
import path from "path";
import os from "os";
import fs from "fs";
import { exec } from "child_process";

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
    titleBarStyle: "hiddenInset",
  });

  if (process.env.NODE_ENV === "development") {
    win.loadURL("http://localhost:5173");
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Window control operations
ipcMain.handle("window:minimize", () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) win.minimize();
});

ipcMain.handle("window:maximize", () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
  }
});

ipcMain.handle("window:close", () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) win.close();
});

// File system operations
ipcMain.handle("fs:pwd", async () => {
  return process.cwd();
});

ipcMain.handle("fs:ls", async (_, dirPath?: string) => {
  const targetPath = dirPath || process.cwd();
  return fs.readdirSync(targetPath);
});

ipcMain.handle("fs:cd", async (_, dirPath: string) => {
  try {
    process.chdir(dirPath);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle("fs:cat", async (_, filePath: string) => {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    return { success: true, data: content };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle("fs:mkdir", async (_, dirPath: string) => {
  try {
    fs.mkdirSync(dirPath, { recursive: true });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle("fs:touch", async (_, filePath: string) => {
  try {
    fs.writeFileSync(filePath, "");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle(
  "fs:rm",
  async (_, filePath: string, options?: { recursive?: boolean }) => {
    try {
      fs.rmSync(filePath, { recursive: options?.recursive || false });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
);

ipcMain.handle("fs:cp", async (_, src: string, dest: string) => {
  try {
    fs.copyFileSync(src, dest);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle("fs:mv", async (_, src: string, dest: string) => {
  try {
    fs.renameSync(src, dest);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle("system:computerName", async () => {
  return os.hostname();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
