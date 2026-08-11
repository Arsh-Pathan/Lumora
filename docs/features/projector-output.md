# Multi-Monitor Projector Output Architecture

LUMORA implements a multi-window display architecture using Electron's `BrowserWindow` API and hash-based client routing.

## Output Architecture

```text
┌─────────────────────────────────────────┐
│               ELECTRON MAIN             │
└────────────────────┬────────────────────┘
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
┌──────────────────┐  ┌────────────────────┐
│ EDITOR WINDOW    │  │ PROJECTOR WINDOW 1 │
│ Display 1 (Main) │  │ Display 2 (Target) │
│ Window Chrome    │  │ Borderless Full    │
│ React Controls   │  │ WebGL Output       │
│ Hash: /          │  │ Hash: #/projector  │
└──────────────────┘  └────────────────────┘
```

## Key Requirements & Verification

1. **Zero UI Leakage:**  
   The projector window loads `#/projector`, which mounts `<ProjectorWindow />`. This component contains **ONLY** the WebGL composition canvas. No menus, panels, borders, or debug text are rendered.

2. **Cursor Suppression:**  
   The CSS for `<ProjectorWindow />` specifies `cursor: none`, hiding the mouse cursor completely on projector screens.

3. **Multi-Resolution Scaling:**  
   When the editor canvas (e.g. 1920x1080) maps to a 4K projector display (3840x2160), surface corner points scale proportionally using `scaleCorners()`.

4. **Display Disconnect Recovery:**  
   If a projector display cable is disconnected during a live performance, the system gracefully traps the disconnect event without crashing. When the display is re-attached, output can be restored with a single click.
