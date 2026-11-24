// Regras do jogo, sem React nem armazenamento: funções puras sobre o estado do usuário.
// Datas são chaves "AAAA-MM-DD" no fuso local.

export const MAX_LAMPS = 5
export const SEEDS_PER_HIT = 10
export const PERFECT_BONUS = 10
export const DAILY_SEEDS = 20

export const LEVELS = [
  { n: 1, name: 'Grão', min: 0 },
  { n: 2, name: 'Broto', min: 200 },
  { n: 3, name: 'Muda', min: 1000 },
  { n: 4, name: 'Arbusto', min: 1500 },
  { n: 5, name: 'Árvore', min: 5000 },
  { n: 6, name: 'Frutífera', min: 10000 },
]

export function levelOf(seeds) {
  let lvl = LEVELS[0]
  for (const l of LEVELS) if (seeds >= l.min) lvl = l
  return { ...lvl, next: LEVELS[lvl.n] || null }
}

const pad = (n) => String(n).padStart(2, '0')
export const dayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export function addDays(key, n) {
  const [y, m, d] = key.split('-').map(Number)
  return dayKey(new Date(y, m - 1, d + n))
}

export function newState(user, prefs, today) {
  return { user, prefs, since: today, seeds: 0, lamps: MAX_LAMPS, lampsDay: today, streak: 0, best: 0, lastDay: null, days: [], done: {}, dailyDone: null, log: {} }
}

/** Sementes ganhas por dia, para o gráfico da semana. */
function addLog(s, today, n) {
  const log = { ...(s.log || {}), [today]: ((s.log || {})[today] || 0) + n }
  for (const k of Object.keys(log)) if (k < addDays(today, -30)) delete log[k]
  return { ...s, log }
}

/** Ao abrir o app: reacende lamparinas num novo dia e zera a sequência se passou um dia sem regar. */
export function refresh(s, today) {
  const out = { ...s }
  if (s.lampsDay !== today) { out.lamps = MAX_LAMPS; out.lampsDay = today }
  if (s.lastDay && s.lastDay < addDays(today, -1)) out.streak = 0
  return out
}

/** Marca o dia como regado e atualiza a sequência. */
export function water(s, today) {
  if (s.lastDay === today) return s
  const streak = s.lastDay === addDays(today, -1) ? s.streak + 1 : 1
  return { ...s, streak, best: Math.max(s.best, streak), lastDay: today, days: [...s.days, today].slice(-60) }
}

export const loseLamp = (s) => ({ ...s, lamps: Math.max(0, s.lamps - 1) })

export function finishLesson(s, lessonId, correct, total, today) {
  const earned = correct * SEEDS_PER_HIT + (correct === total ? PERFECT_BONUS : 0)
  const prev = s.done[lessonId]
  const best = !prev || correct > prev.correct ? { correct, total } : prev
  const next = water(addLog({ ...s, seeds: s.seeds + earned, done: { ...s.done, [lessonId]: best } }, today, earned), today)
  return { state: next, earned }
}

export function finishDaily(s, ok, today) {
  const next = addLog({ ...s, dailyDone: today, seeds: s.seeds + (ok ? DAILY_SEEDS : 0) }, today, ok ? DAILY_SEEDS : 0)
  return ok ? water(next, today) : next
}

/** Índice da próxima lição liberada (a primeira não concluída). */
export function currentLesson(lessons, done) {
  const i = lessons.findIndex((l) => !done[l.id])
  return i === -1 ? lessons.length : i
}

/** Pergunta do desafio diário: muda a cada dia, igual para todos. */
export function dailyIndex(today, count) {
  const [y, m, d] = today.split('-').map(Number)
  return Math.floor(Date.UTC(y, m - 1, d) / 864e5) % count
}

