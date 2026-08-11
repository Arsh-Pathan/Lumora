/**
 * LUMORA UI — Surface Inspector & GPU Shader Controls Component
 */

import React from "react";
import { useLumora } from "../context/LumoraContext";
import { Sliders, Grid, Sparkles } from "lucide-react";
import type { BlendMode } from "../../architecture/contracts";
import { createDefaultMesh } from "../../graphics/mesh";

export const SurfaceInspector: React.FC = () => {
  const { project, selectedSurfaceId, updateSurface, isSimpleMode } = useLumora();

  const surface = project.surfaces.find(s => s.id === selectedSurfaceId);

  if (!surface) {
    return (
      <div style={{ padding: 20, textAlign: "center", color: "var(--text-muted)", fontSize: 12 }}>
        Select a projection surface to inspect and tweak its mapping handles or shader parameters.
      </div>
    );
  }

  const blendModes: BlendMode[] = ["normal", "add", "screen", "multiply", "overlay", "lighten", "darken"];

  const handleCornerChange = (cornerName: keyof typeof surface.corners, axis: "x" | "y", val: number) => {
    const newCorners = {
      ...surface.corners,
      [cornerName]: {
        ...surface.corners[cornerName],
        [axis]: val
      }
    };
    updateSurface(surface.id, { corners: newCorners });
  };

  const handleEffectChange = (key: keyof typeof surface.effects, val: number) => {
    updateSurface(surface.id, {
      effects: {
        ...surface.effects,
        [key]: val
      }
    });
  };

  const setMeshPreset = (density: number) => {
    const mesh = createDefaultMesh(
      density,
      density,
      project.settings.resolution.width,
      project.settings.resolution.height
    );
    updateSurface(surface.id, { type: "mesh", mesh });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, height: "100%", overflowY: "auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <input
          className="input-field"
          value={surface.name}
          onChange={(e) => updateSurface(surface.id, { name: e.target.value })}
          style={{ fontWeight: 700, fontSize: 13 }}
        />
      </div>

      {/* Surface Type & Blend Mode */}
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 10, color: "var(--text-muted)", display: "block", marginBottom: 3 }}>BLEND MODE</label>
          <select
            className="input-field"
            value={surface.blendMode}
            onChange={(e) => updateSurface(surface.id, { blendMode: e.target.value as BlendMode })}
          >
            {blendModes.map(m => (
              <option key={m} value={m}>{m.toUpperCase()}</option>
            ))}
          </select>
        </div>

        <div style={{ flex: 1 }}>
          <label style={{ fontSize: 10, color: "var(--text-muted)", display: "block", marginBottom: 3 }}>OPACITY</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={surface.effects.opacity}
            onChange={(e) => handleEffectChange("opacity", parseFloat(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>
      </div>

      {/* 4-Point Perspective Corner Pinning */}
      <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", gap: 6, color: "var(--accent-blue)" }}>
          <Sliders size={14} /> 4-POINT CORNER PINNING
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 11 }}>
          <div>
            <span style={{ color: "var(--text-muted)", fontSize: 10 }}>Top-Left (X, Y)</span>
            <div style={{ display: "flex", gap: 4, marginTop: 2 }}>
              <input
                type="number"
                className="input-field"
                value={Math.round(surface.corners.topLeft.x)}
                onChange={(e) => handleCornerChange("topLeft", "x", parseFloat(e.target.value) || 0)}
              />
              <input
                type="number"
                className="input-field"
                value={Math.round(surface.corners.topLeft.y)}
                onChange={(e) => handleCornerChange("topLeft", "y", parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div>
            <span style={{ color: "var(--text-muted)", fontSize: 10 }}>Top-Right (X, Y)</span>
            <div style={{ display: "flex", gap: 4, marginTop: 2 }}>
              <input
                type="number"
                className="input-field"
                value={Math.round(surface.corners.topRight.x)}
                onChange={(e) => handleCornerChange("topRight", "x", parseFloat(e.target.value) || 0)}
              />
              <input
                type="number"
                className="input-field"
                value={Math.round(surface.corners.topRight.y)}
                onChange={(e) => handleCornerChange("topRight", "y", parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div>
            <span style={{ color: "var(--text-muted)", fontSize: 10 }}>Bottom-Left (X, Y)</span>
            <div style={{ display: "flex", gap: 4, marginTop: 2 }}>
              <input
                type="number"
                className="input-field"
                value={Math.round(surface.corners.bottomLeft.x)}
                onChange={(e) => handleCornerChange("bottomLeft", "x", parseFloat(e.target.value) || 0)}
              />
              <input
                type="number"
                className="input-field"
                value={Math.round(surface.corners.bottomLeft.y)}
                onChange={(e) => handleCornerChange("bottomLeft", "y", parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>

          <div>
            <span style={{ color: "var(--text-muted)", fontSize: 10 }}>Bottom-Right (X, Y)</span>
            <div style={{ display: "flex", gap: 4, marginTop: 2 }}>
              <input
                type="number"
                className="input-field"
                value={Math.round(surface.corners.bottomRight.x)}
                onChange={(e) => handleCornerChange("bottomRight", "x", parseFloat(e.target.value) || 0)}
              />
              <input
                type="number"
                className="input-field"
                value={Math.round(surface.corners.bottomRight.y)}
                onChange={(e) => handleCornerChange("bottomRight", "y", parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mesh Warp Controls */}
      {!isSimpleMode && (
        <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", gap: 6, color: "var(--accent-yellow)" }}>
            <Grid size={14} /> MESH WARPING GRID PRESETS
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button className="btn btn-sm" onClick={() => setMeshPreset(2)}>2 x 2</button>
            <button className="btn btn-sm" onClick={() => setMeshPreset(4)}>4 x 4</button>
            <button className="btn btn-sm" onClick={() => setMeshPreset(8)}>8 x 8</button>
          </div>
        </div>
      )}

      {/* GPU Shader Effects */}
      <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: 10 }}>
        <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", gap: 6, color: "var(--accent-green)" }}>
          <Sparkles size={14} /> GPU SHADER EFFECTS
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text-muted)" }}>
              <span>Brightness</span>
              <span>{surface.effects.brightness.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.05"
              value={surface.effects.brightness}
              onChange={(e) => handleEffectChange("brightness", parseFloat(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text-muted)" }}>
              <span>Contrast</span>
              <span>{surface.effects.contrast.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.05"
              value={surface.effects.contrast}
              onChange={(e) => handleEffectChange("contrast", parseFloat(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text-muted)" }}>
              <span>Saturation</span>
              <span>{surface.effects.saturation.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.05"
              value={surface.effects.saturation}
              onChange={(e) => handleEffectChange("saturation", parseFloat(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text-muted)" }}>
              <span>Hue Rotation</span>
              <span>{Math.round(surface.effects.hue)}°</span>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              step="5"
              value={surface.effects.hue}
              onChange={(e) => handleEffectChange("hue", parseFloat(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
