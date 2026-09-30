# Agent instructions (MapTiler)

Before writing MapTiler code, follow `.cursor/skills/maptiler/SKILL.md` and [How to use MapTiler with AI](https://docs.maptiler.com/guides/ai/how-to-use-with-ai/).

- Use `@maptiler/sdk`, not raw `maplibre-gl`.
- Use `MapStyle.STREETS` (streets-v4), never streets-v2.
- Read the API key from `VITE_MAPTILER_API_KEY`. Never hardcode keys.
- Coordinates are `[lng, lat]`.
- Pin SDK version from `.cursor/skills/maptiler/references/versions.md`.
