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

  const [draggingBody, setDraggingBody] = useState<{
    surfaceId: string;
    startX: number;
    startY: number;
    initialCorners: any;
    initialMesh?: any;
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

  const isPointInQuad = (px: number, py: number, corners: any): boolean => {
    const polygon = [corners.topLeft, corners.topRight, corners.bottomRight, corners.bottomLeft];
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].x, yi = polygon[i].y;
      const xj = polygon[j].x, yj = polygon[j].y;
      const intersect = ((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  };

  // Handle Mouse Dragging for Surfaces, Corners & Mesh Nodes
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * project.settings.resolution.width;
    const clickY = ((e.clientY - rect.top) / rect.height) * project.settings.resolution.height;

    // 1. Check if clicking on active surface corner handles
    const activeSurf = project.surfaces.find(s => s.id === selectedSurfaceId);
    if (activeSurf && !activeSurf.locked) {
      const handleRadius = 30;
      for (const key of ["topLeft", "topRight", "bottomRight", "bottomLeft"] as const) {
        const pt = activeSurf.corners[key];
        const dist = Math.hypot(clickX - pt.x, clickY - pt.y);
        if (dist <= handleRadius) {
          setDraggingCorner({ surfaceId: activeSurf.id, cornerName: key });
          return;
        }
      }

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
    }

    // 2. Check if clicking inside any surface polygon body for free movement & selection
    const sortedSurfaces = [...project.surfaces].sort((a, b) => b.zIndex - a.zIndex);
    for (const surface of sortedSurfaces) {
      if (!surface.locked && surface.visible && isPointInQuad(clickX, clickY, surface.corners)) {
        useLumora().selectSurface(surface.id);
        setDraggingBody({
          surfaceId: surface.id,
          startX: clickX,
          startY: clickY,
          initialCorners: JSON.parse(JSON.stringify(surface.corners)),
          initialMesh: surface.mesh ? JSON.parse(JSON.stringify(surface.mesh)) : undefined
        });
        return;
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!draggingCorner && !draggingMeshPoint && !draggingBody) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const currentMouseX = ((e.clientX - rect.left) / rect.width) * project.settings.resolution.width;
    const currentMouseY = ((e.clientY - rect.top) / rect.height) * project.settings.resolution.height;

    if (draggingCorner) {
      const activeSurf = project.surfaces.find(s => s.id === draggingCorner.surfaceId);
      if (activeSurf) {
        const newCorners = {
          ...activeSurf.corners,
          [draggingCorner.cornerName]: { x: currentMouseX, y: currentMouseY }
        };
        updateSurface(activeSurf.id, { corners: newCorners });
      }
    } else if (draggingMeshPoint) {
      const activeSurf = project.surfaces.find(s => s.id === draggingMeshPoint.surfaceId);
      if (activeSurf && activeSurf.mesh) {
        const newPoints = activeSurf.mesh.points.map((row, rIdx) =>
          row.map((pt, cIdx) => (rIdx === draggingMeshPoint.r && cIdx === draggingMeshPoint.c ? { x: currentMouseX, y: currentMouseY } : pt))
        );
        updateSurface(activeSurf.id, { mesh: { ...activeSurf.mesh, points: newPoints } });
      }
    } else if (draggingBody) {
      const dx = currentMouseX - draggingBody.startX;
      const dy = currentMouseY - draggingBody.startY;
      const activeSurf = project.surfaces.find(s => s.id === draggingBody.surfaceId);

      if (activeSurf) {
        const init = draggingBody.initialCorners;
        const newCorners = {
          topLeft: { x: init.topLeft.x + dx, y: init.topLeft.y + dy },
          topRight: { x: init.topRight.x + dx, y: init.topRight.y + dy },
          bottomRight: { x: init.bottomRight.x + dx, y: init.bottomRight.y + dy },
          bottomLeft: { x: init.bottomLeft.x + dx, y: init.bottomLeft.y + dy }
        };

        let newMesh = undefined;
        if (draggingBody.initialMesh) {
          newMesh = {
            ...draggingBody.initialMesh,
            points: draggingBody.initialMesh.points.map((row: any[]) =>
              row.map((pt: any) => ({ x: pt.x + dx, y: pt.y + dy }))
            )
          };
        }

        updateSurface(activeSurf.id, { corners: newCorners, mesh: newMesh });
      }
    }
  };

  const handleMouseUp = () => {
    setDraggingCorner(null);
    setDraggingMeshPoint(null);
    setDraggingBody(null);
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

      {/* Interactive Canvas Overlay Handles & Grid (SVG) */}
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
        <defs>
          {/* Minor Grid Pattern */}
          <pattern
            id="lumora-minor-grid"
            width={gridSize}
            height={gridSize}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
              fill="none"
              stroke="rgba(255, 255, 255, 0.22)"
              strokeWidth="1"
            />
          </pattern>
          {/* Major Grid Pattern (Every 4 Grid Squares) */}
          <pattern
            id="lumora-major-grid"
            width={gridSize * 4}
            height={gridSize * 4}
            patternUnits="userSpaceOnUse"
          >
            <rect width={gridSize * 4} height={gridSize * 4} fill="url(#lumora-minor-grid)" />
            <path
              d={`M ${gridSize * 4} 0 L 0 0 0 ${gridSize * 4}`}
              fill="none"
              stroke="rgba(255, 255, 255, 0.55)"
              strokeWidth="1.5"
            />
          </pattern>
        </defs>

        {/* Snapping Grid Overlay */}
        {gridEnabled && (
          <g>
            <rect
              width={project.settings.resolution.width}
              height={project.settings.resolution.height}
              fill="url(#lumora-major-grid)"
            />
            {/* Center Crosshairs */}
            <line
              x1={project.settings.resolution.width / 2}
              y1={0}
              x2={project.settings.resolution.width / 2}
              y2={project.settings.resolution.height}
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <line
              x1={0}
              y1={project.settings.resolution.height / 2}
              x2={project.settings.resolution.width}
              y2={project.settings.resolution.height / 2}
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            {/* Safe Area Outer Box */}
            <rect
              x={project.settings.resolution.width * 0.05}
              y={project.settings.resolution.height * 0.05}
              width={project.settings.resolution.width * 0.9}
              height={project.settings.resolution.height * 0.9}
              fill="none"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="1"
              strokeDasharray="6 6"
            />
          </g>
        )}
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
