/**
 * LUMORA Media — Procedural Demo Assets & Sample Visual Generators
 */

export interface SampleMediaItem {
  id: string;
  name: string;
  type: "video" | "image";
  url: string;
  resolution: { width: number; height: number };
  duration: number;
}

/**
 * Generates procedural animated canvas textures (Cyber Tunnel, Neon Grid, Laser Beams)
 * when local media files are not uploaded yet.
 */
export class SampleAssets {
  private static canvasCache: Map<string, HTMLCanvasElement> = new Map();

  public static getSampleItems(): SampleMediaItem[] {
    return [
      {
        id: "sample-neon-cyber",
        name: "Cyber Neon Grid",
        type: "video",
        url: "procedural:neon-grid",
        resolution: { width: 1920, height: 1080 },
        duration: 10
      },
      {
        id: "sample-laser-tunnel",
        name: "Laser Tunnel Loop",
        type: "video",
        url: "procedural:laser-tunnel",
        resolution: { width: 1920, height: 1080 },
        duration: 12
      },
      {
        id: "sample-abstract-fluid",
        name: "Abstract Fluid Dynamics",
        type: "video",
        url: "procedural:abstract-fluid",
        resolution: { width: 1920, height: 1080 },
        duration: 15
      },
      {
        id: "sample-test-grid",
        name: "Projector Test Pattern",
        type: "image",
        url: "procedural:test-grid",
        resolution: { width: 1920, height: 1080 },
        duration: 0
      }
    ];
  }

  /**
   * Generates a procedural frame canvas for demo playback.
   */
  public static renderProceduralFrame(key: string, timeSec: number, width: number = 640, height: number = 360): HTMLCanvasElement {
    let canvas = this.canvasCache.get(key);
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      this.canvasCache.set(key, canvas);
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return canvas;

    ctx.fillStyle = "#030308";
    ctx.fillRect(0, 0, width, height);

    if (key.includes("neon-grid")) {
      // Cyber Neon Grid Animation
      ctx.strokeStyle = "rgba(79, 148, 255, 0.8)";
      ctx.lineWidth = 2;
      const offset = (timeSec * 60) % 40;

      for (let x = 0; x <= width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = offset; y <= height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Moving glowing pulse
      const cx = (Math.sin(timeSec * 2) * 0.4 + 0.5) * width;
      const cy = (Math.cos(timeSec * 2) * 0.4 + 0.5) * height;
      const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 180);
      grad.addColorStop(0, "rgba(255, 50, 150, 0.9)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else if (key.includes("laser-tunnel")) {
      // Laser Tunnel Animation
      const cx = width / 2;
      const cy = height / 2;
      const numRings = 10;
      for (let i = 0; i < numRings; i++) {
        const radius = (((i * 40 + timeSec * 100) % (numRings * 40)) / (numRings * 40)) * (width / 2);
        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(1, radius), 0, Math.PI * 2);
        ctx.strokeStyle = `hsl(${(i * 36 + timeSec * 50) % 360}, 100%, 60%)`;
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    } else {
      // Default Test Grid Pattern
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1;
      ctx.strokeRect(10, 10, width - 20, height - 20);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(width, height);
      ctx.moveTo(width, 0);
      ctx.lineTo(0, height);
      ctx.stroke();
    }

    return canvas;
  }
}
