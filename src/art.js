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

const GOLD = '#F2C94C', STEEL = '#C9D0DE', BROWN = '#9A6233'
const belt = (c) => `<rect x="30" y="124" width="60" height="7" rx="3.5" fill="${c}" stroke="${N}" stroke-width="3"/><rect x="54" y="121.5" width="12" height="12" rx="3" fill="${GOLD}" stroke="${N}" stroke-width="2.5"/>`
const feet = (c) => `<path d="M36 136h18M66 136h18" stroke="${N}" stroke-width="9" stroke-linecap="round"/><path d="M36 136h18M66 136h18" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/>`
const VEST = 'M24 108Q60 100 96 108Q95 129 60 134Q25 129 24 108Z'
// Roupas do Grão, desenhadas sobre o corpo e por baixo do rosto. Chave = id do item.
const GEAR = {
  cajado: `<path d="M114 136V58Q114 46 106 46Q100 46 101 53" fill="none" stroke="${N}" stroke-width="8" stroke-linecap="round"/><path d="M114 136V58Q114 46 106 46Q100 46 101 53" fill="none" stroke="${BROWN}" stroke-width="4" stroke-linecap="round"/>`,
  sandalias: feet(BROWN),
  calcado: feet(B),
  faixa: belt('#fff'),
  cinto: belt(GOLD),
  escudo: `<path d="M1 92h26v16q0 16-13 22Q1 124 1 108Z" fill="${B}" stroke="${N}" stroke-width="3.5" stroke-linejoin="round"/><path d="M14 98v24M7 106h14" stroke="${GOLD}" stroke-width="3.5" stroke-linecap="round"/>`,
  capacete: `<path d="M20 68Q20 34 60 32Q100 34 100 68Q60 56 20 68Z" fill="${STEEL}" stroke="${N}" stroke-width="4" stroke-linejoin="round"/><path d="M60 33V58" stroke="${N}" stroke-width="3"/><path d="M60 32Q66 14 82 12Q78 28 60 32Z" fill="#E0367A" stroke="${N}" stroke-width="3"/>`,
  couraca: `<path d="${VEST}" fill="${GOLD}" stroke="${N}" stroke-width="4" stroke-linejoin="round"/><path d="M60 103V133M36 114Q60 121 84 114" fill="none" stroke="${N}" stroke-width="2.5" stroke-linecap="round"/>`,
  espada: `<path d="M112 34V106" stroke="${N}" stroke-width="9" stroke-linecap="round"/><path d="M112 34V106" stroke="${STEEL}" stroke-width="5" stroke-linecap="round"/><path d="M103 106h18M112 106v14" stroke="${N}" stroke-width="5" stroke-linecap="round"/><circle cx="112" cy="122" r="3.5" fill="${GOLD}" stroke="${N}" stroke-width="2"/>`,
  // ultrarraro: camisa com a foto estampada (public/camisa.webp)
  camisa: `<clipPath id="camisa-clip"><path d="${VEST}"/></clipPath><path d="${VEST}" fill="#fff"/><image href="/camisa.webp" x="24" y="98" width="72" height="40" preserveAspectRatio="xMidYMid slice" clip-path="url(#camisa-clip)"/><path d="${VEST}" fill="none" stroke="${N}" stroke-width="4" stroke-linejoin="round"/>`,
}

/** Mascote Grão. lvl 1–6 muda a cabeça conforme o nível do usuário; gear = { slot: idDoItem } veste roupas. */
export function grao(st = 'feliz', lvl = 2, gear = {}) {
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
${['corpo', 'cintura', 'pes', 'cabeca', 'mao'].map((k) => GEAR[gear[k]] || '').join('')}
<g class="eyes">${eyes}</g>${mouth}${front}${extra}</svg>`
}

// Folha de oliveira: fina e comprida, com o verso prateado (C).
const oLeaf = (x, y, a, l = 9, f = L) =>
  `<ellipse cx="0" cy="${-l / 2}" rx="${l * 0.2}" ry="${l / 2}" transform="translate(${x} ${y}) rotate(${a})" fill="${f}" stroke="${N}" stroke-width="1.6"/>`
// Copa em nuvens: contorno grosso por baixo e preenchimento por cima, para não riscar entre as bolas.
const canopy = (blobs, sw = 5) =>
  blobs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${N}" stroke="${N}" stroke-width="${sw}"/>`).join('') +
  blobs.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${L}"/>`).join('')

