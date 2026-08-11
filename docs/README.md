# LUMORA Documentation Index

Welcome to the official documentation for **LUMORA** — Professional Projection Mapping & Show Control Software.

---

## 📚 Documentation Navigation

### 1. 🎯 [Product Vision & Requirements](product/vision.md)
- [Vision & Goals](product/vision.md)
- [Feature Breakdown](product/features.md)
- [Product Requirements](product/requirements.md)
- [Roadmap](product/roadmap.md)
- [UX Principles](product/ux-principles.md)

### 2. 🏗️ [Architecture & Technical Design](architecture/overview.md)
- [System Overview](architecture/overview.md)
- [Application State & Data Flow](architecture/application.md)
- [GPU Render Pipeline](architecture/renderer.md)
- [WebGL 2.0 Engine & Shaders](architecture/gpu.md)
- [Media Playback Subsystem](architecture/media.md)
- [Multi-Window Output & Projector Routing](architecture/output.md)
- [Native `.lumora` Project Container System](architecture/project-system.md)
- [State Management Architecture](architecture/state-management.md)
- [Performance Strategy & 60 FPS Guarantee](architecture/performance.md)
- [Inter-System Contracts & Interfaces](architecture/contracts.md)

### 3. 🎨 [Feature Documentation](features/projection-mapping.md)
- [Projection Mapping & Perspective Transform](features/projection-mapping.md)
- [Surfaces (Rectangle, Quad, Triangle, Polygon, Mesh)](features/surfaces.md)
- [GPU Mesh Warping](features/mesh-warp.md)
- [Media Management & Playback Modes](features/media.md)
- [Layering & Composition](features/layers.md)
- [GPU Vector & Bitmap Masks](features/masks.md)
- [GPU Shader Effects Pipeline](features/effects.md)
- [Scene & Cue Control System](features/scenes.md)
- [Live Show Mode & Cues](features/show-mode.md)
- [Multi-Display Projector Output](features/projector-output.md)
- [Projector Calibration & Test Patterns](features/calibration.md)
- [Instant Emergency Blackout & Whiteout](features/blackout.md)

### 4. 📦 [Native `.lumora` File Format Specification](format/lumora-format.md)
- [Container Specification](format/lumora-format.md)
- [Manifest Schema](format/manifest.md)
- [Embedded vs Linked Media Handling](format/media.md)
- [Migration & Version Control](format/migrations.md)
- [Compatibility Standards](format/compatibility.md)

### 5. 💻 [Engineering & Development](development/setup.md)
- [Development Environment Setup](development/setup.md)
- [Git Workflow & Commit Guidelines](development/git.md)
- [Testing & Quality Assurance](development/testing.md)
- [Debugging Guide](development/debugging.md)
- [Release & Build Packaging](development/release.md)

### 6. 🤖 [Multi-Agent Engineering & Roles](agents/README.md)
- [Agent Ownership Model & Rules](agents/README.md)
- [Task Template & Checklist](agents/task-template.md)
- [Graphics Agent Responsibilities](agents/graphics-agent.md)
- [Media Agent Responsibilities](agents/media-agent.md)
- [UI Agent Responsibilities](agents/ui-agent.md)
- [Show Control Agent Responsibilities](agents/show-control-agent.md)
- [Testing Agent Responsibilities](agents/testing-agent.md)
- [Documentation Agent Responsibilities](agents/documentation-agent.md)

### 7. 📜 [Architecture Decision Records (ADRs)](decisions/README.md)
- [ADR-0001: Technology Stack & GPU Renderer Architecture](decisions/ADR-0001.md)

### 8. 📊 [Project Status & Tracking](status/current-status.md)
- [Current Milestone & System Status](status/current-status.md)
- [Active Work Tracking](status/active-work.md)
- [Known Issues & Technical Debt](status/known-issues.md)
