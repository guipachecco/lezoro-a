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

export function badges(s, lessonIds) {
  const lessons = Object.keys(s.done).length
  const perfect = Object.values(s.done).some((d) => d.correct === d.total)
  const gn = lessonIds.filter((id) => s.done[id]).length
  return [
    { id: 'grao', icon: 'semente', title: 'Primeiro grão', on: lessons >= 1, progress: `${Math.min(lessons, 1)}/1 lição` },
    { id: 'semana', icon: 'gota', title: '7 dias regados', on: s.best >= 7, progress: `${Math.min(s.best, 7)}/7 dias` },
    { id: 'perfeita', icon: 'luz', title: 'Lição perfeita', on: perfect, progress: 'Acerte tudo numa lição' },
    { id: 'genesis', icon: 'biblia', title: 'Leitor de Gênesis', on: gn === lessonIds.length, progress: `${gn}/${lessonIds.length} lições` },
    { id: 'mil', icon: 'trilha', title: '1.000 sementes', on: s.seeds >= 1000, progress: `${Math.min(s.seeds, 1000)}/1.000` },
    { id: 'raiz', icon: 'medalha', title: 'Raiz firme', on: s.best >= 30, progress: `${Math.min(s.best, 30)}/30 dias` },
  ]
}

export function shuffle(arr, rnd = Math.random) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1));[a[i], a[j]] = [a[j], a[i]] }
  return a
}
