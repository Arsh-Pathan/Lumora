# LUMORA — Active Work Tracking

This document tracks active feature development and assigned agent work to prevent merge conflicts and duplicate modifications.

---

## 🛠️ Active Work Table

| Task | Assigned Agent | Status | Branch | Affected Files | Dependencies |
|---|---|---|---|---|---|
| Foundation & Shell Architecture | Lead / Orchestrator | In Progress | `main` | `src/main/`, `vite.config.ts` | Node.js, Electron, Vite |
| WebGL2 Perspective Renderer | Graphics Agent | In Progress | `feature/graphics-renderer` | `src/renderer/`, `src/graphics/` | Application State |
| Media Streamer & Video Texture Pipeline | Media Agent | In Progress | `feature/media-engine` | `src/media/` | WebGL Engine |
| Dark Modern UI & Workspace Layout | UI Agent | In Progress | `feature/ui-workspace` | `src/ui/` | Application State |
| Show Mode & Scene Cue Engine | Show Control Agent | In Progress | `feature/show-control` | `src/show/`, `src/scenes/` | Application State |
| `.lumora` Native Archive Reader/Writer | Project Format Agent | In Progress | `feature/lumora-format` | `src/project/`, `src/storage/` | fflate / JSZip |
| Unit & Integration Test Suite | Testing / QA Agent | In Progress | `feature/test-suite` | `tests/` | Vitest |

---

## 🔄 Agent Work Coordination Rules

1. Before starting work on any file, verify that no other agent is actively modifying it.
2. Interface contracts in `docs/architecture/contracts.md` MUST NOT be modified without updating all dependent modules and notifying the Orchestrator.
3. Every agent must provide a handoff report upon completing a milestone or task.
