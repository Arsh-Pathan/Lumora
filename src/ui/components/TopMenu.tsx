/**
 * LUMORA UI — Top Menu Bar Component
 */

import React from "react";
import { useLumora } from "../context/LumoraContext";
import { Play, Eye, ShieldAlert, Monitor, Sliders, Activity } from "lucide-react";

export const TopMenu: React.FC = () => {
  const {
    project,
    blackout,
    whiteout,
    showMode,
    isSimpleMode,
    toggleBlackout,
    toggleWhiteout,
    toggleShowMode,
    toggleSimpleMode,
    setNewProjectModalOpen,
    setVerifyShowModalOpen,
    setCalibrationModalOpen,
    setSettingsModalOpen,
    setTutorialModalOpen,
    verifyShow,
    saveProject,
    fps,
    frameTimeMs
  } = useLumora();

  const report = verifyShow();

  const handleSave = async () => {
    const buffer = await saveProject();
    const blob = new Blob([buffer as Uint8Array<ArrayBuffer>], { type: "application/zip" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.settings.projectName.replace(/\s+/g, "_")}.lumora`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      height: 38,
      backgroundColor: "var(--bg-darker)",
      borderBottom: "1px solid var(--border-color)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 12px",
      fontSize: 12,
      fontWeight: 500
    }}>
      {/* Brand & File Menus */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, letterSpacing: "0.08em", color: "var(--accent-blue)" }}>
          <Monitor size={18} />
          LUMORA
        </div>

        <div style={{ display: "flex", gap: 12, color: "var(--text-secondary)" }}>
          <span style={{ cursor: "pointer" }} onClick={() => setNewProjectModalOpen(true)}>File</span>
          <span style={{ cursor: "pointer" }} onClick={handleSave}>Save .lumora</span>
          <span style={{ cursor: "pointer" }} onClick={() => setVerifyShowModalOpen(true)}>Verify Show</span>
          <span style={{ cursor: "pointer" }} onClick={() => setCalibrationModalOpen(true)}>Calibration</span>
          <span style={{ cursor: "pointer" }} onClick={() => setSettingsModalOpen(true)}>Settings</span>
          <span style={{ cursor: "pointer" }} onClick={() => setTutorialModalOpen(true)}>Tutorial</span>
        </div>
      </div>

      {/* Center Status Pill */}
      <div
        onClick={() => setVerifyShowModalOpen(true)}
        style={{
          cursor: "pointer",
          padding: "3px 10px",
          borderRadius: 12,
          fontSize: 11,
          fontWeight: 700,
          backgroundColor: report.isReady ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
          color: report.isReady ? "var(--accent-green)" : "var(--accent-red)",
          border: `1px solid ${report.isReady ? "var(--accent-green)" : "var(--accent-red)"}`
        }}
      >
        {report.statusText}
      </div>

      {/* Right Controls & Emergency Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Simple vs Advanced Mode */}
        <button className="btn btn-sm" onClick={toggleSimpleMode}>
          <Sliders size={14} />
          {isSimpleMode ? "Simple Mode" : "Advanced Mode"}
        </button>

        {/* Show Mode Toggle */}
        <button
          className={`btn btn-sm ${showMode ? "btn-primary" : ""}`}
          onClick={toggleShowMode}
        >
          <Play size={14} />
          {showMode ? "Exit Show Mode" : "Show Mode"}
        </button>

        {/* Whiteout Test Pattern */}
        <button
          className="btn btn-sm"
          onClick={toggleWhiteout}
          style={{ backgroundColor: whiteout ? "#ffffff" : undefined, color: whiteout ? "#000" : undefined }}
        >
          <Eye size={14} />
          WHITEOUT
        </button>

        {/* Emergency BLACKOUT */}
        <button
          className="btn btn-danger btn-sm"
          onClick={toggleBlackout}
          style={{
            fontWeight: 700,
            boxShadow: blackout ? "0 0 12px rgba(239, 68, 68, 0.8)" : "none"
          }}
        >
          <ShieldAlert size={14} />
          {blackout ? "BLACKOUT ON" : "BLACKOUT"}
        </button>

        {/* Performance Metric Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
          <Activity size={13} color="var(--accent-green)" />
          {fps} FPS ({frameTimeMs}ms)
        </div>
      </div>
    </div>
  );
};
