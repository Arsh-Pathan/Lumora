/**
 * LUMORA Electron Main Process — Display Detection & Multi-Window IPC Engine
 */

import { app, BrowserWindow, ipcMain, screen } from "electron";
import path from "path";

let mainWindow: BrowserWindow | null = null;
let projectorWindow: BrowserWindow | null = null;

function createEditorWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    minWidth: 1280,
    minHeight: 720,
    title: "LUMORA — Projection Mapping & Show Control",
    backgroundColor: "#030306",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
    if (projectorWindow) projectorWindow.close();
  });
}

function openProjectorOutputWindow(displayId: number) {
  const displays = screen.getAllDisplays();
  const targetDisplay = displays.find(d => d.id === displayId) || displays[1] || displays[0];

  if (projectorWindow) {
    projectorWindow.focus();
    return;
  }

  projectorWindow = new BrowserWindow({
    x: targetDisplay.bounds.x,
    y: targetDisplay.bounds.y,
    width: targetDisplay.bounds.width,
    height: targetDisplay.bounds.height,
    fullscreen: true,
    frame: false,
    autoHideMenuBar: true,
    backgroundColor: "#000000",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  const url = process.env.VITE_DEV_SERVER_URL
    ? `${process.env.VITE_DEV_SERVER_URL}#/projector`
    : `file://${path.join(__dirname, "../dist/index.html")}#/projector`;

  projectorWindow.loadURL(url);

  projectorWindow.on("closed", () => {
    projectorWindow = null;
    if (mainWindow) {
      mainWindow.webContents.send("projector-window-closed");
    }
  });
}

app.whenReady().then(() => {
  createEditorWindow();

  // IPC Handlers
  ipcMain.handle("get-displays", () => {
    return screen.getAllDisplays().map(d => ({
      id: d.id,
      name: `Display ${d.id} (${d.bounds.width}x${d.bounds.height})`,
      resolution: `${d.bounds.width}x${d.bounds.height}`,
      isPrimary: d.bounds.x === 0 && d.bounds.y === 0,
      bounds: d.bounds
    }));
  });

  ipcMain.handle("open-projector-window", (_e, displayId: number) => {
    openProjectorOutputWindow(displayId);
  });

  ipcMain.handle("close-projector-window", () => {
    if (projectorWindow) {
      projectorWindow.close();
      projectorWindow = null;
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
