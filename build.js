// Copies the app into public/ and draws the app icons as PNG (no binary files in the repo).
const fs = require("fs"), zlib = require("zlib");
fs.mkdirSync("public/icons", { recursive: true });
for (const f of ["index.html", "sw.js", "manifest.webmanifest"]) fs.copyFileSync(f, "public/" + f);

function crc32(buf) { let c, crc = ~0; for (let n = 0; n < buf.length; n++) { c = (crc ^ buf[n]) & 255; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; crc = (crc >>> 8) ^ c; } return ~crc >>> 0; }
function chunk(type, data) { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); const td = Buffer.concat([Buffer.from(type), data]); const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td)); return Buffer.concat([len, td, crc]); }
function png(size, pad, rounded) {
  const SS = 3, S = size * SS, bg = [26, 158, 153], fg = [255, 255, 255];
  // heart polygon
  const pts = []; for (let i = 0; i < 360; i++) { const t = 2 * Math.PI * i / 360; pts.push([16 * Math.sin(t) ** 3, -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))]); }
  const scale = S * (1 - 2 * pad) / 34, cx = S / 2, cy = S / 2 + S * 0.02;
  const poly = pts.map(([x, y]) => [cx + x * scale, cy + y * scale]);
  const inside = (x, y) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
  const r = S * 0.22;
  const inBg = (x, y) => { if (!rounded) return true; const dx = Math.max(r - x, x - (S - r), 0), dy = Math.max(r - y, y - (S - r), 0); return dx * dx + dy * dy <= r * r; };
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    for (let x = 0; x < size; x++) {
      let R = 0, G = 0, B = 0, A = 0;
      for (let sy = 0; sy < SS; sy++) for (let sx = 0; sx < SS; sx++) {
        const px = x * SS + sx + 0.5, py = y * SS + sy + 0.5;
        if (!inBg(px, py)) continue;
        const c = inside(px, py) ? fg : bg; R += c[0]; G += c[1]; B += c[2]; A += 255;
      }
      const n = SS * SS, o = y * (size * 4 + 1) + 1 + x * 4;
      raw[o] = A ? Math.round(R / (A / 255)) : 0; raw[o + 1] = A ? Math.round(G / (A / 255)) : 0; raw[o + 2] = A ? Math.round(B / (A / 255)) : 0; raw[o + 3] = Math.round(A / n);
    }
  }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]);
}
fs.writeFileSync("public/icons/icon-192.png", png(192, 0.2, true));
fs.writeFileSync("public/icons/apple-touch-icon.png", png(180, 0.2, false));
fs.writeFileSync("public/icons/icon-512.png", png(512, 0.2, true));
fs.writeFileSync("public/icons/maskable-512.png", png(512, 0.28, false));
console.log("built");
