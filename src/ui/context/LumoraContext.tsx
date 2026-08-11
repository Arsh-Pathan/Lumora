/**
 * LUMORA UI Context & Command-History State Store (Undo/Redo & App Engine)
 */

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import type { ProjectionSurface, MediaAsset, ShowScene } from "../../architecture/contracts";
import type { ProjectData } from "../../project/LumoraArchive";
import type { VerificationReport } from "../../project/ProjectValidator";
import { LumoraArchive } from "../../project/LumoraArchive";
import { ProjectValidator } from "../../project/ProjectValidator";
import { SurfaceManager } from "../../surfaces/SurfaceManager";

export type ToolMode = "select" | "quad-pin" | "mesh" | "move" | "pan";

export interface DisplayInfo {
  id: number;
  name: string;
  resolution: string;
  isPrimary: boolean;
  bounds: { x: number; y: number; width: number; height: number };
}

export interface LumoraState {
  // Project
  project: ProjectData;
  selectedSurfaceId: string | null;
  activeTool: ToolMode;
  isSimpleMode: boolean; // Simple Mode vs Advanced Mode

  // Show & Emergency Controls
  blackout: boolean;
  blackoutSpeedMs: number; // 0, 100, 250, 500
  whiteout: boolean;
  showMode: boolean;

  // Projector Calibration & Output
  calibrationMode: boolean;
  calibrationPattern: number; // 0=Grid, 1=Crosshair, 2=Checkerboard, 3=Color bars, 4=Red, 5=Green, 6=Blue, 7=White, 8=Black
  displays: DisplayInfo[];
  selectedDisplayId: number;
  projectorOutputActive: boolean;

  // Viewport
  zoom: number;
  pan: { x: number; y: number };
  gridEnabled: boolean;
  gridSize: number;
  snapToGrid: boolean;

  // UI Modals
  newProjectModalOpen: boolean;
  verifyShowModalOpen: boolean;
  calibrationModalOpen: boolean;
  settingsModalOpen: boolean;
  tutorialModalOpen: boolean;

  // Performance stats
  fps: number;
  frameTimeMs: number;
  droppedFrames: number;

  // History (Undo/Redo)
  canUndo: boolean;
  canRedo: boolean;
}

export interface LumoraContextType extends LumoraState {
  // Actions
  createNewProject: (name: string, width: number, height: number, fps: number) => void;
  loadProjectData: (data: ProjectData) => void;
  saveProject: () => Promise<Uint8Array>;
  
  // Surfaces
  addSurface: (type: "rectangle" | "quad" | "triangle" | "polygon" | "mesh") => void;
  updateSurface: (id: string, updates: Partial<ProjectionSurface>) => void;
  deleteSurface: (id: string) => void;
  selectSurface: (id: string | null) => void;

  // Media
  addMediaAsset: (asset: MediaAsset) => void;
  assignMediaToSurface: (surfaceId: string, mediaId: string | null) => void;

  // Scenes
  triggerScene: (sceneId: string) => void;
  addScene: (name: string) => void;

  // Show Mode & Blackout
  toggleBlackout: () => void;
  toggleWhiteout: () => void;
  toggleShowMode: () => void;
  toggleCalibrationMode: (pattern?: number) => void;
  setProjectorOutputActive: (active: boolean) => void;

  // Tools & Viewport
  setActiveTool: (tool: ToolMode) => void;
  setZoom: (zoom: number) => void;
  setPan: (pan: { x: number; y: number }) => void;
  toggleGrid: () => void;
  toggleSimpleMode: () => void;

  // Modals
  setNewProjectModalOpen: (open: boolean) => void;
  setVerifyShowModalOpen: (open: boolean) => void;
  setCalibrationModalOpen: (open: boolean) => void;
  setSettingsModalOpen: (open: boolean) => void;
  setTutorialModalOpen: (open: boolean) => void;

  // Verification
  verifyShow: () => VerificationReport;

  // Undo / Redo
  undo: () => void;
  redo: () => void;
}

