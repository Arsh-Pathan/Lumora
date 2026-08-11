/**
 * LUMORA Electron Preload IPC Bridge
 */

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("lumoraElectron", {
  getDisplays: () => ipcRenderer.invoke("get-displays"),
  openProjectorWindow: (displayId: number) => ipcRenderer.invoke("open-projector-window", displayId),
  closeProjectorWindow: () => ipcRenderer.invoke("close-projector-window"),
  onProjectorClosed: (callback: () => void) => ipcRenderer.on("projector-window-closed", callback)
});
