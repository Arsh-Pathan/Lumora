/**
 * LUMORA UI — Interactive Canvas Viewport Component
 */

import React, { useRef, useEffect, useState } from "react";
import { useLumora } from "../context/LumoraContext";
import { WebGLPipeline } from "../../renderer/WebGLPipeline";
import type { SurfaceRenderConfig } from "../../renderer/WebGLPipeline";
import { MediaEngine } from "../../media/MediaEngine";

export const CanvasViewport: React.FC = () => {
  const {
    project,
    selectedSurfaceId,
    blackout,
    whiteout,
    calibrationMode,
    calibrationPattern,
    updateSurface,
    gridEnabled,
    gridSize
  } = useLumora();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pipelineRef = useRef<WebGLPipeline | null>(null);
  const mediaEngineRef = useRef<MediaEngine | null>(null);

  const [draggingCorner, setDraggingCorner] = useState<{
    surfaceId: string;
    cornerName: "topLeft" | "topRight" | "bottomRight" | "bottomLeft";
  } | null>(null);

  const [draggingMeshPoint, setDraggingMeshPoint] = useState<{
    surfaceId: string;
    r: number;
    c: number;
  } | null>(null);

  // Initialize WebGL pipeline & media engine
  useEffect(() => {
    if (canvasRef.current && !pipelineRef.current) {
      pipelineRef.current = new WebGLPipeline(canvasRef.current);
    }
    if (!mediaEngineRef.current) {
      mediaEngineRef.current = new MediaEngine();
    }
    return () => {
      pipelineRef.current?.dispose();
      mediaEngineRef.current?.dispose();
    };
  }, []);

  // Main Render Loop tick
  useEffect(() => {
    let animId: number;

    const renderLoop = () => {
      if (pipelineRef.current && mediaEngineRef.current) {
        const renderSurfaces: SurfaceRenderConfig[] = project.surfaces.map(surface => {
          let textureElement: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement | null = null;
          if (surface.mediaId) {
            const asset = project.mediaAssets.find(m => m.id === surface.mediaId);
            if (asset) {
              textureElement = mediaEngineRef.current!.getElementForMedia(asset.id, asset.originalPath, asset.mediaType);
            }
          }

          return {
            id: surface.id,
            name: surface.name,
            type: surface.type,
            visible: surface.visible,
            opacity: surface.effects?.opacity ?? 1,
            zIndex: surface.zIndex,
            corners: surface.corners,
            mesh: surface.mesh,
            effects: surface.effects,
            blendMode: surface.blendMode,
            textureElement: textureElement as any
          };
        });

        pipelineRef.current.render({
          width: project.settings.resolution.width,
          height: project.settings.resolution.height,
          surfaces: renderSurfaces,
          blackout,
          whiteout,
          calibrationMode,
          calibrationPattern
        });
      }

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animId);
  }, [project, blackout, whiteout, calibrationMode, calibrationPattern]);

  // Handle Mouse Dragging for Corner Pins & Mesh Warp Nodes
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * project.settings.resolution.width;
    const clickY = ((e.clientY - rect.top) / rect.height) * project.settings.resolution.height;

    const activeSurf = project.surfaces.find(s => s.id === selectedSurfaceId);
    if (!activeSurf || activeSurf.locked) return;

    // Check corners
    const handleRadius = 25;
    for (const key of ["topLeft", "topRight", "bottomRight", "bottomLeft"] as const) {
      const pt = activeSurf.corners[key];
      const dist = Math.hypot(clickX - pt.x, clickY - pt.y);
      if (dist <= handleRadius) {
        setDraggingCorner({ surfaceId: activeSurf.id, cornerName: key });
        return;
      }
    }

    // Check mesh points
    if (activeSurf.type === "mesh" && activeSurf.mesh) {
      for (let r = 0; r <= activeSurf.mesh.rows; r++) {
        for (let c = 0; c <= activeSurf.mesh.cols; c++) {
          const pt = activeSurf.mesh.points[r][c];
          const dist = Math.hypot(clickX - pt.x, clickY - pt.y);
          if (dist <= handleRadius) {
            setDraggingMeshPoint({ surfaceId: activeSurf.id, r, c });
            return;
          }
        }
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!draggingCorner && !draggingMeshPoint) return;
    const rect = e.currentTarget.getBoundingClientRect();
    let moveX = Math.max(0, Math.min(project.settings.resolution.width, ((e.clientX - rect.left) / rect.width) * project.settings.resolution.width));
    let moveY = Math.max(0, Math.min(project.settings.resolution.height, ((e.clientY - rect.top) / rect.height) * project.settings.resolution.height));

    if (gridEnabled) {
      moveX = Math.round(moveX / gridSize) * gridSize;
      moveY = Math.round(moveY / gridSize) * gridSize;
    }

    if (draggingCorner) {
      const activeSurf = project.surfaces.find(s => s.id === draggingCorner.surfaceId);
      if (activeSurf) {
        const newCorners = {
          ...activeSurf.corners,
          [draggingCorner.cornerName]: { x: moveX, y: moveY }
        };
        updateSurface(activeSurf.id, { corners: newCorners });
      }
    } else if (draggingMeshPoint) {
      const activeSurf = project.surfaces.find(s => s.id === draggingMeshPoint.surfaceId);
      if (activeSurf && activeSurf.mesh) {
        const newPoints = activeSurf.mesh.points.map((row, rIdx) =>
          row.map((pt, cIdx) => (rIdx === draggingMeshPoint.r && cIdx === draggingMeshPoint.c ? { x: moveX, y: moveY } : pt))
        );
        updateSurface(activeSurf.id, { mesh: { ...activeSurf.mesh, points: newPoints } });
      }
    }
  };

  const handleMouseUp = () => {
    setDraggingCorner(null);
    setDraggingMeshPoint(null);
  };

  const activeSurface = project.surfaces.find(s => s.id === selectedSurfaceId);

  return (
    <div
      className="canvas-container"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* WebGL Render Canvas */}
      <canvas
        ref={canvasRef}
        width={project.settings.resolution.width}
        height={project.settings.resolution.height}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          boxShadow: "0 0 30px rgba(0,0,0,0.8)"
        }}
      />

      {/* Emergency Blackout Overlay Banner */}
      {blackout && (
        <div className="blackout-active-overlay">
          🚨 EMERGENCY BLACKOUT ACTIVE
        </div>
      )}

      {/* Interactive Canvas Overlay Handles (SVG) */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none"
        }}
        viewBox={`0 0 ${project.settings.resolution.width} ${project.settings.resolution.height}`}
      >
        {/* Draw interactive handles for selected surface */}
        {activeSurface && !activeSurface.locked && (
          <g>
            {/* Outline quad polygon */}
            <polygon
              points={`
                ${activeSurface.corners.topLeft.x},${activeSurface.corners.topLeft.y}
                ${activeSurface.corners.topRight.x},${activeSurface.corners.topRight.y}
                ${activeSurface.corners.bottomRight.x},${activeSurface.corners.bottomRight.y}
                ${activeSurface.corners.bottomLeft.x},${activeSurface.corners.bottomLeft.y}
              `}
              fill="rgba(79, 148, 255, 0.1)"
              stroke="var(--accent-blue)"
              strokeWidth="2"
              strokeDasharray="4"
            />

            {/* 4 Corner Pin Drag Handles */}
            {(["topLeft", "topRight", "bottomRight", "bottomLeft"] as const).map(key => {
              const pt = activeSurface.corners[key];
              return (
                <g key={key}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="10"
                    fill="var(--accent-blue)"
                    stroke="#ffffff"
                    strokeWidth="2"
                    style={{ cursor: "grab" }}
                  />
                  <text x={pt.x + 12} y={pt.y + 4} fill="#ffffff" fontSize="14" fontWeight="bold">
                    {key.replace("top", "T").replace("bottom", "B").replace("Left", "L").replace("Right", "R")}
                  </text>
                </g>
              );
            })}

            {/* Mesh Warp Grid Points */}
            {activeSurface.type === "mesh" && activeSurface.mesh && activeSurface.mesh.points.map((row, r) =>
              row.map((pt, c) => (
                <circle
                  key={`mesh_${r}_${c}`}
                  cx={pt.x}
                  cy={pt.y}
                  r="6"
                  fill="var(--accent-yellow)"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              ))
            )}
          </g>
        )}
      </svg>
    </div>
  );
};
