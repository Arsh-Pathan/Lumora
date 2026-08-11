import { describe, it, expect } from "vitest";
import { computeHomography, transformPoint, scaleCorners, isQuadDegenerate } from "../graphics/matrix";

describe("Homography & Perspective Matrix Math", () => {
  it("should identity transform when target quad is standard unit square", () => {
    const corners = {
      topLeft: { x: 0, y: 0 },
      topRight: { x: 1, y: 0 },
      bottomRight: { x: 1, y: 1 },
      bottomLeft: { x: 0, y: 1 }
    };

    const H = computeHomography(corners);
    const p1 = transformPoint(H, { x: 0, y: 0 });
    const p2 = transformPoint(H, { x: 1, y: 1 });

    expect(p1.x).toBeCloseTo(0);
    expect(p1.y).toBeCloseTo(0);
    expect(p2.x).toBeCloseTo(1);
    expect(p2.y).toBeCloseTo(1);
  });

  it("should transform points for extreme perspective skew", () => {
    const corners = {
      topLeft: { x: 100, y: 50 },
      topRight: { x: 1800, y: 200 },
      bottomRight: { x: 1400, y: 1000 },
      bottomLeft: { x: 200, y: 900 }
    };

    const H = computeHomography(corners);
    const tl = transformPoint(H, { x: 0, y: 0 });
    const br = transformPoint(H, { x: 1, y: 1 });

    expect(tl.x).toBeCloseTo(100);
    expect(tl.y).toBeCloseTo(50);
    expect(br.x).toBeCloseTo(1400);
    expect(br.y).toBeCloseTo(1000);
  });

  it("should detect degenerate / collapsed quads correctly", () => {
    const validCorners = {
      topLeft: { x: 0, y: 0 },
      topRight: { x: 100, y: 0 },
      bottomRight: { x: 100, y: 100 },
      bottomLeft: { x: 0, y: 100 }
    };

    const degenerateCorners = {
      topLeft: { x: 0, y: 0 },
      topRight: { x: 0, y: 0 }, // Collapsed top edge!
      bottomRight: { x: 100, y: 100 },
      bottomLeft: { x: 0, y: 100 }
    };

    expect(isQuadDegenerate(validCorners)).toBe(false);
    expect(isQuadDegenerate(degenerateCorners)).toBe(true);
  });

  it("should scale corner coordinates correctly between 1080p canvas and 4K output", () => {
    const originalCorners = {
      topLeft: { x: 100, y: 100 },
      topRight: { x: 960, y: 100 },
      bottomRight: { x: 960, y: 540 },
      bottomLeft: { x: 100, y: 540 }
    };

    // Scale 1920x1080 -> 3840x2160 (scale factor 2.0)
    const scaled = scaleCorners(originalCorners, 2.0, 2.0);

    expect(scaled.topLeft.x).toBe(200);
    expect(scaled.topLeft.y).toBe(200);
    expect(scaled.topRight.x).toBe(1920);
    expect(scaled.bottomRight.y).toBe(1080);
  });
});
