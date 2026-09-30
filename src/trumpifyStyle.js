import { PREFIXES } from "./prefixes.js";

export const TRUMPMAP_META = "prefix-america";

/**
 * MapLibre expression: keep a known geographic prefix, replace the rest with America.
 * Unmatched names become "America".
 * Compatible with MapTiler Map Designer (GL style spec / slice + case).
 */
export function prefixAmericaExpression(nameExpr) {
  const branches = [];
  for (const { prefix, label } of PREFIXES) {
    branches.push(
      ["==", ["slice", ["var", "n"], 0, prefix.length], prefix],
      label,
    );
  }
  return [
    "let",
    "n",
    ["to-string", nameExpr],
    ["case", ...branches, "America"],
  ];
}

function tokensToExpression(tokenString) {
  const parts = [];
  const re = /\{([^}]+)\}/g;
  let last = 0;
  let match;
  while ((match = re.exec(tokenString)) !== null) {
    if (match.index > last) {
      parts.push(tokenString.slice(last, match.index));
    }
    parts.push(["to-string", ["coalesce", ["get", match[1]], ""]]);
    last = match.index + match[0].length;
  }
  if (last < tokenString.length) {
    parts.push(tokenString.slice(last));
  }
  if (parts.length === 0) return ["literal", tokenString];
  if (parts.length === 1) return typeof parts[0] === "string" ? ["literal", parts[0]] : parts[0];
  return ["concat", ...parts];
}

function wrapTextField(textField) {
  if (textField == null) return textField;
  if (typeof textField === "string") {
    return prefixAmericaExpression(tokensToExpression(textField));
  }
  if (!Array.isArray(textField)) return textField;

  if (textField[0] === "format") {
    const out = ["format"];
    for (let i = 1; i < textField.length; i += 2) {
      out.push(wrapTextField(textField[i]));
      if (i + 1 < textField.length) out.push(textField[i + 1]);
    }
    return out;
  }

  return prefixAmericaExpression(textField);
}

function isNameLabel(textField) {
  const s = JSON.stringify(textField);
  if (/"get","(ref|housenumber|iata|ref_length)"/.test(s)) return false;
  if (typeof textField === "string" && /\{(ref|housenumber|iata|ref_length)/.test(textField)) {
    return false;
  }
  return true;
}

export function trumpifyStyle(style) {
  if (!style || !Array.isArray(style.layers)) {
    throw new Error("Not a MapTiler / MapLibre style JSON (missing layers).");
  }

  for (const layer of style.layers) {
    if (layer.type !== "symbol") continue;
    const layout = layer.layout;
    if (!layout || layout["text-field"] == null) continue;
    if (layer.metadata && layer.metadata.trumpmap === TRUMPMAP_META) continue;
    if (JSON.stringify(layout["text-field"]).includes("Gulf of America")) continue;
    if (!isNameLabel(layout["text-field"])) continue;

    layout["text-field"] = wrapTextField(layout["text-field"]);
    layer.metadata = { ...(layer.metadata || {}), trumpmap: TRUMPMAP_META };
  }

  style.name = style.name ? `${style.name} (America prefixes)` : "America prefixes";
  return style;
}
