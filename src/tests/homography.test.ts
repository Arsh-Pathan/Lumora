import { describe, it, expect } from "vitest";
import { computeHomography, transformPoint, invertMatrix3x3 } from "../graphics/matrix";

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

  it("should transform points to arbitrarily pin corners", () => {
    const corners = {
      topLeft: { x: 100, y: 50 },
      topRight: { x: 500, y: 80 },
      bottomRight: { x: 480, y: 400 },
      bottomLeft: { x: 120, y: 380 }
    };

    const H = computeHomography(corners);
    const tl = transformPoint(H, { x: 0, y: 0 });
    const tr = transformPoint(H, { x: 1, y: 0 });
    const br = transformPoint(H, { x: 1, y: 1 });
    const bl = transformPoint(H, { x: 0, y: 1 });

    expect(tl.x).toBeCloseTo(100);
    expect(tl.y).toBeCloseTo(50);
    expect(tr.x).toBeCloseTo(500);
    expect(tr.y).toBeCloseTo(80);
    expect(br.x).toBeCloseTo(480);
    expect(br.y).toBeCloseTo(400);
    expect(bl.x).toBeCloseTo(120);
    expect(bl.y).toBeCloseTo(380);
  });

  it("should invert matrix correctly", () => {
    const corners = {
      topLeft: { x: 10, y: 10 },
      topRight: { x: 200, y: 0 },
      bottomRight: { x: 180, y: 150 },
      bottomLeft: { x: 20, y: 140 }
    };

    const H = computeHomography(corners);
    const invH = invertMatrix3x3(H);

    expect(invH).not.toBeNull();

    if (invH) {
      const orig = { x: 0.5, y: 0.5 };
      const mapped = transformPoint(H, orig);
      const restored = transformPoint(invH, mapped);

      expect(restored.x).toBeCloseTo(orig.x, 3);
      expect(restored.y).toBeCloseTo(orig.y, 3);
    }
  });
});
