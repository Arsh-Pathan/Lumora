# LUMORA — Projection Mapping & Show Control Software

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/lumora/lumora)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/lumora/lumora/actions)

> **LUMORA** is a real-time, GPU-accelerated desktop application designed for projection mapping, live event visuals, stage shows, architectural mapping, festival VJing, installations, weddings, and theater performances.

---

## 🌟 Key Features

- 🎭 **Multi-Surface Projection Mapping:** Rectangle, Quad (4-Point Corner Pinning), Triangle, Arbitrary Polygons, and Adjustable Mesh Warping ($2\times2$, $4\times4$, $8\times8$, Custom points).
- 🎬 **Hardware-Accelerated Video Engine:** Smooth synchronized playback of MP4, MOV, WebM videos, and PNG/JPG/WebP/SVG images with Loop, Ping-Pong, Speed ($0.1\times$ to $4\times$) controls.
- ⚡ **Independent 60 FPS GPU Renderer:** WebGL 2.0 rendering loop decoupled from React state for zero-stutter live performance.
- 📺 **Multi-Monitor Projector Routing:** Independent, borderless, fullscreen projector output with zero editor UI leakage.
- 🚨 **Live Show Control & Safety:** Scenes, cues, smooth transitions (Cut, Fade, Crossfade), instant **BLACKOUT** and **WHITEOUT** test pattern overrides.
- 📐 **Projector Calibration:** Built-in alignment test grids, crosshairs, color bars, checkerboards, and RGB patterns.
- 📦 **Native Portable `.lumora` Container:** Single-file self-contained archives with SHA-256 media verification, external media packaging ("Collect Media"), autosave, and crash recovery.

---

## 🖥️ System Architecture

```text
┌────────────────────────────────────────────────────────┐
│                      ELECTRON MAIN                     │
└──────────────────────────┬─────────────────────────────┘
                           │
         ┌─────────────────┴─────────────────┐
         ▼                                   ▼
┌──────────────────┐               ┌────────────────────┐
│  EDITOR WINDOW   │               │ PROJECTOR OUTPUT 1 │
│  React 18 + UI   │               │  Borderless Canvas │
└────────┬─────────┘               └────────────────────┘
         │
         ▼
┌──────────────────┐
│  WEBGL 2 ENGINE  │ ──► GPU Draw Calls ──► Projector Screens
│  Homography Pin  │
│  Mesh Deform     │
│  Shader Effects  │
└──────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- **GPU**: OpenGL 3.3 / WebGL 2.0 compatible graphics card

### Installation

```bash
# Clone repository
git clone https://github.com/lumora/lumora.git
cd lumora

# Install dependencies
npm install

# Run application in development mode
npm run dev

# Run test suite
npm test

# Build production app
npm run build
```

---

## 📖 Documentation

Comprehensive architecture, features, and engineering documentation can be found in the [`/docs`](docs/README.md) directory:

- 📐 [Architecture Overview](docs/architecture/overview.md)
- 🎨 [Projection Mapping & Surface Shaders](docs/features/projection-mapping.md)
- 📦 [Native `.lumora` File Format Specification](docs/format/lumora-format.md)
- 🤖 [Multi-Agent Developer Roles & Guidelines](docs/agents/README.md)
- 📜 [Architecture Decision Records (ADRs)](docs/decisions/README.md)

---

## 📑 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
