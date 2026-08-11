/**
 * LUMORA UI — Canvas Toolbar Component
 */

import React from "react";
import { useLumora } from "../context/LumoraContext";
import type { ToolMode } from "../context/LumoraContext";
import { Move, Grid, Maximize, MousePointer, ShieldCheck, BoxSelect } from "lucide-react";

export const Toolbar: React.FC = () => {
  const { activeTool, setActiveTool, gridEnabled, toggleGrid, setZoom, setPan } = useLumora();

  const tools: { id: ToolMode; label: string; icon: React.ReactNode; shortcut: string }[] = [
    { id: "move", label: "Move / Scale", icon: <Move size={16} />, shortcut: "W" },
    { id: "quad-pin", label: "Corner Pin (4-Point)", icon: <BoxSelect size={16} />, shortcut: "E" },
    { id: "mesh", label: "Mesh Warp", icon: <MousePointer size={16} />, shortcut: "R" },
    { id: "pan", label: "Pan Canvas", icon: <Move size={16} />, shortcut: "Space" }
  ];

  const handleFit = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div style={{
      height: 40,
      backgroundColor: "var(--bg-panel)",
      borderBottom: "1px solid var(--border-color)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 12px"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {tools.map(t => (
          <button
            key={t.id}
            className={`btn btn-sm ${activeTool === t.id ? "btn-primary" : ""}`}
            onClick={() => setActiveTool(t.id)}
            title={`${t.label} (${t.shortcut})`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button
          className={`btn btn-sm ${gridEnabled ? "btn-primary" : ""}`}
          onClick={toggleGrid}
          title="Toggle Canvas Snapping Grid (G)"
        >
          <Grid size={15} />
          Grid
        </button>

        <button className="btn btn-sm" onClick={handleFit} title="Fit Canvas to Viewport">
          <Maximize size={15} />
          Fit Screen
        </button>

        <div style={{ fontSize: 11, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
          <ShieldCheck size={14} color="var(--accent-blue)" />
          GPU Accelerated
        </div>
      </div>
    </div>
  );
};
