/**
 * LUMORA Show Control — Scene & Cue System Engine
 */

import type { ShowScene, ProjectionSurface } from "../architecture/contracts";

export interface SceneTransitionState {
  isTransitioning: boolean;
  fromSceneId: string;
  toSceneId: string;
  progress: number; // 0.0 to 1.0
  durationMs: number;
  type: "cut" | "fade" | "crossfade";
}

export class SceneEngine {
  private scenes: Map<string, ShowScene> = new Map();
  private activeSceneId: string = "";
  private transitionState: SceneTransitionState | null = null;

  constructor(initialScenes: ShowScene[] = []) {
    for (const sc of initialScenes) {
      this.scenes.set(sc.id, sc);
    }
    if (initialScenes.length > 0) {
      this.activeSceneId = initialScenes[0].id;
    }
  }

  public getActiveSceneId(): string {
    return this.activeSceneId;
  }

  public getScenes(): ShowScene[] {
    return Array.from(this.scenes.values());
  }

  public addScene(scene: ShowScene) {
    this.scenes.set(scene.id, scene);
    if (!this.activeSceneId) this.activeSceneId = scene.id;
  }

  public triggerScene(sceneId: string, durationOverrideMs?: number) {
    const target = this.scenes.get(sceneId);
    if (!target) return;

    const duration = durationOverrideMs !== undefined ? durationOverrideMs : target.transitionDurationMs;

    if (duration <= 0 || target.transition === "cut") {
      this.activeSceneId = sceneId;
      this.transitionState = null;
    } else {
      this.transitionState = {
        isTransitioning: true,
        fromSceneId: this.activeSceneId,
        toSceneId: sceneId,
        progress: 0.0,
        durationMs: duration,
        type: target.transition
      };
      this.activeSceneId = sceneId;
    }
  }

  public tickTransition(deltaMs: number) {
    if (!this.transitionState) return;

    this.transitionState.progress += deltaMs / this.transitionState.durationMs;
    if (this.transitionState.progress >= 1.0) {
      this.transitionState.progress = 1.0;
      this.transitionState.isTransitioning = false;
      this.transitionState = null;
    }
  }

  /**
   * Blends surface properties according to scene transition progress.
   */
  public applySceneToSurfaces(baseSurfaces: ProjectionSurface[]): ProjectionSurface[] {
    const currentScene = this.scenes.get(this.activeSceneId);
    if (!currentScene) return baseSurfaces;

    return baseSurfaces.map(surface => {
      const sceneState = currentScene.surfaceStates[surface.id];
      if (!sceneState) return surface;

      let merged = { ...surface, ...sceneState };

      // Handle transition crossfade opacity blending
      if (this.transitionState && this.transitionState.isTransitioning) {
        const p = this.transitionState.progress;
        merged.effects = {
          ...merged.effects,
          opacity: (merged.effects?.opacity ?? 1.0) * p
        };
      }

      return merged;
    });
  }
}
