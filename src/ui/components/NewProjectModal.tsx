/**
 * LUMORA UI — New Project Presets Modal Component
 */

import React, { useState } from "react";
import { useLumora } from "../context/LumoraContext";
import { Monitor, X } from "lucide-react";

export const NewProjectModal: React.FC = () => {
  const { newProjectModalOpen, setNewProjectModalOpen, createNewProject } = useLumora();

  const [projectName, setProjectName] = useState("Festival Mapping Show");
  const [resolutionPreset, setResolutionPreset] = useState("1920x1080");
  const [customWidth, setCustomWidth] = useState(1920);
  const [customHeight, setCustomHeight] = useState(1080);
  const [fps, setFps] = useState(60);

  if (!newProjectModalOpen) return null;

  const handleCreate = () => {
    let w = 1920;
    let h = 1080;

    if (resolutionPreset === "1280x720") { w = 1280; h = 720; }
    else if (resolutionPreset === "1920x1080") { w = 1920; h = 1080; }
    else if (resolutionPreset === "2560x1440") { w = 2560; h = 1440; }
    else if (resolutionPreset === "3840x2160") { w = 3840; h = 2160; }
    else { w = customWidth; h = customHeight; }

    createNewProject(projectName.trim() || "Untitled Project", w, h, fps);
    setNewProjectModalOpen(false);
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.8)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        width: 440,
        backgroundColor: "var(--bg-panel)",
        border: "1px solid var(--border-color)",
        borderRadius: 8,
        padding: 20
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 16 }}>
            <Monitor size={20} color="var(--accent-blue)" />
            CREATE NEW LUMORA PROJECT
          </div>
          <X size={18} style={{ cursor: "pointer" }} onClick={() => setNewProjectModalOpen(false)} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          <div>
            <label style={{ fontSize: 11, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>PROJECT NAME</label>
            <input
              className="input-field"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>

          <div>
            <label style={{ fontSize: 11, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>CANVAS RESOLUTION PRESET</label>
            <select
              className="input-field"
              value={resolutionPreset}
              onChange={(e) => setResolutionPreset(e.target.value)}
            >
              <option value="1280x720">1280 × 720 (HD 720p)</option>
              <option value="1920x1080">1920 × 1080 (Full HD 1080p - Recommended)</option>
              <option value="2560x1440">2560 × 1440 (2K QHD)</option>
              <option value="3840x2160">3840 × 2160 (4K UHD)</option>
              <option value="custom">Custom Resolution</option>
            </select>
          </div>

          {resolutionPreset === "custom" && (
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 10, color: "var(--text-muted)" }}>Width (px)</label>
                <input
                  type="number"
                  className="input-field"
                  value={customWidth}
                  onChange={(e) => setCustomWidth(parseInt(e.target.value) || 1920)}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 10, color: "var(--text-muted)" }}>Height (px)</label>
                <input
                  type="number"
                  className="input-field"
                  value={customHeight}
                  onChange={(e) => setCustomHeight(parseInt(e.target.value) || 1080)}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ fontSize: 11, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>TARGET FRAME RATE (FPS)</label>
            <select
              className="input-field"
              value={fps}
              onChange={(e) => setFps(parseInt(e.target.value))}
            >
              <option value={24}>24 FPS (Cinematic)</option>
              <option value={25}>25 FPS (PAL Stage)</option>
              <option value={30}>30 FPS</option>
              <option value={50}>50 FPS</option>
              <option value={60}>60 FPS (Pro Performance - Recommended)</option>
              <option value={120}>120 FPS (High Refresh)</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button className="btn" onClick={() => setNewProjectModalOpen(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleCreate}>Create Project</button>
        </div>
      </div>
    </div>
  );
};
