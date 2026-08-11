import { describe, it, expect } from "vitest";
import { createDefaultMesh, buildMeshVertexBuffers } from "../graphics/mesh";

describe("GPU Mesh Warping & Triangulation", () => {
  it("should create default 4x4 mesh grid correctly", () => {
    const mesh = createDefaultMesh(4, 4, 1920, 1080);
    expect(mesh.rows).toBe(4);
    expect(mesh.cols).toBe(4);
    expect(mesh.points.length).toBe(5); // 5 rows of points (0..4)
    expect(mesh.points[0].length).toBe(5);

    // Top-left point
    expect(mesh.points[0][0]).toEqual({ x: 0, y: 0 });
    // Bottom-right point
    expect(mesh.points[4][4]).toEqual({ x: 1920, y: 1080 });
  });

  it("should build valid WebGL triangle vertex buffers for a 2x2 mesh", () => {
    const mesh = createDefaultMesh(2, 2, 1000, 1000);
    const { vertices, indexCount } = buildMeshVertexBuffers(mesh);

    // 2x2 grid has 4 cells. Each cell has 2 triangles = 8 triangles = 24 vertices.
    expect(indexCount).toBe(24);
    // Stride is 4 floats per vertex (x, y, u, v) -> 24 * 4 = 96 floats
    expect(vertices.length).toBe(96);
  });
});
