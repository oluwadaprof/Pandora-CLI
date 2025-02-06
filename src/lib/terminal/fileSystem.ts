export interface FileSystemResponse {
  success: boolean;
  data?: any;
  error?: string;
}

// Mock implementation for browser environment
const mockFs = {
  pwd: async (): Promise<string> => "/home/user",
  ls: async (): Promise<string[]> => ["file1.txt", "file2.txt", "dir1", "dir2"],
  cd: async (): Promise<FileSystemResponse> => ({ success: true }),
  cat: async (): Promise<FileSystemResponse> => ({
    success: true,
    data: "File contents would appear here",
  }),
  mkdir: async (): Promise<FileSystemResponse> => ({ success: true }),
  touch: async (): Promise<FileSystemResponse> => ({ success: true }),
  rm: async (): Promise<FileSystemResponse> => ({ success: true }),
  cp: async (): Promise<FileSystemResponse> => ({ success: true }),
  mv: async (): Promise<FileSystemResponse> => ({ success: true }),
  getComputerName: async (): Promise<string> => "Browser",
};

// Real implementation for Electron environment
const electronFs = () => {
  const { ipcRenderer } = (window as any).require("electron");

  return {
    pwd: async (): Promise<string> => {
      return await ipcRenderer.invoke("fs:pwd");
    },
    ls: async (path?: string): Promise<string[]> => {
      return await ipcRenderer.invoke("fs:ls", path);
    },
    cd: async (path: string): Promise<FileSystemResponse> => {
      return await ipcRenderer.invoke("fs:cd", path);
    },
    cat: async (path: string): Promise<FileSystemResponse> => {
      return await ipcRenderer.invoke("fs:cat", path);
    },
    mkdir: async (path: string): Promise<FileSystemResponse> => {
      return await ipcRenderer.invoke("fs:mkdir", path);
    },
    touch: async (path: string): Promise<FileSystemResponse> => {
      return await ipcRenderer.invoke("fs:touch", path);
    },
    rm: async (
      path: string,
      options?: { recursive?: boolean },
    ): Promise<FileSystemResponse> => {
      return await ipcRenderer.invoke("fs:rm", path, options);
    },
    cp: async (src: string, dest: string): Promise<FileSystemResponse> => {
      return await ipcRenderer.invoke("fs:cp", src, dest);
    },
    mv: async (src: string, dest: string): Promise<FileSystemResponse> => {
      return await ipcRenderer.invoke("fs:mv", src, dest);
    },
    getComputerName: async (): Promise<string> => {
      return await ipcRenderer.invoke("system:computerName");
    },
  };
};

// Determine if we're in Electron
const isElectron = () => {
  try {
    return (
      window && (window as any).require && (window as any).require("electron")
    );
  } catch {
    return false;
  }
};

// Export the appropriate implementation
export const fs = isElectron() ? electronFs() : mockFs;