export function badges(s, units) {
  const count = (ls) => ls.filter((l) => s.done[l.id]).length
  const all = units.flatMap((u) => u.lessons)
  const lessons = count(all)
  const perfect = Object.values(s.done).some((d) => d.correct === d.total)
  const unit = (unitId, id, icon, title) => {
    const ls = units.find((u) => u.id === unitId).lessons
    return { id, icon, title, on: count(ls) === ls.length, progress: `${count(ls)}/${ls.length} lições` }
  }
  return [
    { id: 'grao', icon: 'semente', title: 'Primeiro grão', on: lessons >= 1, progress: `${Math.min(lessons, 1)}/1 lição` },
    { id: 'semana', icon: 'gota', title: '7 dias regados', on: s.best >= 7, progress: `${Math.min(s.best, 7)}/7 dias` },
    { id: 'perfeita', icon: 'check', title: 'Lição perfeita', on: perfect, progress: 'Acerte tudo numa lição' },
    unit('gn', 'genesis', 'biblia', 'Leitor de Gênesis'),
    unit('ex', 'exodo', 'lamparina', 'Caminho do Êxodo'),
    unit('jesus', 'jesus', 'luz', 'Seguidor de Jesus'),
    { id: 'mil', icon: 'semente', title: '1.000 sementes', on: s.seeds >= 1000, progress: `${Math.min(s.seeds, 1000)}/1.000` },
    { id: 'raiz', icon: 'trilha', title: 'Raiz firme', on: s.best >= 30, progress: `${Math.min(s.best, 30)}/30 dias` },
    { id: 'trilha', icon: 'medalha', title: 'Trilha completa', on: lessons === all.length, progress: `${lessons}/${all.length} lições` },
  ]
}

export function shuffle(arr, rnd = Math.random) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1));[a[i], a[j]] = [a[j], a[i]] }
  return a
}

// Trilhas pelo quiz do cadastro (10 perguntas). Quanto mais fundo, mais perguntas e mais difíceis.
export const TRAILS = {
  semente: { name: 'Semente', desc: '3 perguntas básicas por lição' },
  raiz: { name: 'Raiz', desc: '5 perguntas por lição' },
  profunda: { name: 'Profunda', desc: '8 perguntas por lição, com aprofundamento' },
}
/** 0–4 acertos → semente, 5–7 → raiz, 8–10 → profunda. */
export const placement = (score) => (score >= 8 ? 'profunda' : score >= 5 ? 'raiz' : 'semente')
// Quem fez o quiz antigo guardou um número (3, 4 ou 5 perguntas): vira a trilha equivalente.
const OLD_DEPTH = { 3: 'semente', 4: 'raiz', 5: 'profunda' }
export const trailOf = (prefs) => (TRAILS[prefs?.depth] ? prefs.depth : OLD_DEPTH[prefs?.depth] || null)

/** Perguntas da lição conforme a trilha: Semente só as básicas, Profunda soma as de aprofundamento. */
export function lessonQs(lesson, trail) {
  if (trail === 'semente') return lesson.qs.slice(0, 3)
  if (trail === 'profunda') return [...lesson.qs, ...(lesson.deep || [])]
  return lesson.qs
}

// Baú: [nome, cor, peso do sorteio]. Primeiro sorteia a raridade, depois um item dela.
export const RARITY = {
  comum: ['Comum', '#7D86A8', 55], raro: ['Raro', '#274DEA', 25], epico: ['Épico', '#6338EE', 12],
  lendario: ['Lendário', '#D99A00', 6], ultra: ['Ultrarraro', '#E0367A', 2],
}
export const ITEMS = [
  { id: 'cajado', name: 'Cajado de pastor', r: 'comum', slot: 'mao', lvl: 1 },
  { id: 'sandalias', name: 'Sandálias de couro', r: 'comum', slot: 'pes', lvl: 1 },
  { id: 'faixa', name: 'Faixa de linho', r: 'comum', slot: 'cintura', lvl: 1 },
  { id: 'cinto', name: 'Cinto da verdade', r: 'raro', slot: 'cintura', lvl: 2, ref: 'Efésios 6:14' },
  { id: 'calcado', name: 'Calçado da paz', r: 'raro', slot: 'pes', lvl: 2, ref: 'Efésios 6:15' },
  { id: 'escudo', name: 'Escudo da fé', r: 'epico', slot: 'mao', lvl: 3, ref: 'Efésios 6:16' },
  { id: 'capacete', name: 'Capacete da salvação', r: 'epico', slot: 'cabeca', lvl: 3, ref: 'Efésios 6:17' },
  { id: 'restart', name: 'Restart da trilha', r: 'epico', slot: null, lvl: 1 },
  { id: 'couraca', name: 'Couraça da justiça', r: 'lendario', slot: 'corpo', lvl: 4, ref: 'Efésios 6:14' },
  { id: 'espada', name: 'Espada do Espírito', r: 'lendario', slot: 'mao', lvl: 5, ref: 'Efésios 6:17' },
  { id: 'camisa', name: 'Camisa do Dorminhoco', r: 'ultra', slot: 'corpo', lvl: 1 },
]
export const itemById = (id) => ITEMS.find((i) => i.id === id)

