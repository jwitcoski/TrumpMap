# TrumpMap (prefix + America)

Vanilla Vite app using [@maptiler/sdk](https://www.npmjs.com/package/@maptiler/sdk) `4.0.2` and **streets-v4** (`MapStyle.STREETS`). Place labels keep a geographic prefix and replace the rest with America.

Follows [How to use MapTiler with AI](https://docs.maptiler.com/guides/ai/how-to-use-with-ai/) and the project MapTiler agent skill in `.cursor/skills/maptiler/`.

## Setup

1. Copy `.env.example` to `.env`.
2. Put your key from [MapTiler Cloud](https://cloud.maptiler.com/account/keys/) in `VITE_MAPTILER_API_KEY`. Do not commit `.env` or paste the key into chat.
3. Restrict the key by HTTP origin before you publish.

```bash
npm install
npm run dev
```

## Transform a downloaded style (Map Designer)

```bash
curl "https://api.maptiler.com/maps/streets-v4/style.json?key=YOUR_MAPTILER_API_KEY" -o style.json
npm run trumpify -- style.json style.america.json
```

Upload `style.america.json` in MapTiler Cloud if you want the same labels hosted as a custom map.
