import { trumpifyStyle } from "../src/trumpifyStyle.js";

const style = {
  version: 8,
  layers: [
    {
      id: "place",
      type: "symbol",
      layout: { "text-field": "{name:en}" },
    },
  ],
};

trumpifyStyle(style);
const field = style.layers[0].layout["text-field"];
if (field[0] !== "let") throw new Error("expected let wrapper");
if (!JSON.stringify(field).includes('["concat","New"," America"," City"]')) {
  throw new Error("missing New America City concat");
}
if (!JSON.stringify(field).includes("New America")) throw new Error("missing New America");
console.log("ok");
