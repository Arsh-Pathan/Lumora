# CHANGELOG

All notable changes to **LUMORA** will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-08-11

### Added
- **Electron + React 18 + TypeScript + Vite Desktop App Shell:** Modular resizable layout, dark aesthetic theme, and multi-display management.
- **Decoupled WebGL 2.0 Renderer Pipeline:** Independent 60 FPS frame rendering decoupled from UI state.
- **4-Point Perspective Mapping & Homography Engine:** 3x3 homography matrix solver for quad corner pinning and perspective distortion.
- **GPU Mesh Warping Engine:** Triangulated grid mesh deformation ($2\times2$, $4\times4$, $8\times8$, Custom).
- **Native `.lumora` Container System:** ZIP container format (`fflate`), JSON manifests, media embedding, checksum verification, and 2-minute interval recovery/autosave.
- **Media Engine Subsystem:** MP4, MOV, WebM video playback with loop, ping-pong, once, hold modes, speed control ($0.1\times$ to $4\times$), and procedural demo visual generators.
- **Show Control Scene System:** Cue triggering, scene transitions (Cut, Fade, Crossfade), transition duration timing, and dedicated live performance **Show Mode**.
- **Live Performance Safety Features:** Instant emergency **BLACKOUT** override and **WHITEOUT** test pattern generator.
- **Projector Calibration & Test Patterns:** Alignment test grids, crosshairs, color bars, checkerboards, pure RGB patterns.
- **"Verify Show" Diagnostics:** Automatic show readiness validator checking resolution, surface geometry, media references, and output displays.
- **Automated Test Suite (Vitest):** Homography matrix tests, ZIP round-trip tests, show verification tests, scene engine tests.
