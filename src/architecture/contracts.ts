/**
 * LUMORA Architecture — Inter-System Contracts & Type Definitions
 */

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

export type SurfaceType = "rectangle" | "quad" | "triangle" | "polygon" | "mesh";

export interface Point2D {
  x: number;
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
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  gamma: number;
  blur: number;
  tintColor?: string;
  opacity: number;
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
  duration: number;
  fps: number;
  fileSize: number;
  checksum: string;
  isEmbedded: boolean;
  status: "ready" | "missing" | "error";
  errorDetails?: string;
  thumbnailUrl?: string;
}

export interface ShowScene {
  id: string;
  name: string;
  surfaceStates: Record<string, Partial<ProjectionSurface>>;
  transition: "cut" | "fade" | "crossfade";
  transitionDurationMs: number;
}
