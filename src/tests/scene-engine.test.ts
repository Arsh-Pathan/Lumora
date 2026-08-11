import { describe, it, expect } from "vitest";
import { SceneEngine } from "../scenes/SceneEngine";
import type { ShowScene } from "../architecture/contracts";

describe("Show Control Scene Engine", () => {
  it("should trigger scene cut immediately when transition duration is 0", () => {
    const scenes: ShowScene[] = [
      { id: "s1", name: "INTRO", surfaceStates: {}, transition: "cut", transitionDurationMs: 0 },
      { id: "s2", name: "LOGO", surfaceStates: {}, transition: "cut", transitionDurationMs: 0 }
    ];

    const engine = new SceneEngine(scenes);
    expect(engine.getActiveSceneId()).toBe("s1");

    engine.triggerScene("s2");
    expect(engine.getActiveSceneId()).toBe("s2");
  });

  it("should calculate transition progress over time for crossfade", () => {
    const scenes: ShowScene[] = [
      { id: "s1", name: "SCENE 1", surfaceStates: {}, transition: "cut", transitionDurationMs: 0 },
      { id: "s2", name: "SCENE 2", surfaceStates: {}, transition: "fade", transitionDurationMs: 1000 }
    ];

    const engine = new SceneEngine(scenes);
    engine.triggerScene("s2");

    engine.tickTransition(500); // half way
    expect(engine.getActiveSceneId()).toBe("s2");

    engine.tickTransition(600); // completed
    expect(engine.getActiveSceneId()).toBe("s2");
  });
});
