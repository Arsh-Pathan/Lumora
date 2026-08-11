/**
 * LUMORA UI — Prominent Google Material 3 Canvas Toolbar Component
 */

import React from "react";
import { useLumora } from "../context/LumoraContext";
import type { ToolMode } from "../context/LumoraContext";
import {
  Move,
  Grid,
  Maximize2,
  MousePointer,
  BoxSelect,
  Plus,
  Square,
  ShieldCheck,
  Hand
} from "lucide-react";

export const Toolbar: React.FC = () => {
  const {
    activeTool,
    setActiveTool,
    gridEnabled,
    toggleGrid,
    setZoom,
    setPan,
    addSurface
  } = useLumora();

  const mainTools: { id: ToolMode; label: string; icon: React.ReactNode; shortcut: string }[] = [
    { id: "move", label: "Select / Move", icon: <Move size={18} />, shortcut: "W" },
    { id: "quad-pin", label: "Corner Pin (4-Point)", icon: <BoxSelect size={18} />, shortcut: "E" },
    { id: "mesh", label: "Mesh Warp", icon: <MousePointer size={18} />, shortcut: "R" },
    { id: "pan", label: "Pan Canvas", icon: <Hand size={18} />, shortcut: "Space" }
  ];

  const handleFit = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div style={{
      height: 52,
      backgroundColor: "var(--bg-darker)",
      borderBottom: "1px solid var(--border-subtle)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 16px",
      zIndex: 20
    }}>
      {/* Primary Tool Modes */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 800, color: "var(--text-muted)", letterSpacing: "0.08em", marginRight: 4 }}>
          TOOLS
        </span>

        {mainTools.map(t => {
          const isActive = activeTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTool(t.id)}
              title={`${t.label} (Shortcut: ${t.shortcut})`}
              style={{
                height: 36,
                padding: "0 12px",
                backgroundColor: isActive ? "#ffffff" : "var(--bg-surface)",
                color: isActive ? "#000000" : "#ffffff",
                border: `1px solid ${isActive ? "#ffffff" : "var(--border-subtle)"}`,
                borderRadius: "20px",
                fontSize: 12,
                fontWeight: isActive ? 800 : 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                transition: "all 0.15s ease",
                boxShadow: isActive ? "0 2px 8px rgba(255,255,255,0.2)" : "none"
              }}
            >
              {t.icon}
              {t.label}
              <span style={{
                fontSize: 9,
                fontWeight: 800,
                opacity: 0.7,
                backgroundColor: isActive ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.15)",
                padding: "2px 5px",
                borderRadius: 4
              }}>
                {t.shortcut}
              </span>
            </button>
          );
        })}

        <div style={{ width: 1, height: 24, backgroundColor: "var(--border-subtle)", margin: "0 6px" }} />

        {/* Quick Surface Creation Tool Buttons */}
        <button
          className="btn btn-sm"
          onClick={() => addSurface("quad")}
          title="Add 4-Point Quad Mapping Surface"
          style={{ height: 36, borderRadius: "20px" }}
        >
          <Plus size={14} /> <BoxSelect size={14} /> Add Quad
        </button>

        <button
          className="btn btn-sm"
          onClick={() => addSurface("mesh")}
          title="Add Mesh Warping Surface"
          style={{ height: 36, borderRadius: "20px" }}
        >
          <Plus size={14} /> <MousePointer size={14} /> Add Mesh
        </button>

        <button
          className="btn btn-sm"
          onClick={() => addSurface("rectangle")}
          title="Add Rectangular Surface"
          style={{ height: 36, borderRadius: "20px" }}
        >
          <Plus size={14} /> <Square size={14} /> Add Rect
        </button>
      </div>

      {/* Right Grid & Viewport Helpers */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          onClick={toggleGrid}
          title="Toggle Canvas Snapping & Alignment Grid (G)"
          style={{
            height: 36,
            padding: "0 14px",
            backgroundColor: gridEnabled ? "#ffffff" : "var(--bg-surface)",
            color: gridEnabled ? "#000000" : "#ffffff",
            border: `1px solid ${gridEnabled ? "#ffffff" : "var(--border-subtle)"}`,
            borderRadius: "20px",
            fontSize: 12,
            fontWeight: 800,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 6
          }}
        >
          <Grid size={16} />
          GRID {gridEnabled ? "ON" : "OFF"}
        </button>

        <button
          className="btn btn-sm"
          onClick={handleFit}
          title="Fit Canvas Viewport (F)"
          style={{ height: 36, borderRadius: "20px" }}
        >
          <Maximize2 size={15} />
          Fit Screen
        </button>

        <div style={{ fontSize: 11, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4, marginLeft: 6 }}>
          <ShieldCheck size={14} color="#ffffff" />
          WebGL 2.0
        </div>
      </div>
    </div>
  );
};
