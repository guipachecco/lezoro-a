// Desenhos da marca como strings SVG (portados do manual de marca).
export const N = '#10288C', L = '#B6DB00', C = '#EAF6AD', V = '#6338EE', B = '#274DEA'
const LEAF = 'M60 26C48 26 38 18 36 4C50 4 58 14 60 26Z'

export function sym(o = {}) {
  const bg = o.bg || N, st = o.stem || L, lf = o.leaf || C
  return `<svg viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" rx="26" fill="${bg}"/><path d="M38 28V70a4 4 0 0 0 4 4H68" fill="none" stroke="${st}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><path d="M50 44C50 30 60 21 76 21C76 36 66 44 50 44Z" fill="${lf}"/></svg>`
}

export const leafMark = (fill = L) =>
  `<svg viewBox="0 0 20 32" aria-hidden="true"><path d="M3 30C3 15 9 4 19 2C19 16 13 26 3 30Z" fill="${fill}"/></svg>`

const LF = (dy = 0, m = 0, s = 1) =>
  `<path d="${LEAF}" transform="${m ? 'translate(120 0) scale(-1 1) ' : ''}translate(60 ${26 + dy}) scale(${s}) translate(-60 -26)" fill="${L}" stroke="${N}" stroke-width="${4 / s}" stroke-linejoin="round"/>`
const stem = (y) => `<path d="M60 44V${y}" stroke="${N}" stroke-width="5" stroke-linecap="round"/>`

