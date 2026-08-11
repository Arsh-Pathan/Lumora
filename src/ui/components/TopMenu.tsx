/**
 * LUMORA UI — Top Menu Bar Component
 */

import React from "react";
import { useLumora } from "../context/LumoraContext";
import { LumoraLogo } from "./LumoraLogo";
import { Play, Eye, ShieldAlert, Sliders, Activity } from "lucide-react";

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
      height: 42,
      backgroundColor: "var(--bg-darker)",
      borderBottom: "1px solid var(--accent-border)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 14px",
      fontSize: 12,
      fontWeight: 500
    }}>
      {/* Brand Logo & Menus */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <LumoraLogo size={22} showText={true} />

        <div style={{ display: "flex", gap: 14, color: "var(--text-secondary)", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>
          <span style={{ cursor: "pointer" }} onClick={() => setNewProjectModalOpen(true)}>File</span>
          <span style={{ cursor: "pointer" }} onClick={handleSave}>Save .lumora</span>
          <span style={{ cursor: "pointer" }} onClick={() => setVerifyShowModalOpen(true)}>Verify Show</span>
          <span style={{ cursor: "pointer" }} onClick={() => setCalibrationModalOpen(true)}>Calibration</span>
          <span style={{ cursor: "pointer" }} onClick={() => setSettingsModalOpen(true)}>Settings</span>
          <span style={{ cursor: "pointer" }} onClick={() => setTutorialModalOpen(true)}>Tutorial</span>
        </div>
      </div>

      {/* Center Status Badge */}
      <div
        onClick={() => setVerifyShowModalOpen(true)}
        style={{
          cursor: "pointer",
          padding: "3px 12px",
          borderRadius: 2,
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: "0.08em",
          backgroundColor: report.isReady ? "#ffffff" : "#1a1a1a",
          color: report.isReady ? "#000000" : "#ffffff",
          border: `1px solid ${report.isReady ? "#ffffff" : "#444444"}`
        }}
      >
        {report.statusText}
      </div>

      {/* Right Controls & Emergency Overrides */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Simple vs Advanced Mode */}
        <button className="btn btn-sm" onClick={toggleSimpleMode}>
          <Sliders size={13} />
          {isSimpleMode ? "Simple Mode" : "Advanced Mode"}
        </button>

        {/* Show Mode Toggle */}
        <button
          className={`btn btn-sm ${showMode ? "btn-primary" : ""}`}
          onClick={toggleShowMode}
        >
          <Play size={13} />
          {showMode ? "Exit Show Mode" : "Show Mode"}
        </button>

        {/* Whiteout Test Pattern */}
        <button
          className="btn btn-sm"
          onClick={toggleWhiteout}
          style={{ backgroundColor: whiteout ? "#ffffff" : undefined, color: whiteout ? "#000000" : undefined }}
        >
          <Eye size={13} />
          WHITEOUT
        </button>

        {/* Emergency BLACKOUT */}
        <button
          className="btn btn-danger btn-sm"
          onClick={toggleBlackout}
        >
          <ShieldAlert size={13} />
          {blackout ? "BLACKOUT ON" : "BLACKOUT"}
        </button>

        {/* Performance Metric Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
          <Activity size={13} color="#ffffff" />
          {fps} FPS ({frameTimeMs}ms)
        </div>
      </div>
    </div>
  );
};
