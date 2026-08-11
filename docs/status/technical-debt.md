# LUMORA — Technical Debt Register

This document tracks refactoring opportunities and technical debt items.

---

## 📋 Technical Debt Register

| ID | Module | Category | Description | Priority |
|---|---|---|---|---|
| TD-001 | `WebGLPipeline.ts` | Memory | Cache WebGL mesh buffers per surface (Completed in audit). | Low (Resolved) |
| TD-002 | `App.tsx` | Routing | Hash-route `#/projector` separation for projector window (Completed in audit). | High (Resolved) |
| TD-003 | `LumoraContext.tsx` | Fallback | Safe browser window fallback when Electron native IPC is unavailable (Completed in audit). | Medium (Resolved) |
| TD-004 | `matrix.ts` | Math | Add degenerate quad checks (`isQuadDegenerate`) and `scaleCorners()` (Completed in audit). | Medium (Resolved) |
