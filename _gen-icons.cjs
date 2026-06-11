const fs = require("fs");
const path = require("path");
const { Resvg } = require("@resvg/resvg-js");
const pngToIco = require("png-to-ico");

const pub = path.join(__dirname, "public");
const markSvg = fs.readFileSync(path.join(pub, "favicon.svg"), "utf8");

function render(svg, size) {
  const r = new Resvg(svg, { fitTo: { mode: "width", value: size } });
  return r.render().asPng();
}

// Apple touch icon: brand convention is no rounded corners + a little padding;
// here we keep the tile as-is (iOS masks corners itself).
const targets = [
  ["icon-16.png", 16],
  ["icon-32.png", 32],
  ["icon-48.png", 48],
  ["apple-touch-icon.png", 180],
  ["icon-192.png", 192],
  ["icon-512.png", 512],
];

for (const [name, size] of targets) {
  fs.writeFileSync(path.join(pub, name), render(markSvg, size));
  console.log("wrote", name, size + "px");
}

(async () => {
  const ico = await pngToIco([
    path.join(pub, "icon-16.png"),
    path.join(pub, "icon-32.png"),
    path.join(pub, "icon-48.png"),
  ]);
  fs.writeFileSync(path.join(pub, "favicon.ico"), ico);
  console.log("wrote favicon.ico (16/32/48)");
})();