/** Oliveira por nível (1–6), usada na “Sua árvore”. */
export function plant(n) {
  let s = `<svg viewBox="0 -6 60 76" aria-hidden="true"><path d="M8 64H52" stroke="${N}" stroke-width="3" stroke-linecap="round"/>`
  if (n === 1) return s + `<ellipse cx="30" cy="57" rx="8" ry="6" fill="${C}" stroke="${N}" stroke-width="2.5"/><path d="M30 51V47" stroke="${N}" stroke-width="2.5" stroke-linecap="round"/></svg>`
  if (n === 2) return s + `<path d="M30 64V46" stroke="${N}" stroke-width="2.5" stroke-linecap="round"/>` + oLeaf(30, 48, -50) + oLeaf(30, 48, 50, 9, C) + oLeaf(30, 47, 0, 7) + '</svg>'
  if (n === 3) return s + `<path d="M30 64Q28 50 31 34" fill="none" stroke="${N}" stroke-width="3" stroke-linecap="round"/>` +
    oLeaf(29, 52, -60) + oLeaf(29, 52, 60, 9, C) + oLeaf(30, 43, -55, 10, C) + oLeaf(30, 43, 55) + oLeaf(31, 35, -10, 8) + '</svg>'
  if (n === 4) return s + `<path d="M30 64Q29 52 31 44M31 46Q24 40 20 34M31 46Q38 40 41 32" fill="none" stroke="${N}" stroke-width="3.5" stroke-linecap="round"/>` +
    canopy([[19, 30, 7], [30, 26, 9], [41, 29, 7]], 4) + oLeaf(24, 26, -40, 7, C) + oLeaf(36, 25, 40, 7, C) + '</svg>'
  // Árvore adulta: tronco grosso e retorcido, com nó, e copa larga e baixa como a oliveira.
  const big = n === 6
  s += `<path d="M22 64C26 58 25 52 28 47C30 43 26 39 25 33L30 31C31 37 34 40 33 45C32 50 36 57 39 64Z" fill="${N}"/>` +
    `<path d="M28 33Q20 28 15 22M31 32Q40 27 45 20" fill="none" stroke="${N}" stroke-width="3.5" stroke-linecap="round"/>` +
    `<ellipse cx="31" cy="52" rx="1.6" ry="3" fill="${C}" opacity=".7"/>` +
    canopy(big ? [[12, 20, 9], [24, 13, 11], [37, 12, 11], [49, 19, 9], [30, 22, 10]] : [[14, 21, 8], [26, 15, 10], [38, 15, 10], [47, 21, 7], [30, 23, 8]]) +
    [[16, 18, -50], [27, 11, -15], [38, 11, 20], [46, 17, 55], [31, 21, 5]].map(([x, y, a]) => oLeaf(x, y, a, 7, C)).join('')
  if (big) s += [[18, 24], [33, 16], [43, 23], [24, 18], [10, 17]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.6" ry="3.4" fill="${V}" stroke="${N}" stroke-width="1.4"/>`).join('')
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
  compartilhar: '<path d="M12 3v12"/><path d="M8 7l4-4 4 4"/><path d="M7 10H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-1"/>',
  adicionar: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M12 8v8M8 12h8"/>',
  menu: '<circle cx="12" cy="5" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="12" cy="19" r="1.4"/>',
  celular: '<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>',
}
export const icon = (n, filled) =>
  `<svg viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]}</svg>`
