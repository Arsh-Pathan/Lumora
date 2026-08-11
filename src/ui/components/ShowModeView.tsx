/**
 * LUMORA UI — Premium Google Material 3 Dark Monochrome Live Show Mode
 */

import React, { useEffect, useState } from "react";
import { useLumora } from "../context/LumoraContext";
import { LumoraLogo } from "./LumoraLogo";
import { ShieldAlert, ChevronLeft, ChevronRight, Eye, Activity, Clock } from "lucide-react";

export const ShowModeView: React.FC = () => {
  const {
    project,
    blackout,
    whiteout,
    toggleBlackout,
    toggleWhiteout,
    toggleShowMode,
    triggerScene,
    fps,
    frameTimeMs
  } = useLumora();

  const [timeString, setTimeString] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString());
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard Navigation for Live Show Mode
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
      backgroundColor: "#000000",
      zIndex: 990,
      display: "flex",
      flexDirection: "column",
      padding: 24,
      color: "#ffffff"
    }}>
      {/* Show Mode Top Bar */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 20,
        borderBottom: "1px solid var(--border-subtle)",
        marginBottom: 24
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <LumoraLogo size={28} showText={true} />
          <span style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.12em",
            backgroundColor: "#ffffff",
            color: "#000000",
            padding: "3px 8px",
            borderRadius: 4
          }}>
            LIVE SHOW CONTROL
          </span>
        </div>

        {/* Live Clock & FPS Performance */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 13, fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Clock size={16} />
            {timeString}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Activity size={16} />
            {fps} FPS ({frameTimeMs}ms)
          </div>

          <button
            onClick={toggleShowMode}
            style={{
              backgroundColor: "var(--bg-surface)",
              color: "#ffffff",
              border: "1px solid var(--border-subtle)",
              borderRadius: "20px",
              padding: "8px 18px",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Exit Show Mode (Tab)
          </button>
        </div>
      </div>

      {/* Emergency Overrides (Huge Touch Buttons) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        <button
          onClick={toggleBlackout}
          style={{
            height: 90,
            backgroundColor: blackout ? "#ffffff" : "var(--bg-surface)",
            color: blackout ? "#000000" : "#ffffff",
            border: `2px solid ${blackout ? "#ffffff" : "var(--border-subtle)"}`,
            borderRadius: 12,
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: "0.06em",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            boxShadow: blackout ? "0 0 30px rgba(255, 255, 255, 0.4)" : "none"
          }}
        >
          <ShieldAlert size={32} />
          {blackout ? "🚨 BLACKOUT ON (CLICK TO RESTORE)" : "EMERGENCY BLACKOUT (B)"}
        </button>

        <button
          onClick={toggleWhiteout}
          style={{
            height: 90,
            backgroundColor: whiteout ? "#ffffff" : "var(--bg-surface)",
            color: whiteout ? "#000000" : "#ffffff",
            border: `2px solid ${whiteout ? "#ffffff" : "var(--border-subtle)"}`,
            borderRadius: 12,
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: "0.06em",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12
          }}
        >
          <Eye size={32} />
          WHITEOUT GRID TEST (W)
        </button>
      </div>

      {/* Active Scene Cue Banner */}
      <div style={{
        background: "var(--bg-panel)",
        border: "1px solid #ffffff",
        borderRadius: 12,
        padding: "24px 32px",
        textAlign: "center",
        marginBottom: 24
      }}>
        <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 800, letterSpacing: "0.15em", textTransform: "uppercase" }}>
          CURRENT STAGE CUE
        </div>
        <div style={{ fontSize: 44, fontWeight: 900, color: "#ffffff", letterSpacing: "0.05em", margin: "8px 0" }}>
          {activeScene ? activeScene.name : "NO ACTIVE SCENE"}
        </div>
        <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          Transition: {activeScene?.transition.toUpperCase()} ({activeScene?.transitionDurationMs}ms)
        </div>
      </div>

      {/* Numbered Scene Trigger Tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
        {project.scenes.map((sc, idx) => {
          const isActive = sc.id === project.activeSceneId;
          return (
            <button
              key={sc.id}
              onClick={() => triggerScene(sc.id)}
              style={{
                height: 110,
                backgroundColor: isActive ? "#ffffff" : "var(--bg-surface)",
                color: isActive ? "#000000" : "#ffffff",
                border: `2px solid ${isActive ? "#ffffff" : "var(--border-subtle)"}`,
                borderRadius: 12,
                fontSize: 20,
                fontWeight: 800,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                boxShadow: isActive ? "0 4px 16px rgba(255,255,255,0.3)" : "none"
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 800, opacity: 0.8 }}>CUE {idx + 1} (Key: {idx + 1})</span>
              {sc.name}
            </button>
          );
        })}
      </div>

      {/* Previous / Next Navigation Controls */}
      <div style={{ display: "flex", gap: 16, marginTop: "auto" }}>
        <button
          className="btn"
          style={{ flex: 1, height: 60, fontSize: 18, fontWeight: 800, justifyContent: "center", borderRadius: "12px" }}
          disabled={currentIdx <= 0}
          onClick={() => currentIdx > 0 && triggerScene(project.scenes[currentIdx - 1].id)}
        >
          <ChevronLeft size={24} /> PREVIOUS CUE (Left Arrow)
        </button>

        <button
          className="btn"
          style={{ flex: 1, height: 60, fontSize: 18, fontWeight: 800, justifyContent: "center", borderRadius: "12px" }}
          disabled={currentIdx >= project.scenes.length - 1}
          onClick={() => currentIdx < project.scenes.length - 1 && triggerScene(project.scenes[currentIdx + 1].id)}
        >
          NEXT CUE (Right Arrow) <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};
