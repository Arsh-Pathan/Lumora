/**
 * LUMORA UI — Scene & Cue Control Panel Component
 */

import React, { useState } from "react";
import { useLumora } from "../context/LumoraContext";
import { Play, Plus, Zap } from "lucide-react";

export const ScenePanel: React.FC = () => {
  const { project, triggerScene, addScene } = useLumora();
  const [newSceneName, setNewSceneName] = useState("");

  const handleAddScene = () => {
    if (!newSceneName.trim()) return;
    addScene(newSceneName.trim());
    setNewSceneName("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Create Scene Input */}
      <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
        <input
          className="input-field"
          placeholder="New Scene Name..."
          value={newSceneName}
          onChange={(e) => setNewSceneName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddScene()}
        />
        <button className="btn btn-sm btn-primary" onClick={handleAddScene}>
          <Plus size={14} /> Add
        </button>
      </div>

      {/* Cue List */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {project.scenes.map((scene, idx) => {
          const isActive = project.activeSceneId === scene.id;
          return (
            <div
              key={scene.id}
              className={`list-item ${isActive ? "selected" : ""}`}
              onClick={() => triggerScene(scene.id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 10px",
                marginBottom: 4,
                backgroundColor: isActive ? "hsl(215, 60%, 18%)" : "var(--bg-input)",
                border: `1px solid ${isActive ? "var(--accent-blue)" : "var(--border-color)"}`
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)", width: 18 }}>
                  0{idx + 1}
                </span>
                <span style={{ fontWeight: isActive ? 700 : 600, fontSize: 12 }}>{scene.name}</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                  {scene.transition.toUpperCase()} ({scene.transitionDurationMs}ms)
                </span>
                <button className={`btn btn-sm ${isActive ? "btn-primary" : ""}`} style={{ padding: "3px 8px" }}>
                  <Play size={12} /> CUE
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ padding: "6px 0 0 0", fontSize: 10, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
        <Zap size={12} color="var(--accent-yellow)" /> Press keys 1-9 for quick scene triggers
      </div>
    </div>
  );
};