const defaultProject: ProjectData = {
  manifest: {
    format: "LUMORA",
    formatVersion: 1,
    applicationVersion: "1.0.0",
    projectName: "New Lumora Show",
    projectResolution: { width: 1920, height: 1080 },
    fps: 60,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  settings: {
    projectName: "New Lumora Show",
    resolution: { width: 1920, height: 1080 },
    fps: 60,
    backgroundColor: "#05050a",
    autosaveIntervalMinutes: 2
  },
  surfaces: [],
  scenes: [
    { id: "sc-1", name: "INTRO", surfaceStates: {}, transition: "fade", transitionDurationMs: 500 },
    { id: "sc-2", name: "MAIN SHOW", surfaceStates: {}, transition: "fade", transitionDurationMs: 1000 },
    { id: "sc-3", name: "FINALE", surfaceStates: {}, transition: "fade", transitionDurationMs: 500 }
  ],
  activeSceneId: "sc-1",
  mediaAssets: []
};

const LumoraContext = createContext<LumoraContextType | null>(null);

export const LumoraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [project, setProject] = useState<ProjectData>(() => {
    const p = { ...defaultProject };
    const defaultQuad = SurfaceManager.createSurface("Stage Quad 1", "quad", 1920, 1080);
    defaultQuad.corners = {
      topLeft: { x: 300, y: 200 },
      topRight: { x: 1100, y: 180 },
      bottomRight: { x: 1050, y: 800 },
      bottomLeft: { x: 320, y: 820 }
    };
    defaultQuad.mediaId = null;

    p.surfaces = [defaultQuad];
    p.mediaAssets = [];
    return p;
  });

  const [selectedSurfaceId, setSelectedSurfaceId] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<ToolMode>("quad-pin");
  const [isSimpleMode, setIsSimpleMode] = useState<boolean>(false);

  const [blackout, setBlackout] = useState(false);
  const [blackoutSpeedMs] = useState(0);
  const [whiteout, setWhiteout] = useState(false);
  const [showMode, setShowMode] = useState(false);

  const [calibrationMode, setCalibrationMode] = useState(false);
  const [calibrationPattern, setCalibrationPattern] = useState(0);

  const [displays] = useState<DisplayInfo[]>([
    { id: 1, name: "Display 1 (Primary Desktop)", resolution: "1920x1080", isPrimary: true, bounds: { x: 0, y: 0, width: 1920, height: 1080 } },
    { id: 2, name: "Display 2 (Projector Output 1)", resolution: "1920x1080", isPrimary: false, bounds: { x: 1920, y: 0, width: 1920, height: 1080 } }
  ]);
  const [selectedDisplayId] = useState(2);
  const [projectorOutputActive, setProjectorOutputActive] = useState(false);

  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [gridEnabled, setGridEnabled] = useState(true);
  const [gridSize] = useState(40);
  const [snapToGrid] = useState(false);

  // Modals
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);
  const [verifyShowModalOpen, setVerifyShowModalOpen] = useState(false);
  const [calibrationModalOpen, setCalibrationModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [tutorialModalOpen, setTutorialModalOpen] = useState(false);

  // Stats
  const [fps] = useState(60);
  const [frameTimeMs] = useState(16.6);
  const [droppedFrames] = useState(0);

  // Undo / Redo Stacks
  const historyRef = useRef<ProjectData[]>([]);
  const futureRef = useRef<ProjectData[]>([]);

  const pushHistory = (newProject: ProjectData) => {
    historyRef.current.push(JSON.parse(JSON.stringify(project)));
    futureRef.current = [];
    setProject(newProject);
  };

  // Autosave timer every 2 minutes
  useEffect(() => {
    const timer = setInterval(() => {
      try {
        const json = JSON.stringify(project);
        localStorage.setItem("lumora_autosave_recovery", json);
      } catch {}
    }, 120000);
    return () => clearInterval(timer);
  }, [project]);

  // Keyboard Shortcuts (Space=Play/Pause, B=Blackout, W/E/R=Tools, Tab=ShowMode)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key.toLowerCase() === "b") {
        setBlackout(prev => !prev);
      } else if (e.key === " ") {
        e.preventDefault();
      } else if (e.key.toLowerCase() === "w") {
        setActiveTool("move");
      } else if (e.key.toLowerCase() === "e") {
        setActiveTool("quad-pin");
      } else if (e.key.toLowerCase() === "r") {
        setActiveTool("mesh");
      } else if (e.key.toLowerCase() === "g") {
        setGridEnabled(prev => !prev);
      } else if (e.key === "Tab") {
        e.preventDefault();
        setShowMode(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const createNewProject = (name: string, width: number, height: number, fps: number) => {
    const defaultQuad = SurfaceManager.createSurface("Stage Quad 1", "quad", width, height);
    defaultQuad.mediaId = null;

    const newP: ProjectData = {
      manifest: {
        format: "LUMORA",
        formatVersion: 1,
        applicationVersion: "1.0.0",
        projectName: name,
        projectResolution: { width, height },
        fps,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      settings: {
        projectName: name,
        resolution: { width, height },
        fps,
        backgroundColor: "#05050a",
        autosaveIntervalMinutes: 2
      },
      surfaces: [defaultQuad],
      scenes: [{ id: "sc-1", name: "INTRO", surfaceStates: {}, transition: "fade", transitionDurationMs: 500 }],
      activeSceneId: "sc-1",
      mediaAssets: []
    };

    pushHistory(newP);
    setSelectedSurfaceId(defaultQuad.id);
  };

  const loadProjectData = (data: ProjectData) => {
    pushHistory(data);
    if (data.surfaces.length > 0) setSelectedSurfaceId(data.surfaces[0].id);
  };

  const saveProject = async (): Promise<Uint8Array> => {
    return await LumoraArchive.exportLumoraPackage(project);
  };

  const addSurface = (type: "rectangle" | "quad" | "triangle" | "polygon" | "mesh") => {
    const surf = SurfaceManager.createSurface(
      `${type.toUpperCase()} Surface ${project.surfaces.length + 1}`,
      type,
      project.settings.resolution.width,
      project.settings.resolution.height
    );
    const updated = { ...project, surfaces: [...project.surfaces, surf] };
    pushHistory(updated);
    setSelectedSurfaceId(surf.id);
  };

  const updateSurface = (id: string, updates: Partial<ProjectionSurface>) => {
    const updatedSurfaces = project.surfaces.map(s => (s.id === id ? { ...s, ...updates } : s));
    setProject(prev => ({ ...prev, surfaces: updatedSurfaces }));
  };

  const deleteSurface = (id: string) => {
    const updatedSurfaces = project.surfaces.filter(s => s.id !== id);
    pushHistory({ ...project, surfaces: updatedSurfaces });
    if (selectedSurfaceId === id) setSelectedSurfaceId(null);
  };

  const selectSurface = (id: string | null) => setSelectedSurfaceId(id);

  const addMediaAsset = (asset: MediaAsset) => {
    pushHistory({ ...project, mediaAssets: [...project.mediaAssets, asset] });
  };

  const assignMediaToSurface = (surfaceId: string, mediaId: string | null) => {
    updateSurface(surfaceId, { mediaId });
  };

  const triggerScene = (sceneId: string) => {
    setProject(prev => ({ ...prev, activeSceneId: sceneId }));
  };

  const addScene = (name: string) => {
    const newScene: ShowScene = {
      id: `sc_${Date.now()}`,
      name,
      surfaceStates: {},
      transition: "fade",
      transitionDurationMs: 500
    };
    pushHistory({ ...project, scenes: [...project.scenes, newScene] });
  };

  const toggleBlackout = () => setBlackout(prev => !prev);
  const toggleWhiteout = () => setWhiteout(prev => !prev);
  const toggleShowMode = () => setShowMode(prev => !prev);
  const toggleCalibrationMode = (pattern?: number) => {
    setCalibrationMode(prev => !prev);
    if (pattern !== undefined) setCalibrationPattern(pattern);
  };

  const toggleGrid = () => setGridEnabled(prev => !prev);
  const toggleSimpleMode = () => setIsSimpleMode(prev => !prev);

  const verifyShow = (): VerificationReport => {
    return ProjectValidator.verifyShow(project, projectorOutputActive);
  };

  const undo = () => {
    if (historyRef.current.length === 0) return;
    const prev = historyRef.current.pop()!;
    futureRef.current.push(JSON.parse(JSON.stringify(project)));
    setProject(prev);
  };

  const redo = () => {
    if (futureRef.current.length === 0) return;
    const next = futureRef.current.pop()!;
    historyRef.current.push(JSON.parse(JSON.stringify(project)));
    setProject(next);
  };

  return (
    <LumoraContext.Provider
      value={{
        project,
        selectedSurfaceId,
        activeTool,
        isSimpleMode,
        blackout,
        blackoutSpeedMs,
        whiteout,
        showMode,
        calibrationMode,
        calibrationPattern,
        displays,
        selectedDisplayId,
        projectorOutputActive,
        zoom,
        pan,
        gridEnabled,
        gridSize,
        snapToGrid,
        newProjectModalOpen,
        verifyShowModalOpen,
        calibrationModalOpen,
        settingsModalOpen,
        tutorialModalOpen,
        fps,
        frameTimeMs,
        droppedFrames,
        canUndo: historyRef.current.length > 0,
        canRedo: futureRef.current.length > 0,
        createNewProject,
        loadProjectData,
        saveProject,
        addSurface,
        updateSurface,
        deleteSurface,
        selectSurface,
        addMediaAsset,
        assignMediaToSurface,
        triggerScene,
        addScene,
        toggleBlackout,
        toggleWhiteout,
        toggleShowMode,
        toggleCalibrationMode,
        setProjectorOutputActive,
        setActiveTool,
        setZoom,
        setPan,
        toggleGrid,
        toggleSimpleMode,
        setNewProjectModalOpen,
        setVerifyShowModalOpen,
        setCalibrationModalOpen,
        setSettingsModalOpen,
        setTutorialModalOpen,
        verifyShow,
        undo,
        redo
      }}
    >
      {children}
    </LumoraContext.Provider>
  );
};

export const useLumora = () => {
  const ctx = useContext(LumoraContext);
  if (!ctx) throw new Error("useLumora must be used within LumoraProvider");
  return ctx;
};