function crown(n, droop) {
  if (n === 1) return stem(34) + LF(10, 1, 0.55)
  if (n === 2) return stem(22) + `<g class="leaf">${LF(0)}</g><g ${droop}>${LF(-2, 1)}</g>`
  if (n === 3) return stem(10) + LF(0) + `<g ${droop}>${LF(0, 1)}</g>` + LF(-14, 0, 0.7)
  if (n === 4) return stem(4) + LF(4) + `<g ${droop}>${LF(4, 1)}</g>` + LF(-10, 0, 0.8) + LF(-10, 1, 0.8) + LF(-22, 1, 0.6)
  const fruits = n === 6
    ? [[50, -12], [68, -16], [62, 2], [46, 2], [74, -2]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="${V}" stroke="${N}" stroke-width="2"/>`).join('')
    : ''
  return stem(8) + LF(10, 0, 0.75) + LF(10, 1, 0.75) +
    `<circle cx="60" cy="-6" r="22" fill="${L}" stroke="${N}" stroke-width="4"/><path d="M46 -12Q52 -22 62 -22" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/>` + fruits
}

const star = (x, y, c) =>
  `<path d="M${x} ${y - 7}L${x + 1.8} ${y - 1.8}L${x + 7} ${y}L${x + 1.8} ${y + 1.8}L${x} ${y + 7}L${x - 1.8} ${y + 1.8}L${x - 7} ${y}L${x - 1.8} ${y - 1.8}Z" fill="${c}" stroke="${N}" stroke-width="1.6" stroke-linejoin="round"/>`

/** Mascote Grão. lvl 1–6 muda a cabeça conforme o nível do usuário. */
export function grao(st = 'feliz', lvl = 2) {
  let back = '', arms = '', front = '', extra = '', droop = ''
  let eyes = `<ellipse cx="46" cy="86" rx="6" ry="8" fill="${N}"/><ellipse cx="74" cy="86" rx="6" ry="8" fill="${N}"/><circle cx="48.5" cy="82.5" r="2.2" fill="#fff"/><circle cx="76.5" cy="82.5" r="2.2" fill="#fff"/>`
  let mouth = `<path d="M52 100Q60 108 68 100" fill="none" stroke="${N}" stroke-width="4" stroke-linecap="round"/>`
  const closed = `<path d="M39 89Q46 80 53 89M67 89Q74 80 81 89" fill="none" stroke="${N}" stroke-width="4.5" stroke-linecap="round"/>`
  const open = `<path d="M49 98Q60 116 71 98Z" fill="${N}" stroke="${N}" stroke-width="3" stroke-linejoin="round"/><path d="M54 105Q60 110 66 105" fill="${V}" opacity=".7"/>`
  const hand = (x, y) => `<circle cx="${x}" cy="${y}" r="5.5" fill="${C}" stroke="${N}" stroke-width="3.5"/>`
  const wave = `<path d="M100 92Q114 84 112 70" fill="none" stroke="${N}" stroke-width="5" stroke-linecap="round"/>` + hand(112, 68)

  switch (st) {
    case 'celebra':
      eyes = closed; mouth = open
      arms = `<path d="M22 86Q8 72 10 54M98 86Q112 72 110 54" fill="none" stroke="${N}" stroke-width="5" stroke-linecap="round"/>` + hand(10, 52) + hand(110, 52)
      extra = star(16, 22, L) + star(104, 30, V) + star(108, 118, L)
      break
    case 'encoraja':
      droop = 'transform="rotate(48 60 24)"'
      extra = `<path d="M39 76L52 72M81 76L68 72" stroke="${N}" stroke-width="4" stroke-linecap="round"/>`
      mouth = `<path d="M53 102Q60 106 67 102" fill="none" stroke="${N}" stroke-width="4" stroke-linecap="round"/>`
      arms = `<path d="M100 96Q114 90 114 76" fill="none" stroke="${N}" stroke-width="5" stroke-linecap="round"/>` + hand(114, 74)
      break
    case 'sequencia':
      eyes = closed; mouth = open
      back = `<circle cx="60" cy="18" r="28" fill="${L}" opacity=".35"/><path d="M60 -8V-2M30 4L35 8M90 4L85 8M24 24H30M90 24H96" stroke="${L}" stroke-width="4" stroke-linecap="round"/>`
      extra = `<path d="M86 0s-5 6-5 9a5 5 0 0 0 10 0c0-3-5-9-5-9z" fill="${B}" stroke="${N}" stroke-width="2"/>`
      break
    case 'pensando':
      eyes = `<ellipse cx="46" cy="84" rx="6" ry="8" fill="${N}"/><ellipse cx="74" cy="84" rx="6" ry="8" fill="${N}"/><circle cx="48" cy="79" r="2.4" fill="#fff"/><circle cx="76" cy="79" r="2.4" fill="#fff"/>`
      mouth = `<path d="M53 104Q58 101 67 103" fill="none" stroke="${N}" stroke-width="4" stroke-linecap="round"/>`
      arms = `<path d="M22 108Q36 122 50 114" fill="none" stroke="${N}" stroke-width="5" stroke-linecap="round"/>`
      extra = `<circle cx="104" cy="44" r="4" fill="${C}" stroke="${N}" stroke-width="2.5"/><circle cx="112" cy="32" r="6" fill="${C}" stroke="${N}" stroke-width="2.5"/>`
      break
    case 'dormindo':
      droop = 'transform="rotate(40 60 24)"'
      eyes = `<path d="M39 88Q46 93 53 88M67 88Q74 93 81 88" fill="none" stroke="${N}" stroke-width="4" stroke-linecap="round"/>`
      mouth = `<ellipse cx="60" cy="104" rx="4" ry="5" fill="${N}"/>`
      extra = `<text x="92" y="44" font-family="Bricolage Grotesque,sans-serif" font-weight="800" font-size="20" fill="${B}">z</text><text x="104" y="28" font-family="Bricolage Grotesque,sans-serif" font-weight="800" font-size="14" fill="${B}">z</text>`
      break
    case 'surpreso':
      eyes = `<circle cx="46" cy="86" r="8.5" fill="#fff" stroke="${N}" stroke-width="3.5"/><circle cx="74" cy="86" r="8.5" fill="#fff" stroke="${N}" stroke-width="3.5"/><circle cx="46" cy="87" r="4.5" fill="${N}"/><circle cx="74" cy="87" r="4.5" fill="${N}"/>`
      mouth = `<ellipse cx="60" cy="107" rx="5" ry="6.5" fill="${N}"/>`
      extra = `<path d="M37 70Q45 65 53 70M67 70Q75 65 83 70" fill="none" stroke="${N}" stroke-width="3.5" stroke-linecap="round"/>` + star(14, 40, L) + star(108, 46, V)
      break
    case 'orgulhoso':
      eyes = closed
      mouth = `<path d="M50 99Q60 110 70 99" fill="none" stroke="${N}" stroke-width="4" stroke-linecap="round"/>`
      front = `<path d="M53 110L60 120L67 110" fill="none" stroke="${V}" stroke-width="4" stroke-linejoin="round"/><circle cx="60" cy="124" r="7.5" fill="${L}" stroke="${N}" stroke-width="3.5"/>`
      arms = wave; extra = star(14, 30, L)
      break
    default:
      arms = wave
  }
  const tall = lvl >= 4
  return `<svg viewBox="${tall ? '0 -28 124 168' : '0 -10 124 150'}" role="img" aria-label="Grão, o mascote">${back}${crown(lvl, droop)}${arms}
<path d="M60 40C88 40 104 66 104 92C104 118 84 134 60 134C36 134 16 118 16 92C16 66 32 40 60 40Z" fill="${C}" stroke="${N}" stroke-width="5"/>
<path d="M60 130C80 130 96 118 99 100" fill="none" stroke="${L}" stroke-width="5" stroke-linecap="round" opacity=".55"/>
<ellipse cx="36" cy="64" rx="7" ry="10" fill="#fff" opacity=".75" transform="rotate(30 36 64)"/>
<ellipse cx="35" cy="100" rx="7" ry="4" fill="${V}" opacity=".25"/><ellipse cx="85" cy="100" rx="7" ry="4" fill="${V}" opacity=".25"/>
<g class="eyes">${eyes}</g>${mouth}${front}${extra}</svg>`
}

/** Planta por nível (1–6), usada na “Sua árvore”. */
export function plant(n) {
  let s = `<svg viewBox="0 -6 60 76" aria-hidden="true"><path d="M8 64H52" stroke="${N}" stroke-width="3" stroke-linecap="round"/>`
  if (n === 1) return s + `<ellipse cx="30" cy="57" rx="8" ry="6" fill="${C}" stroke="${N}" stroke-width="2.5"/><path d="M30 51V47" stroke="${N}" stroke-width="2.5" stroke-linecap="round"/></svg>`
  const top = 64 - (8 + n * 7)
  s += `<path d="M30 64V${top}" stroke="${N}" stroke-width="3" stroke-linecap="round"/>`
  if (n >= 5) s += `<circle cx="30" cy="${top + 2}" r="${n === 6 ? 15 : 13}" fill="${L}" stroke="${N}" stroke-width="2.5"/>`
  const k = n >= 5 ? 2 : n - 1
  for (let i = 0; i < k; i++) {
    const y = (n >= 5 ? top + 24 : top + 4) + i * 9, d = i % 2 ? -1 : 1, w = n > 3 ? 12 : 9
    s += `<path d="M30 ${y}q${d * w * 0.5} -${w * 0.9} ${d * w} -${w * 0.5}q-${d * w * 0.1} ${w * 0.8} -${d * w} ${w * 0.5}z" fill="${L}" stroke="${N}" stroke-width="2" stroke-linejoin="round"/>`
  }
  if (n === 6) s += [[23, top], [36, top - 4], [33, top + 8], [22, top + 10]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="${V}" stroke="${N}" stroke-width="1.5"/>`).join('')
  return s + '</svg>'
}

