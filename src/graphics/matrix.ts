/**
 * LUMORA Graphics — 3x3 Homography Matrix & Perspective Math Engine
 */

export type Matrix3x3 = [
  number, number, number,
  number, number, number,
  number, number, number
];

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

/**
 * Computes a 3x3 Homography matrix that maps unit square (0..1, 0..1) to target quad corners.
 */
export function computeHomography(corners: QuadCorners): Matrix3x3 {
  const { topLeft: p0, topRight: p1, bottomRight: p2, bottomLeft: p3 } = corners;

  const dx1 = p1.x - p2.x;
  const dx2 = p3.x - p2.x;
  const dx3 = p0.x - p1.x + p2.x - p3.x;

  const dy1 = p1.y - p2.y;
  const dy2 = p3.y - p2.y;
  const dy3 = p0.y - p1.y + p2.y - p3.y;

  if (Math.abs(dx3) < 1e-7 && Math.abs(dy3) < 1e-7) {
    // Affine transformation case
    return [
      p1.x - p0.x, p3.x - p0.x, p0.x,
      p1.y - p0.y, p3.y - p0.y, p0.y,
      0, 0, 1
    ];
  }

  const det = dx1 * dy2 - dx2 * dy1;
  const a31 = (dx3 * dy2 - dx2 * dy3) / (Math.abs(det) < 1e-7 ? 1e-7 : det);
  const a32 = (dx1 * dy3 - dx3 * dy1) / (Math.abs(det) < 1e-7 ? 1e-7 : det);

  const a11 = p1.x - p0.x + a31 * p1.x;
  const a12 = p3.x - p0.x + a32 * p3.x;
  const a13 = p0.x;

  const a21 = p1.y - p0.y + a31 * p1.y;
  const a22 = p3.y - p0.y + a32 * p3.y;
  const a23 = p0.y;

  return [
    a11, a12, a13,
    a21, a22, a23,
    a31, a32, 1.0
  ];
}

/**
 * Transforms a 2D point (u, v) using a 3x3 Homography Matrix.
 */
export function transformPoint(m: Matrix3x3, p: Point2D): Point2D {
  const x = m[0] * p.x + m[1] * p.y + m[2];
  const y = m[3] * p.x + m[4] * p.y + m[5];
  const w = m[6] * p.x + m[7] * p.y + m[8];

  const safeW = Math.abs(w) < 1e-7 ? 1e-7 : w;
  return {
    x: x / safeW,
    y: y / safeW
  };
}

/**
 * Inverts a 3x3 Matrix.
 */
export function invertMatrix3x3(m: Matrix3x3): Matrix3x3 | null {
  const [a11, a12, a13, a21, a22, a23, a31, a32, a33] = m;

  const det =
    a11 * (a22 * a33 - a23 * a32) -
    a12 * (a21 * a33 - a23 * a31) +
    a13 * (a21 * a32 - a22 * a31);

  if (Math.abs(det) < 1e-7) return null;

  const invDet = 1.0 / det;

  return [
    (a22 * a33 - a23 * a32) * invDet,
    (a13 * a32 - a12 * a33) * invDet,
    (a12 * a23 - a13 * a22) * invDet,

    (a23 * a31 - a21 * a33) * invDet,
    (a11 * a33 - a13 * a31) * invDet,
    (a13 * a21 - a11 * a23) * invDet,

    (a21 * a32 - a22 * a31) * invDet,
    (a12 * a31 - a11 * a32) * invDet,
    (a11 * a22 - a12 * a21) * invDet
  ];
}

/**
 * Converts a 3x3 Homography Matrix to a 4x4 matrix for WebGL uniform Matrix4fv.
 */
export function matrix3To4(m3: Matrix3x3): Float32Array {
  return new Float32Array([
    m3[0], m3[3], 0, m3[6],
    m3[1], m3[4], 0, m3[7],
    0,     0,     1, 0,
    m3[2], m3[5], 0, m3[8]
  ]);
}
