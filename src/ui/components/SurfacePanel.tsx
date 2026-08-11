/**
 * LUMORA UI — Projection Surfaces & Layer Panel Component
 */

import React from "react";
import { useLumora } from "../context/LumoraContext";
import { Eye, EyeOff, Lock, Unlock, Trash2, Plus, BoxSelect, Move, Layers } from "lucide-react";

export const SurfacePanel: React.FC = () => {
  const { project, selectedSurfaceId, selectSurface, updateSurface, deleteSurface, addSurface } = useLumora();

  const sortedSurfaces = [...project.surfaces].sort((a, b) => b.zIndex - a.zIndex);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Surface Creation Toolbar */}
      <div style={{ display: "flex", gap: 4, marginBottom: 8, flexWrap: "wrap" }}>
        <button className="btn btn-sm btn-primary" onClick={() => addSurface("quad")}>
          <Plus size={13} /> + Quad Pin
        </button>
        <button className="btn btn-sm" onClick={() => addSurface("mesh")}>
          <Plus size={13} /> + Mesh Warp
        </button>
        <button className="btn btn-sm" onClick={() => addSurface("rectangle")}>
          <Plus size={13} /> + Rect
        </button>
      </div>

      {/* Layer List */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {sortedSurfaces.length === 0 ? (
          <div style={{ padding: 16, textAlign: "center", color: "var(--text-muted)", fontSize: 12 }}>
            No mapping surfaces. Click + Quad Pin above to create one.
          </div>
        ) : (
          sortedSurfaces.map(surface => {
            const isSelected = selectedSurfaceId === surface.id;
            return (
              <div
                key={surface.id}
                className={`list-item ${isSelected ? "selected" : ""}`}
                onClick={() => selectSurface(surface.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "6px 8px",
                  marginBottom: 3,
                  backgroundColor: isSelected ? "hsl(215, 45%, 16%)" : "var(--bg-input)",
                  border: `1px solid ${isSelected ? "var(--accent-blue)" : "var(--border-color)"}`
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                  {surface.type === "mesh" ? <Move size={15} color="var(--accent-yellow)" /> : <BoxSelect size={15} color="var(--accent-blue)" />}
                  <span style={{ fontWeight: isSelected ? 700 : 500, fontSize: 12 }}>{surface.name}</span>
                </div>

                {/* Layer Control Icons */}
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {/* Visibility Eye */}
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      updateSurface(surface.id, { visible: !surface.visible });
                    }}
                    style={{ cursor: "pointer", color: surface.visible ? "var(--text-primary)" : "var(--text-muted)" }}
                  >
                    {surface.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                  </span>

                  {/* Lock Toggle */}
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      updateSurface(surface.id, { locked: !surface.locked });
                    }}
                    style={{ cursor: "pointer", color: surface.locked ? "var(--accent-yellow)" : "var(--text-muted)" }}
                  >
                    {surface.locked ? <Lock size={14} /> : <Unlock size={14} />}
                  </span>

                  {/* Delete Surface */}
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSurface(surface.id);
                    }}
                    style={{ cursor: "pointer", color: "var(--accent-red)" }}
                  >
                    <Trash2 size={14} />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div style={{ padding: "6px 0 0 0", fontSize: 10, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
        <Layers size={12} /> Total Layers: {project.surfaces.length}
      </div>
    </div>
  );
};
