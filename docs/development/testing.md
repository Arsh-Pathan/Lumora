# Testing & Quality Assurance Guide

LUMORA maintains strict quality standards to ensure rock-solid stability during live stage performances and projection shows.

## Automated Test Suites

Run unit and integration tests using Vitest:

```bash
npm test
```

### Covered Test Areas

1. **`homography.test.ts`**: Verifies 3x3 perspective transformation matrix calculations, matrix inversion, and corner pin mapping.
2. **`lumora-archive.test.ts`**: Verifies ZIP container export and import round-trips for native `.lumora` archives.
3. **`project-validation.test.ts`**: Tests the "Verify Show" diagnostic engine for missing media, invalid resolutions, and projector output states.
4. **`scene-engine.test.ts`**: Tests cue triggering, transition duration timing, and scene blending.

## Manual Test Protocol for Live Shows

Before any live performance:
- Connect secondary projector display.
- Run `File -> Verify Show` to ensure status is `SHOW READY`.
- Test emergency **BLACKOUT** (press 'B') to verify output becomes black instantly.
- Test **WHITEOUT** pattern to verify projector focus and alignment.