const IC = {
  gota: '<path d="M12 3s-6.5 7.2-6.5 11.5a6.5 6.5 0 0 0 13 0C18.5 10.2 12 3 12 3z"/>',
  semente: '<path d="M12 3c4.5 3.2 6.5 8 5 12.5-1.2 3.6-8.8 3.6-10 0C5.5 11 7.5 6.2 12 3z"/>',
  lamparina: '<path d="M3 12h14c0 4-3 7-7 7s-7-3-7-7z"/><path d="M17 12l4-2"/><path d="M20.5 7.5c-1.2-1-1.2-2.6 0-4.5 1.2 1.9 1.2 3.5 0 4.5z"/><path d="M7 21h6"/>',
  trilha: '<path d="M12 21v-9"/><path d="M12 12c0-4 3-7 8-7 0 4-3 7-8 7z"/><path d="M12 15c0-3-2.5-5.5-7-5.5 0 3 2.5 5.5 7 5.5z"/>',
  biblia: '<path d="M6 3h12v15H7.5A2.5 2.5 0 0 0 5 20.5V4a1 1 0 0 1 1-1z"/><path d="M5 20.5A2.5 2.5 0 0 0 7.5 23H18v-5"/><path d="M11.5 6.5v7M9 9h5"/>',
  medalha: '<circle cx="12" cy="15" r="6"/><path d="M8.5 10 6 2h4l2 4 2-4h4l-2.5 8"/>',
  perfil: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
  luz: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  cadeado: '<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  seta: '<path d="M15 5l-7 7 7 7"/>',
  olho: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  email: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/>',
  sair: '<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 16l-4-4 4-4M6 12h10"/>',
}
export const icon = (n, filled) =>
  `<svg viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]}</svg>`
