import { describe, it, expect } from "vitest";
import { ProjectValidator } from "../project/ProjectValidator";
import type { ProjectData } from "../project/LumoraArchive";

describe("Project Validation & Show Verification ('Verify Show')", () => {
  it("should report SHOW READY when all media and settings are valid", () => {
    const validProject: ProjectData = {
      manifest: {
        format: "LUMORA",
        formatVersion: 1,
        applicationVersion: "1.0.0",
        projectName: "Arena Show",
        projectResolution: { width: 1920, height: 1080 },
        fps: 60,
        createdAt: "2026-08-11T08:00:00Z",
        updatedAt: "2026-08-11T08:00:00Z"
      },
      settings: {
        projectName: "Arena Show",
        resolution: { width: 1920, height: 1080 },
        fps: 60,
        backgroundColor: "#000000",
        autosaveIntervalMinutes: 2
      },
      surfaces: [
        {
          id: "surf-1",
          name: "Quad 1",
          type: "quad",
          visible: true,
          locked: false,
          zIndex: 0,
          mediaId: "m1",
          corners: {
            topLeft: { x: 0, y: 0 },
            topRight: { x: 100, y: 0 },
            bottomRight: { x: 100, y: 100 },
            bottomLeft: { x: 0, y: 100 }
          },
          blendMode: "normal",
          effects: { brightness: 0, contrast: 1, saturation: 1, hue: 0, gamma: 1, blur: 0, opacity: 1 }
        }
      ],
      scenes: [{ id: "sc1", name: "Scene 1", surfaceStates: {}, transition: "cut", transitionDurationMs: 0 }],
      activeSceneId: "sc1",
      mediaAssets: [
        {
          id: "m1",
          filename: "visuals.mp4",
          originalPath: "/visuals.mp4",
          mimeType: "video/mp4",
          mediaType: "video",
          resolution: { width: 1920, height: 1080 },
          duration: 30,
          fps: 60,
          fileSize: 1200000,
          checksum: "hash123",
          isEmbedded: true,
          status: "ready"
        }
      ]
    };

    const report = ProjectValidator.verifyShow(validProject, true);
    expect(report.isReady).toBe(true);
    expect(report.statusText).toBe("SHOW READY");
    expect(report.issues.filter(i => i.type === "error").length).toBe(0);
  });

  it("should report SHOW NOT READY when media files are missing", () => {
    const invalidProject: ProjectData = {
      manifest: {
        format: "LUMORA",
        formatVersion: 1,
        applicationVersion: "1.0.0",
        projectName: "Broken Show",
        projectResolution: { width: 1920, height: 1080 },
        fps: 60,
        createdAt: "2026-08-11T08:00:00Z",
        updatedAt: "2026-08-11T08:00:00Z"
      },
      settings: {
        projectName: "Broken Show",
        resolution: { width: 1920, height: 1080 },
        fps: 60,
        backgroundColor: "#000000",
        autosaveIntervalMinutes: 2
      },
      surfaces: [],
      scenes: [],
      activeSceneId: "",
      mediaAssets: [
        {
          id: "m2",
          filename: "missing.mp4",
          originalPath: "/missing.mp4",
          mimeType: "video/mp4",
          mediaType: "video",
          resolution: { width: 1920, height: 1080 },
          duration: 10,
          fps: 30,
          fileSize: 500000,
          checksum: "hash456",
          isEmbedded: false,
          status: "missing"
        }
      ]
    };

    const report = ProjectValidator.verifyShow(invalidProject, false);
    expect(report.isReady).toBe(false);
    expect(report.statusText).toBe("SHOW NOT READY");
    expect(report.issues.some(i => i.code === "MISSING_MEDIA")).toBe(true);
  });
});
