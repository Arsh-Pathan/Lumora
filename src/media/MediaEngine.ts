/**
 * LUMORA Media — Media Engine & Video Playback Controller
 */

import { SampleAssets } from "./SampleAssets";

export type PlaybackMode = "once" | "loop" | "ping-pong" | "hold";

export interface MediaPlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  speed: number;
  loopMode: PlaybackMode;
  pingPongDirection: 1 | -1;
}

export class MediaEngine {
  private videoPool: Map<string, HTMLVideoElement> = new Map();
  private imagePool: Map<string, HTMLImageElement> = new Map();
  private playbackStates: Map<string, MediaPlaybackState> = new Map();
  private animFrameId: number | null = null;

  constructor() {
    this.startLoop();
  }

  private startLoop() {
    const tick = () => {
      this.updatePlayback(0.016);
      this.animFrameId = requestAnimationFrame(tick);
    };
    this.animFrameId = requestAnimationFrame(tick);
  }

  public registerMediaAsset(id: string, url: string, type: "video" | "image") {
    if (type === "video" && !url.startsWith("procedural:")) {
      const video = document.createElement("video");
      video.src = url;
      video.crossOrigin = "anonymous";
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      this.videoPool.set(id, video);
    } else if (type === "image" && !url.startsWith("procedural:")) {
      const img = new Image();
      img.src = url;
      img.crossOrigin = "anonymous";
      this.imagePool.set(id, img);
    }

    if (!this.playbackStates.has(id)) {
      this.playbackStates.set(id, {
        isPlaying: true,
        currentTime: 0,
        duration: 10,
        speed: 1.0,
        loopMode: "loop",
        pingPongDirection: 1
      });
    }
  }

  public updatePlayback(deltaSec: number) {
    for (const [id, state] of this.playbackStates.entries()) {
      if (!state.isPlaying) continue;

      let newTime = state.currentTime + deltaSec * state.speed * state.pingPongDirection;

      if (state.loopMode === "loop") {
        if (newTime >= state.duration) newTime = 0;
      } else if (state.loopMode === "ping-pong") {
        if (newTime >= state.duration) {
          state.pingPongDirection = -1;
          newTime = state.duration;
        } else if (newTime <= 0) {
          state.pingPongDirection = 1;
          newTime = 0;
        }
      } else if (state.loopMode === "once") {
        if (newTime >= state.duration) {
          newTime = state.duration;
          state.isPlaying = false;
        }
      } else if (state.loopMode === "hold") {
        if (newTime >= state.duration) newTime = state.duration;
      }

      state.currentTime = newTime;

      // Sync HTML5 Video element if loaded
      const video = this.videoPool.get(id);
      if (video && Math.abs(video.currentTime - state.currentTime) > 0.3) {
        video.currentTime = state.currentTime;
      }
    }
  }

  public getElementForMedia(id: string, url: string, type: "video" | "image"): HTMLVideoElement | HTMLImageElement | HTMLCanvasElement {
    if (url.startsWith("procedural:")) {
      const state = this.playbackStates.get(id) || { currentTime: 0 };
      return SampleAssets.renderProceduralFrame(url, state.currentTime);
    }

    if (type === "video") {
      const video = this.videoPool.get(id);
      if (video) {
        if (video.paused) video.play().catch(() => {});
        return video;
      }
    } else if (type === "image") {
      const img = this.imagePool.get(id);
      if (img && img.complete) return img;
    }

    // Fallback procedural frame
    return SampleAssets.renderProceduralFrame("test-grid", 0);
  }

  public setPlaybackSpeed(id: string, speed: number) {
    const state = this.playbackStates.get(id);
    if (state) {
      state.speed = speed;
      const video = this.videoPool.get(id);
      if (video) video.playbackRate = speed;
    }
  }

  public setPlaybackMode(id: string, mode: PlaybackMode) {
    const state = this.playbackStates.get(id);
    if (state) state.loopMode = mode;
  }

  public playPause(id: string) {
    const state = this.playbackStates.get(id);
    if (state) {
      state.isPlaying = !state.isPlaying;
      const video = this.videoPool.get(id);
      if (video) {
        if (state.isPlaying) video.play().catch(() => {});
        else video.pause();
      }
    }
  }

  public dispose() {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    this.videoPool.clear();
    this.imagePool.clear();
  }
}
