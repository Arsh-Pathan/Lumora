/**
 * LUMORA UI — Fullscreen Secondary Projector Output Window Component
 * Renders ONLY the clean WebGL composition output on the target display.
 * Zero UI, zero cursor, zero window borders, zero scrollbars.
 */

import React from "react";
import { useLumora } from "../context/LumoraContext";
import { CanvasViewport } from "./CanvasViewport";

export const ProjectorWindow: React.FC = () => {
  const { blackout } = useLumora();

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      backgroundColor: "#000000",
      overflow: "hidden",
      cursor: "none",
      margin: 0,
      padding: 0,
      position: "fixed",
      inset: 0
    }}>
      <CanvasViewport />

      {/* Instant Blackout Emergency Override */}
      {blackout && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "#000000",
          zIndex: 9999
        }} />
      )}
    </div>
  );
};
