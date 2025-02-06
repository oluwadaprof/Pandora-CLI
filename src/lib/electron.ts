declare global {
  interface Window {
    electron: {
      minimize: () => void;
      maximize: () => void;
      close: () => void;
    };
  }
}

// Initialize electron window controls
if (typeof window !== "undefined" && window.require) {
  const { ipcRenderer } = window.require("electron");

  window.electron = {
    minimize: () => ipcRenderer.invoke("window:minimize"),
    maximize: () => ipcRenderer.invoke("window:maximize"),
    close: () => ipcRenderer.invoke("window:close"),
  };
}

export {};
