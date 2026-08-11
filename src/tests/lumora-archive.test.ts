import { describe, it, expect } from "vitest";
import { LumoraArchive } from "../project/LumoraArchive";
import type { ProjectData } from "../project/LumoraArchive";

describe("Native .lumora Project Container Engine", () => {
  it("should serialize and deserialize a .lumora package round-trip correctly", async () => {
    const originalProject: ProjectData = {
      manifest: {
        format: "LUMORA",
        formatVersion: 1,
        applicationVersion: "1.0.0",
        projectName: "Festival Stage Mapping",
        projectResolution: { width: 1920, height: 1080 },
        fps: 60,
        createdAt: "2026-08-11T08:00:00Z",
        updatedAt: "2026-08-11T08:00:00Z"
      },
      settings: {
        projectName: "Festival Stage Mapping",
        resolution: { width: 1920, height: 1080 },
        fps: 60,
        backgroundColor: "#000000",
        autosaveIntervalMinutes: 2
      },
      surfaces: [
        {
          id: "surf-1",
          name: "Main Arch Quad",
          type: "quad",
          visible: true,
          locked: false,
          zIndex: 0,
          mediaId: "media-1",
          corners: {
            topLeft: { x: 10, y: 10 },
            topRight: { x: 900, y: 15 },
            bottomRight: { x: 880, y: 500 },
            bottomLeft: { x: 20, y: 490 }
          },
          blendMode: "normal",
          effects: {
            brightness: 0.1,
            contrast: 1.0,
            saturation: 1.2,
            hue: 0,
            gamma: 1.0,
            blur: 0,
            opacity: 1.0
          }
        }
      ],
      scenes: [
        {
          id: "scene-1",
          name: "INTRO",
          surfaceStates: {},
          transition: "fade",
          transitionDurationMs: 500
        }
      ],
      activeSceneId: "scene-1",
      mediaAssets: [
        {
          id: "media-1",
          filename: "stage_loop.mp4",
          originalPath: "/media/stage_loop.mp4",
          mimeType: "video/mp4",
          mediaType: "video",
          resolution: { width: 1920, height: 1080 },
          duration: 15,
          fps: 60,
          fileSize: 4500000,
          checksum: "sha256_abcd1234",
          isEmbedded: true,
          status: "ready"
        }
      ]
    };

    // Export to zip buffer
    const packageBuffer = await LumoraArchive.exportLumoraPackage(originalProject);
    expect(packageBuffer).toBeInstanceOf(Uint8Array);
    expect(packageBuffer.byteLength).toBeGreaterThan(100);

    // Import back from zip buffer
    const restored = await LumoraArchive.importLumoraPackage(packageBuffer);

    expect(restored.manifest.projectName).toBe("Festival Stage Mapping");
    expect(restored.surfaces.length).toBe(1);
    expect(restored.surfaces[0].name).toBe("Main Arch Quad");
    expect(restored.scenes.length).toBe(1);
    expect(restored.mediaAssets.length).toBe(1);
  });
});
