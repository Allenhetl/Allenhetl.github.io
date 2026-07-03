# 3D models (homepage hero viewer)

Drop a `.glb` (or `.gltf`) here and point `robot_model:` in `_pages/about.md`
at it to switch on the interactive 3D viewer between the name and the bio.

## How to enable

1. Export/obtain a **`.glb`** (single-file glTF binary — preferred; textures are
   embedded). Aim for **< 5 MB** so it loads fast; run it through
   [gltf-transform](https://gltf-transform.dev/) or
   [gltfpack](https://github.com/zeux/meshoptimizer) to compress if larger:
   ```bash
   npx @gltf-transform/cli optimize robot.glb robot.glb --compress meshopt
   ```
2. Save it here, e.g. `assets/models/robot.glb`.
3. In `_pages/about.md` front matter, uncomment and set:
   ```yaml
   robot_model: assets/models/robot.glb
   robot_poster: assets/img/models/robot-poster.webp # optional but recommended
   ```
4. (Recommended) Add a poster: a static screenshot of the model shown while it
   streams in — avoids a blank frame. `<model-viewer>` can generate one via its
   right-click "export" or you can screenshot the loaded model.

## Where to get a model

- Your own CAD (SolidWorks/Fusion → export glTF, or via Blender).
- Free CC-licensed robots on [Sketchfab](https://sketchfab.com/) (download as
  glTF) — check the license allows use + attribution.

## Notes

- The viewer is **opt-in**: with `robot_model` commented out, nothing renders
  and no `model-viewer` script loads. Other pages are never affected.
- Motion honors `prefers-reduced-motion` (auto-rotate is stripped).
- Zoom is disabled and vertical scroll is preserved, so the model never traps
  the page scroll on mobile.
- Component lives in `_includes/robot_viewer.liquid`; styling under
  "BP11. Homepage 3D robot viewer" in `assets/css/main.scss`.
