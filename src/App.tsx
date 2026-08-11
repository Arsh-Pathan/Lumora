/**
 * LUMORA — Main Desktop Application Shell
 */

import React, { useState } from "react";
import { LumoraProvider, useLumora } from "./ui/context/LumoraContext";
import { TopMenu } from "./ui/components/TopMenu";
import { Toolbar } from "./ui/components/Toolbar";
import { MediaBrowser } from "./ui/components/MediaBrowser";
import { SurfacePanel } from "./ui/components/SurfacePanel";
import { CanvasViewport } from "./ui/components/CanvasViewport";
import { SurfaceInspector } from "./ui/components/SurfaceInspector";
import { ScenePanel } from "./ui/components/ScenePanel";
import { ShowModeView } from "./ui/components/ShowModeView";
import { VerifyShowModal } from "./ui/components/VerifyShowModal";
import { CalibrationDialog } from "./ui/components/CalibrationDialog";
import { NewProjectModal } from "./ui/components/NewProjectModal";
import { SettingsDialog } from "./ui/components/SettingsDialog";
import { TutorialModal } from "./ui/components/TutorialModal";
import "./ui/styles/lumora-theme.css";

const MainLayout: React.FC = () => {
  const { showMode, isSimpleMode } = useLumora();
  const [leftTab, setLeftTab] = useState<"surfaces" | "media" | "scenes">("surfaces");

  if (showMode) {
    return <ShowModeView />;
  }

  return (
    <div className="lumora-app">
      {/* Top Menu Bar */}
      <TopMenu />

      {/* Canvas Action Toolbar */}
      <Toolbar />

      {/* Main Workspace 3-Column Resizable Layout */}
      <div className="lumora-main-row">
        {/* Left Side Panel (Surfaces, Media, Scenes) */}
        <div className="lumora-panel" style={{ width: 320 }}>
          {/* Tab Navigation */}
          <div className="tab-list">
            <div
              className={`tab-item ${leftTab === "surfaces" ? "active" : ""}`}
              onClick={() => setLeftTab("surfaces")}
            >
              Surfaces
            </div>
            <div
              className={`tab-item ${leftTab === "media" ? "active" : ""}`}
              onClick={() => setLeftTab("media")}
            >
              Media
            </div>
            <div
              className={`tab-item ${leftTab === "scenes" ? "active" : ""}`}
              onClick={() => setLeftTab("scenes")}
            >
              Scenes & Cues
            </div>
          </div>

          <div className="lumora-panel-body">
            {leftTab === "surfaces" && <SurfacePanel />}
            {leftTab === "media" && <MediaBrowser />}
            {leftTab === "scenes" && <ScenePanel />}
          </div>
        </div>

        {/* Center Composition Canvas Workspace */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <CanvasViewport />
        </div>

        {/* Right Inspector Panel */}
        {!isSimpleMode && (
          <div className="lumora-panel lumora-panel-right" style={{ width: 340 }}>
            <div className="lumora-panel-header">
              <span>Surface Inspector & Effects</span>
            </div>
            <div className="lumora-panel-body">
              <SurfaceInspector />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Modals */}
      <VerifyShowModal />
      <CalibrationDialog />
      <NewProjectModal />
      <SettingsDialog />
      <TutorialModal />
    </div>
  );
};

export function App() {
  return (
    <LumoraProvider>
      <MainLayout />
    </LumoraProvider>
  );
}

export default App;