export function rollChest(rnd = Math.random) {
  let x = rnd() * Object.values(RARITY).reduce((a, r) => a + r[2], 0)
  const r = Object.keys(RARITY).find((k) => (x -= RARITY[k][2]) < 0) || 'comum'
  const pool = ITEMS.filter((i) => i.r === r)
  return pool[Math.floor(rnd() * pool.length)]
}

export const addItem = (s, id) => ({ ...s, inv: { ...s.inv, [id]: ((s.inv || {})[id] || 0) + 1 } })

/** Veste ou tira um item. Só veste se tiver o item e o nível. */
export function equip(s, id) {
  const it = itemById(id), gear = { ...s.gear }
  if (!it?.slot || !(s.inv || {})[id] || levelOf(s.seeds).n < it.lvl) return s
  if (gear[it.slot] === id) delete gear[it.slot]
  else gear[it.slot] = id
  return { ...s, gear }
}

/** Gasta um restart: o Grão volta a semente (sementes, lições e roupas zeram) e o quiz é refeito. Itens ficam. */
export function restart(s) {
  const n = (s.inv || {}).restart || 0
  if (!n) return s
  return { ...s, inv: { ...s.inv, restart: n - 1 }, seeds: 0, done: {}, gear: {}, prefs: { ...s.prefs, depth: undefined } }
}

/** Tira uma unidade do item; se acabou, também tira do corpo do Grão. */
export function removeItem(s, id) {
  const n = (s.inv || {})[id] || 0
  if (!n) return s
  const gear = { ...s.gear }
  if (n === 1) for (const k of Object.keys(gear)) if (gear[k] === id) delete gear[k]
  return { ...s, inv: { ...s.inv, [id]: n - 1 }, gear }
}

// Desafios ao vivo entre amigos. secs = tempo total da partida (só no quiz rápido).
export const MODES = {
  quiz: { name: 'Quiz bíblico', sub: '8 perguntas das lições', n: 8 },
  rapido: { name: 'Quiz rápido', sub: 'Quem acerta mais em 60 segundos', n: 20, secs: 60 },
  onde: { name: 'Onde está o versículo?', sub: 'Acerte a referência', n: 8 },
  termine: { name: 'Termine o versículo', sub: 'Escolha o final certo', n: 8 },
}
export const XP_WIN = 50, XP_PLAY = 10, MAX_PLAYERS = 8

/** Perguntas da partida, no mesmo formato das lições (a[0] é a certa). Quem cria a sala sorteia e manda para todos. */
export function buildChallenge(mode, units, verses, rnd = Math.random) {
  const n = MODES[mode].n
  if (mode === 'quiz' || mode === 'rapido') {
    return shuffle(units.flatMap((u) => u.lessons.flatMap((l) => l.qs)), rnd).slice(0, n).map(({ q, a }) => ({ q, a }))
  }
  return shuffle(verses, rnd).slice(0, n).map((v) => {
    const others = shuffle(verses.filter((o) => o !== v), rnd).slice(0, 3)
    return mode === 'onde'
      ? { q: `“${v.start} ${v.end}”`, a: [v.ref, ...others.map((o) => o.ref)] }
      : { q: `${v.start} …`, a: [v.end, ...others.map((o) => o.end)] }
  })
}

/** Ranking: mais acertos primeiro; empate, quem foi mais rápido. */
export const rank = (results) => [...results].sort((x, y) => y.correct - x.correct || x.ms - y.ms)
