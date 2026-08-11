# Multi-Agent Coordination System

LUMORA uses a structured multi-agent workflow to enable simultaneous engineering across subsystems while preserving architecture and preventing merge conflicts.

## Agent Roles

1. **Lead / Orchestrator Agent:** System architecture, task breakdown, code review, status reporting.
2. **Graphics Agent (`src/renderer/`, `src/graphics/`):** WebGL 2.0 pipeline, shaders, 4-point homography, mesh warp.
3. **Media Agent (`src/media/`):** Video decoding, image loading, texture streaming pool, playback synchronization.
4. **UI Agent (`src/ui/`):** React UI components, dark visual aesthetics, layout panels, accessibility.
5. **Show Control Agent (`src/show/`, `src/scenes/`):** Scene transitions, cue list, blackout/whiteout emergency controls.
6. **Project / Format Agent (`src/project/`, `src/storage/`):** `.lumora` archive serialization, JSON manifest schemas, recovery.
7. **Testing / QA Agent (`tests/`):** Unit tests, integration tests, performance regression benchmarks.
8. **Documentation Agent (`docs/`):** Architecture docs, feature specs, ADR updates, changelogs.

## Workflow Rules

- Every feature branch must map to a single agent domain or task template.
- Agents must check `docs/status/active-work.md` before editing files.
- Interface contracts (`docs/architecture/contracts.md`) govern cross-agent module calls.
