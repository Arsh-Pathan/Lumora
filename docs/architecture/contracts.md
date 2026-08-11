# Inter-System Contracts & Interfaces

This document defines the stable data structures and contract interfaces exchanged between subsystems in LUMORA.

---

## 1. Project Manifest Interface (`ManifestV1`)

```typescript
export interface ProjectManifest {
  format: "LUMORA";
  formatVersion: 1;
  applicationVersion: string;
  projectName: string;
  projectResolution: {
    width: number;
    height: number;
  };
  fps: number;
  createdAt: string;
  updatedAt: string;
}
```

---

## 2. Surface Model (`ProjectionSurface`)

```typescript
export type SurfaceType = "rectangle" | "quad" | "triangle" | "polygon" | "mesh";

export interface Point2D {
  x: number; // Normalized 0..1 or Canvas Pixels
  y: number;
}

export interface QuadCorners {
  topLeft: Point2D;
  topRight: Point2D;
  bottomRight: Point2D;
  bottomLeft: Point2D;
}

export interface MeshGrid {
  rows: number;
  cols: number;
  points: Point2D[][];
}

export interface ShaderEffects {
  brightness: number;  // -1.0 to 1.0
  contrast: number;    // 0.0 to 2.0
  saturation: number;  // 0.0 to 2.0
  hue: number;         // -180 to 180 deg
  gamma: number;       // 0.1 to 3.0
  blur: number;        // 0.0 to 20.0 px
  tintColor?: string;  // Hex color #RRGGBB
  opacity: number;     // 0.0 to 1.0
}

export type BlendMode = "normal" | "add" | "screen" | "multiply" | "overlay" | "lighten" | "darken";

export interface ProjectionSurface {
  id: string;
  name: string;
  type: SurfaceType;
  visible: boolean;
  locked: boolean;
  zIndex: number;
  mediaId: string | null;
  corners: QuadCorners;
  mesh?: MeshGrid;
  polygonPoints?: Point2D[];
  blendMode: BlendMode;
  effects: ShaderEffects;
  mask?: {
    type: "rectangle" | "ellipse" | "polygon";
    points?: Point2D[];
    feather: number;
    inverted: boolean;
  };
}
```

---

## 3. Media Asset Interface (`MediaAsset`)

```typescript
export interface MediaAsset {
  id: string;
  filename: string;
  originalPath: string;
  mimeType: string;
  mediaType: "image" | "video";
  resolution: {
    width: number;
    height: number;
  };
  duration: number; // in seconds (0 for images)
  fps: number;
  fileSize: number;
  checksum: string;
  isEmbedded: boolean;
  status: "ready" | "missing" | "error";
  errorDetails?: string;
  thumbnailUrl?: string;
}
```

---

## 4. Scene & Cue Contract (`ShowScene`)

```typescript
export interface ShowScene {
  id: string;
  name: string;
  surfaceStates: Record<string, Partial<ProjectionSurface>>;
  transition: "cut" | "fade" | "crossfade";
  transitionDurationMs: number;
}
```

---

## 5. Renderer Frame State Payload (`RenderPayload`)

```typescript
export interface RenderPayload {
  surfaces: ProjectionSurface[];
  mediaMap: Map<string, HTMLVideoElement | HTMLImageElement | ImageBitmap>;
  canvasSize: { width: number; height: number };
  blackout: boolean;
  whiteout: boolean;
  calibrationMode: boolean;
  calibrationPattern: "grid" | "crosshair" | "checkerboard" | "colorbars" | "red" | "green" | "blue" | "white" | "black";
}
```
