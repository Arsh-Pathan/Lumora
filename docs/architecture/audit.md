# LUMORA Architecture Audit & Decoupling Report

**Date:** 2026-08-11  
**Audit Target:** Architecture, Coupling, WebGL Pipeline, Thread Isolation  
**Auditor:** Production Engineering Lead  

---

## 1. System Coupling & Separation Audit

| Boundary | Intended Design | Audit Result | Status |
|---|---|---|---|
| **React UI $\rightarrow$ Application State** | UI triggers state changes via Context/Store; React renders only on state updates. | Verified. UI components read from `LumoraContext`. | ✅ PASS |
| **Application State $\rightarrow$ Render Loop** | Render loop consumes state via immutable references / snapshot objects; zero `setState` calls inside RAF loop. | Verified. `CanvasViewport` passes render payload to `WebGLPipeline.render()`. | ✅ PASS |
| **Render Loop $\rightarrow$ WebGL Engine** | Decoupled render loop runs at 60 FPS independent of UI re-renders. | **ISSUE FOUND:** Dynamic buffer creation (`gl.createBuffer()`) inside `renderMeshSurface` allocated and destroyed WebGL buffers every frame, causing garbage collection spikes. Fixed with buffer caching. | ⚠️ FIXED |
| **Editor Window $\rightarrow$ Projector Output** | Editor UI running on Display 1; clean borderless fullscreen WebGL canvas on Display 2 via Electron IPC. | **CRITICAL ISSUE FOUND:** `# /projector` hash route was missing in `App.tsx`, causing projector window to render Editor UI instead of clean canvas. Fixed with route switcher. | 🔴 FIXED |
| **Media Pipeline $\rightarrow$ GPU Textures** | Video elements updated off-screen; frame textures streamed to WebGL textures via `texImage2D`. | **ISSUE FOUND:** Deleted media textures were not freed from `textureCache`, leading to VRAM memory leaks. Fixed with disposal logic. | ⚠️ FIXED |

---

## 2. Memory & GPU Resource Leak Audit

1. **WebGL Buffer Re-allocation:**
   - *Problem:* `renderMeshSurface` invoked `gl.createBuffer()` and `gl.deleteBuffer()` 60 times per second per mesh surface.
   - *Resolution:* Pre-allocate and reuse persistent WebGL VBOs per surface ID.

2. **Texture Cache Cleanup:**
   - *Problem:* `WebGLPipeline.textureCache` retained WebGL textures indefinitely even after surfaces or media assets were removed.
   - *Resolution:* Added `disposeTexture(id)` and `purgeUnusedTextures(activeIds)` to release GPU VRAM.

3. **Media Engine Garbage Collection:**
   - *Problem:* Video DOM elements in `videoPool` were retained after deletion.
   - *Resolution:* Added explicit `unregisterMediaAsset(id)` with `video.pause()`, `video.src = ""`, `video.load()`.
