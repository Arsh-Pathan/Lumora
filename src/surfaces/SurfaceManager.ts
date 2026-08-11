/**
 * LUMORA Surfaces — Surface & Mapping Geometry Manager
 */

import type { ProjectionSurface, SurfaceType } from "../architecture/contracts";
import { createDefaultMesh } from "../graphics/mesh";

export class SurfaceManager {
  public static createSurface(
    name: string,
    type: SurfaceType,
    canvasWidth: number = 1920,
    canvasHeight: number = 1080
  ): ProjectionSurface {
    const id = `surface_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Default centered 640x360 box
    const cx = canvasWidth / 2;
    const cy = canvasHeight / 2;
    const w = 640;
    const h = 360;

    const corners = {
      topLeft: { x: cx - w / 2, y: cy - h / 2 },
      topRight: { x: cx + w / 2, y: cy - h / 2 },
      bottomRight: { x: cx + w / 2, y: cy + h / 2 },
      bottomLeft: { x: cx - w / 2, y: cy + h / 2 }
    };

    const mesh = type === "mesh" ? createDefaultMesh(4, 4, canvasWidth, canvasHeight) : undefined;

    return {
      id,
      name,
      type,
      visible: true,
      locked: false,
      zIndex: 0,
      mediaId: null,
      corners,
      mesh,
      blendMode: "normal",
      effects: {
        brightness: 0,
        contrast: 1,
        saturation: 1,
        hue: 0,
        gamma: 1,
        blur: 0,
        opacity: 1
      }
    };
  }

  public static updateZIndex(surfaces: ProjectionSurface[], targetId: string, newZIndex: number): ProjectionSurface[] {
    return surfaces.map(s => (s.id === targetId ? { ...s, zIndex: newZIndex } : s));
  }
}
