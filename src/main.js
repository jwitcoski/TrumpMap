import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import "./style.css";
import { trumpifyStyle, TRUMPMAP_META } from "./trumpifyStyle.js";

const apiKey = import.meta.env.VITE_MAPTILER_API_KEY;
if (!apiKey) {
  document.body.textContent =
    "Set VITE_MAPTILER_API_KEY in a local .env file (see .env.example).";
  throw new Error("Missing VITE_MAPTILER_API_KEY");
}

maptilersdk.config.apiKey = apiKey;
maptilersdk.config.primaryLanguage = maptilersdk.Language.ENGLISH;

const map = new maptilersdk.Map({
  container: "map",
  style: maptilersdk.MapStyle.STREETS,
  center: [-98, 39],
  zoom: 3.2,
  navigationControl: true,
});

function applyPrefixAmericaLabels() {
  const style = structuredClone(map.getStyle());
  trumpifyStyle(style);
  for (const layer of style.layers) {
    if (layer.metadata?.trumpmap !== TRUMPMAP_META) continue;
    if (!layer.layout?.["text-field"]) continue;
    map.setLayoutProperty(layer.id, "text-field", layer.layout["text-field"]);
  }
}

map.once("idle", applyPrefixAmericaLabels);

window.__map = map;
