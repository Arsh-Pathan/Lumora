# LUMORA — Known Issues & Limitations

This document tracks identified limitations and manual testing requirements.

---

## ⚠️ Known Limitations

1. **Hardware Video Decoding Dependence:**  
   Smooth playback of multiple simultaneous 4K 60 FPS video streams depends on hardware decoding support provided by the host GPU (NVIDIA NVDEC / AMD VCE / Intel QuickSync / Apple VideoToolbox). On legacy GPUs, software decoding may drop frames.

2. **WebGPU Renderer Option:**  
   WebGPU renderer pipeline is currently marked experimental. WebGL 2.0 remains the primary production engine.

---

## 🛠️ Required Manual Hardware Tests

Before running a live show on new hardware:
- Verify physical HDMI/DisplayPort cable connections to secondary displays.
- Run `File -> Verify Show` to confirm `SHOW READY` status.
- Test emergency **BLACKOUT** key (`B`) on physical projector hardware.
