# `.lumora` Native Project Container Specification

The `.lumora` file format is a self-contained archive (ZIP structure) that encapsulates project metadata, projection surface geometry, scenes, effects, shaders, calibration presets, embedded media files, and thumbnails.

## Archive Directory Layout

```text
SummerFestival.lumora
├── manifest.json              # Main project identification & resolution
├── project/
│   ├── settings.json          # Composition FPS, background color, rules
│   ├── surfaces.json          # Geometry, transforms, quad pin points, mesh grids
│   ├── scenes.json            # Show scenes, cues, transitions
│   ├── effects.json           # Shader effect parameters
│   ├── masks.json             # Vector & bitmap masks
│   ├── calibration.json       # Projector alignment patterns & matrices
│   ├── shortcuts.json         # Custom keybindings
│   └── output.json            # Multi-display target configuration
├── media/
│   ├── 000001.mp4             # Embedded video asset
│   ├── 000002.png             # Embedded image asset
│   └── 000003.webm            # Embedded animation
├── thumbnails/
│   ├── 000001.jpg             # Preview thumbnail for media browser
│   └── 000002.jpg
├── metadata/
│   └── media.json             # Asset ID mapping, original paths, checksums
└── preview/
    └── project-preview.jpg    # Saved canvas screenshot preview
```

## Security & Verification

1. **Path Traversal Protection:** Extraction algorithms sanitize all paths inside `.lumora` to prevent directory traversal (`../`).
2. **Checksum Verification:** SHA-256 hashes confirm media integrity before show launch.
3. **No Executable Code:** Project files only contain JSON data. Script execution inside project containers is strictly forbidden.
