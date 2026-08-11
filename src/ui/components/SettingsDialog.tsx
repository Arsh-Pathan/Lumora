/**
 * LUMORA UI — Settings Dialog Component
 */

import React from "react";
import { useLumora } from "../context/LumoraContext";
import { Settings, X } from "lucide-react";

export const SettingsDialog: React.FC = () => {
  const { settingsModalOpen, setSettingsModalOpen } = useLumora();

  if (!settingsModalOpen) return null;

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
        width: 500,
        backgroundColor: "var(--bg-panel)",
        border: "1px solid var(--border-color)",
        borderRadius: 8,
        padding: 20
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 16 }}>
            <Settings size={20} color="var(--accent-blue)" />
            APPLICATION SETTINGS
          </div>
          <X size={18} style={{ cursor: "pointer" }} onClick={() => setSettingsModalOpen(false)} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
          <div>
            <label style={{ fontSize: 11, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>AUTOSAVE INTERVAL</label>
            <select className="input-field" defaultValue="2">
              <option value="1">Every 1 minute</option>
              <option value="2">Every 2 minutes (Default)</option>
              <option value="5">Every 5 minutes</option>
              <option value="0">Disabled</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: 11, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>HARDWARE ACCELERATION</label>
            <select className="input-field" defaultValue="webgl2">
              <option value="webgl2">WebGL 2.0 (High Performance GPU Pipeline)</option>
              <option value="webgpu">WebGPU (Experimental Next-Gen)</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: 11, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>VSYNC & RENDER LIMITING</label>
            <select className="input-field" defaultValue="60">
              <option value="60">Lock to 60 FPS (VSync On)</option>
              <option value="120">Lock to 120 FPS</option>
              <option value="0">Unlimited FPS</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="btn btn-primary" onClick={() => setSettingsModalOpen(false)}>Save Preferences</button>
        </div>
      </div>
    </div>
  );
};
