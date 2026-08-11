/**
 * LUMORA UI — Projector Alignment & Calibration Dialog Component
 */

import React from "react";
import { useLumora } from "../context/LumoraContext";
import { Target, X, Grid, Check } from "lucide-react";

export const CalibrationDialog: React.FC = () => {
  const {
    calibrationModalOpen,
    setCalibrationModalOpen,
    calibrationMode,
    calibrationPattern,
    toggleCalibrationMode
  } = useLumora();

  if (!calibrationModalOpen) return null;

  const patterns = [
    { id: 0, name: "Grid Alignment", icon: <Grid size={16} /> },
    { id: 1, name: "Crosshair Center", icon: <Target size={16} /> },
    { id: 2, name: "Checkerboard 16x16" },
    { id: 3, name: "Color Bars (SMPTE)" },
    { id: 4, name: "Pure Red" },
    { id: 5, name: "Pure Green" },
    { id: 6, name: "Pure Blue" },
    { id: 7, name: "Pure White" },
    { id: 8, name: "Pure Black" }
  ];

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
        width: 480,
        backgroundColor: "var(--bg-panel)",
        border: "1px solid var(--border-color)",
        borderRadius: 8,
        padding: 20
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 16 }}>
            <Target size={20} color="var(--accent-blue)" />
            PROJECTOR CALIBRATION PATTERNS
          </div>
          <X size={18} style={{ cursor: "pointer" }} onClick={() => setCalibrationModalOpen(false)} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <button
            className={`btn ${calibrationMode ? "btn-danger" : "btn-primary"}`}
            style={{ width: "100%", justifyContent: "center", padding: "10px", fontWeight: 700 }}
            onClick={() => toggleCalibrationMode()}
          >
            {calibrationMode ? "STOP CALIBRATION MODE" : "START CALIBRATION MODE"}
          </button>
        </div>

        {/* Pattern List Buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
          {patterns.map(p => {
            const isSelected = calibrationMode && calibrationPattern === p.id;
            return (
              <button
                key={p.id}
                className={`btn ${isSelected ? "btn-primary" : ""}`}
                style={{ justifyContent: "flex-start", padding: "8px 12px" }}
                onClick={() => toggleCalibrationMode(p.id)}
              >
                {isSelected ? <Check size={14} /> : null}
                {p.name}
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="btn" onClick={() => setCalibrationModalOpen(false)}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
