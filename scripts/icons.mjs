// Gera os PNGs do PWA a partir do símbolo (mesma geometria de public/icon.svg), sem dependências.
// Uso: node scripts/icons.mjs
import { writeFileSync } from 'node:fs'
import { deflateSync } from 'node:zlib'

const NAVY = [16, 40, 140], LIME = [182, 219, 0], CREAM = [234, 246, 173]

const segDist = (px, py, ax, ay, bx, by) => {
  const dx = bx - ax, dy = by - ay
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)))
  return Math.hypot(px - ax - t * dx, py - ay - t * dy)
}
const inRoundRect = (x, y, r) => {
  const qx = Math.max(Math.abs(x - 50) - (50 - r), 0), qy = Math.max(Math.abs(y - 50) - (50 - r), 0)
  return Math.hypot(qx, qy) <= r
}
// folha: interseção de dois círculos (vesica) entre (50,44) e (76,21)
const A = [50, 44], Bp = [76, 21], mid = [(A[0] + Bp[0]) / 2, (A[1] + Bp[1]) / 2]
const half = Math.hypot(Bp[0] - A[0], Bp[1] - A[1]) / 2, h = 7.5, R = (h * h + half * half) / (2 * h)
const nx = -(Bp[1] - A[1]) / (2 * half), ny = (Bp[0] - A[0]) / (2 * half)
const c1 = [mid[0] + nx * (R - h), mid[1] + ny * (R - h)], c2 = [mid[0] - nx * (R - h), mid[1] - ny * (R - h)]
const inLeaf = (x, y) => Math.hypot(x - c1[0], y - c1[1]) <= R && Math.hypot(x - c2[0], y - c2[1]) <= R

/** Cor no ponto (x,y) do espaço 0–100 do símbolo, ou null fora do quadrado arredondado. */
function symbol(x, y) {
  if (!inRoundRect(x, y, 26)) return null
  if (inLeaf(x, y)) return CREAM
  if (segDist(x, y, 38, 28, 38, 72) <= 6 || segDist(x, y, 38, 72, 42, 74) <= 6 || segDist(x, y, 42, 74, 68, 74) <= 6) return LIME
  return NAVY
}

function render(size, { maskable } = {}) {
  const ss = 4, px = Buffer.alloc(size * size * 4)
  for (let j = 0; j < size; j++) for (let i = 0; i < size; i++) {
    let r = 0, g = 0, b = 0, a = 0
    for (let sy = 0; sy < ss; sy++) for (let sx = 0; sx < ss; sx++) {
      let x = ((i + (sx + 0.5) / ss) / size) * 100, y = ((j + (sy + 0.5) / ss) / size) * 100
      if (maskable) { x = (x - 15) / 0.7; y = (y - 15) / 0.7 } // zona segura: símbolo em 70% sobre fundo cheio
      const c = symbol(x, y) || (maskable ? NAVY : null)
      if (c) { r += c[0]; g += c[1]; b += c[2]; a++ }
    }
    const o = (j * size + i) * 4
    if (a) { px[o] = r / a; px[o + 1] = g / a; px[o + 2] = b / a }
    px[o + 3] = Math.round((a / (ss * ss)) * 255)
  }
  return png(size, px)
}

const crcTable = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0 })
const crc = (buf) => { let c = 0xffffffff; for (const x of buf) c = crcTable[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0 }

function png(size, rgba) {
  const raw = Buffer.alloc((size * 4 + 1) * size)
  for (let y = 0; y < size; y++) rgba.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4)
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length)
    const td = Buffer.concat([Buffer.from(type), data]), c = Buffer.alloc(4); c.writeUInt32BE(crc(td))
    return Buffer.concat([len, td, c])
  }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4); ihdr[8] = 8; ihdr[9] = 6
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))])
}

writeFileSync('public/pwa-192.png', render(192))
writeFileSync('public/pwa-512.png', render(512))
writeFileSync('public/pwa-maskable-512.png', render(512, { maskable: true }))
writeFileSync('public/apple-touch-icon.png', render(180, { maskable: true }))
console.log('ícones gerados em public/')
