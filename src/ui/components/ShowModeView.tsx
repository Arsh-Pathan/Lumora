/**
 * LUMORA UI — Dedicated Live Performance Show Mode View
 */

import React, { useEffect } from "react";
import { useLumora } from "../context/LumoraContext";
import { ShieldAlert, ChevronLeft, ChevronRight, Eye, Monitor } from "lucide-react";

export const ShowModeView: React.FC = () => {
  const {
    project,
    blackout,
    whiteout,
    toggleBlackout,
    toggleWhiteout,
    toggleShowMode,
    triggerScene
  } = useLumora();

  // Keyboard Navigation for Show Mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "1" && project.scenes[0]) triggerScene(project.scenes[0].id);
      if (e.key === "2" && project.scenes[1]) triggerScene(project.scenes[1].id);
      if (e.key === "3" && project.scenes[2]) triggerScene(project.scenes[2].id);
      if (e.key === "4" && project.scenes[3]) triggerScene(project.scenes[3].id);

      const currentIdx = project.scenes.findIndex(s => s.id === project.activeSceneId);
      if (e.key === "ArrowLeft" && currentIdx > 0) {
        triggerScene(project.scenes[currentIdx - 1].id);
      }
      if (e.key === "ArrowRight" && currentIdx < project.scenes.length - 1) {
        triggerScene(project.scenes[currentIdx + 1].id);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [project, triggerScene]);

  const activeScene = project.scenes.find(s => s.id === project.activeSceneId);
  const currentIdx = project.scenes.findIndex(s => s.id === project.activeSceneId);

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      backgroundColor: "#030306",
      zIndex: 900,
      display: "flex",
      flexDirection: "column",
      padding: 24,
      color: "#ffffff"
    }}>
      {/* Show Mode Top Status Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontWeight: 800, fontSize: 20, letterSpacing: "0.08em", color: "var(--accent-blue)" }}>
          <Monitor size={28} />
          LUMORA SHOW MODE
        </div>

        <button className="btn btn-sm" onClick={toggleShowMode} style={{ fontSize: 13, padding: "8px 16px" }}>
          Exit Show Mode (Tab)
        </button>
      </div>

      {/* Emergency Overrides (Huge Touch Buttons) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <button
          onClick={toggleBlackout}
          style={{
            height: 90,
            backgroundColor: blackout ? "var(--accent-red)" : "hsl(355, 60%, 15%)",
            color: "#ffffff",
            border: `2px solid ${blackout ? "#ffffff" : "var(--accent-red)"}`,
            borderRadius: 12,
            fontSize: 24,
            fontWeight: 900,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            boxShadow: blackout ? "0 0 30px rgba(239, 68, 68, 0.8)" : "none"
          }}
        >
          <ShieldAlert size={32} />
          {blackout ? "BLACKOUT ACTIVE (CLICK TO RESTORE)" : "EMERGENCY BLACKOUT (B)"}
        </button>

        <button
          onClick={toggleWhiteout}
          style={{
            height: 90,
            backgroundColor: whiteout ? "#ffffff" : "hsl(230, 20%, 15%)",
            color: whiteout ? "#000000" : "#ffffff",
            border: "2px solid var(--border-color)",
            borderRadius: 12,
            fontSize: 24,
            fontWeight: 900,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12
          }}
        >
          <Eye size={32} />
          WHITEOUT TEST (W)
        </button>
      </div>

      {/* Main Active Scene Indicator */}
      <div style={{
        background: "var(--bg-panel)",
        border: "1px solid var(--accent-blue)",
        borderRadius: 12,
        padding: 24,
        textAlign: "center",
        marginBottom: 24
      }}>
        <div style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.1em" }}>ACTIVE SCENE CUE</div>
        <div style={{ fontSize: 42, fontWeight: 900, color: "var(--accent-blue)", margin: "8px 0" }}>
          {activeScene ? activeScene.name : "NO ACTIVE SCENE"}
        </div>
        <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>
          Transition: {activeScene?.transition.toUpperCase()} ({activeScene?.transitionDurationMs}ms)
        </div>
      </div>

      {/* Scene Grid Buttons (1, 2, 3, 4) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        {project.scenes.map((sc, idx) => {
          const isActive = sc.id === project.activeSceneId;
          return (
            <button
              key={sc.id}
              onClick={() => triggerScene(sc.id)}
              style={{
                height: 100,
                backgroundColor: isActive ? "hsl(215, 80%, 25%)" : "var(--bg-panel)",
                color: "#ffffff",
                border: `2px solid ${isActive ? "var(--accent-blue)" : "var(--border-color)"}`,
                borderRadius: 12,
                fontSize: 18,
                fontWeight: 800,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 6
              }}
            >
              <span style={{ fontSize: 12, color: "var(--text-muted)" }}>SCENE {idx + 1} ({idx + 1})</span>
              {sc.name}
            </button>
          );
        })}
      </div>

      {/* Prev / Next Navigation Controls */}
      <div style={{ display: "flex", gap: 16, marginTop: "auto" }}>
        <button
          className="btn"
          style={{ flex: 1, height: 60, fontSize: 18, fontWeight: 700, justifyContent: "center" }}
          disabled={currentIdx <= 0}
          onClick={() => currentIdx > 0 && triggerScene(project.scenes[currentIdx - 1].id)}
        >
          <ChevronLeft size={24} /> PREVIOUS SCENE (Left)
        </button>

        <button
          className="btn"
          style={{ flex: 1, height: 60, fontSize: 18, fontWeight: 700, justifyContent: "center" }}
          disabled={currentIdx >= project.scenes.length - 1}
          onClick={() => currentIdx < project.scenes.length - 1 && triggerScene(project.scenes[currentIdx + 1].id)}
        >
          NEXT SCENE (Right) <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};
