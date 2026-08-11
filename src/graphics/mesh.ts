/**
 * LUMORA Graphics — GPU Mesh Warping & Triangulation Engine
 */

import type { Point2D } from "./matrix";

export interface MeshGrid {
  rows: number;
  cols: number;
  points: Point2D[][]; // Grid of points [row][col]
}

/**
 * Creates a default uniform mesh grid for a given row & column density.
 */
export function createDefaultMesh(rows: number, cols: number, width: number, height: number): MeshGrid {
  const points: Point2D[][] = [];

  for (let r = 0; r <= rows; r++) {
    const rowPoints: Point2D[] = [];
    const v = r / rows;
    for (let c = 0; c <= cols; c++) {
      const u = c / cols;
      rowPoints.push({
        x: u * width,
        y: v * height
      });
    }
    points.push(rowPoints);
  }

  return { rows, cols, points };
}

export interface MeshTriangleBuffers {
  vertices: Float32Array;  // [x0, y0, u0, v0, x1, y1, u1, v1, ...]
  indexCount: number;
}

/**
 * Generates WebGL triangle mesh vertex buffers from grid points.
 */
export function buildMeshVertexBuffers(mesh: MeshGrid): MeshTriangleBuffers {
  const { rows, cols, points } = mesh;
  const numTriangles = rows * cols * 2;
  const numVertices = numTriangles * 3;
  const stride = 4; // x, y, u, v

  const buffer = new Float32Array(numVertices * stride);
  let offset = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // 4 corners of current grid cell
      const pTL = points[r][c];
      const pTR = points[r][c + 1];
      const pBR = points[r + 1][c + 1];
      const pBL = points[r + 1][c];

      // UV coordinates
      const u0 = c / cols;
      const u1 = (c + 1) / cols;
      const v0 = r / rows;
      const v1 = (r + 1) / rows;

      // Triangle 1: TL -> TR -> BR
      // Vertex TL
      buffer[offset++] = pTL.x;
      buffer[offset++] = pTL.y;
      buffer[offset++] = u0;
      buffer[offset++] = v0;

      // Vertex TR
      buffer[offset++] = pTR.x;
      buffer[offset++] = pTR.y;
      buffer[offset++] = u1;
      buffer[offset++] = v0;

      // Vertex BR
      buffer[offset++] = pBR.x;
      buffer[offset++] = pBR.y;
      buffer[offset++] = u1;
      buffer[offset++] = v1;

      // Triangle 2: TL -> BR -> BL
      // Vertex TL
      buffer[offset++] = pTL.x;
      buffer[offset++] = pTL.y;
      buffer[offset++] = u0;
      buffer[offset++] = v0;

      // Vertex BR
      buffer[offset++] = pBR.x;
      buffer[offset++] = pBR.y;
      buffer[offset++] = u1;
      buffer[offset++] = v1;

      // Vertex BL
      buffer[offset++] = pBL.x;
      buffer[offset++] = pBL.y;
      buffer[offset++] = u0;
      buffer[offset++] = v1;
    }
  }

  return {
    vertices: buffer,
    indexCount: numVertices
  };
}
