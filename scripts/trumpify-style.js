import { readFileSync, writeFileSync } from "node:fs";
import { trumpifyStyle } from "../src/trumpifyStyle.js";

const inputPath = process.argv[2];
const outputPath = process.argv[3] || inputPath.replace(/\.json$/i, ".america.json");

if (!inputPath) {
  console.error(
    "Usage: node scripts/trumpify-style.js <style.json> [out.json]\n\nDownload a MapTiler style first:\n  curl \"https://api.maptiler.com/maps/streets-v4/style.json?key=YOUR_MAPTILER_API_KEY\" -o style.json",
  );
  process.exit(1);
}

const style = JSON.parse(readFileSync(inputPath, "utf8"));
trumpifyStyle(style);
writeFileSync(outputPath, JSON.stringify(style));
console.log(`Wrote ${outputPath}`);
