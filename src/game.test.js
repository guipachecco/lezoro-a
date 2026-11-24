import test from 'node:test'
import assert from 'node:assert/strict'
import { addDays, badges, levelOf, newState, refresh, water, finishLesson, finishDaily, loseLamp, currentLesson, dailyIndex } from './game.js'
import { UNITS, DAILY } from './content.js'

const base = () => newState({ name: 'Ana' }, {}, '2026-11-20')

test('addDays atravessa mês e ano', () => {
  assert.equal(addDays('2026-11-30', 1), '2026-12-01')
  assert.equal(addDays('2027-01-01', -1), '2026-12-31')
})

test('sequência: dias seguidos somam, mesmo dia não conta duas vezes, falha zera', () => {
  let s = water(base(), '2026-11-20')
  s = water(s, '2026-11-20')
  s = water(s, '2026-11-21')
  assert.equal(s.streak, 2)
  assert.equal(s.best, 2)
  s = refresh(s, '2026-11-24')
  assert.equal(s.streak, 0)
  assert.equal(s.best, 2)
  assert.equal(water(s, '2026-11-24').streak, 1)
})

test('lamparinas acabam em zero e reacendem no dia seguinte', () => {
  let s = base()
  for (let i = 0; i < 7; i++) s = loseLamp(s)
  assert.equal(s.lamps, 0)
  assert.equal(refresh(s, '2026-11-21').lamps, 5)
  assert.equal(refresh(s, '2026-11-20').lamps, 0)
})

test('lição: 10 por acerto, bônus por perfeita, guarda o melhor resultado', () => {
  let { state, earned } = finishLesson(base(), 'gn-1', 5, 5, '2026-11-20')
  assert.equal(earned, 60)
  assert.equal(state.streak, 1)
  ;({ state, earned } = finishLesson(state, 'gn-1', 3, 5, '2026-11-20'))
  assert.equal(earned, 30)
  assert.equal(state.seeds, 90)
  assert.equal(state.done['gn-1'].correct, 5)
  assert.equal(state.log['2026-11-20'], 90)
})

test('desafio diário só rega quando acerta', () => {
  assert.equal(finishDaily(base(), false, '2026-11-20').streak, 0)
  const s = finishDaily(base(), true, '2026-11-20')
  assert.equal(s.seeds, 20)
  assert.equal(s.streak, 1)
})

test('níveis e trilha', () => {
  assert.equal(levelOf(0).name, 'Grão')
  assert.equal(levelOf(1240).name, 'Muda')
  assert.equal(levelOf(1240).next.name, 'Arbusto')
  assert.equal(levelOf(99999).next, null)
  const lessons = UNITS[0].lessons
  assert.equal(currentLesson(lessons, { 'gn-1': {} }), 1)
  const i = dailyIndex('2026-11-22', DAILY.length)
  assert.ok(i >= 0 && i < DAILY.length)
})

test('selos por unidade', () => {
  const ids = UNITS[0].lessons.map((l) => l.id)
  const s = { ...base(), done: Object.fromEntries(ids.map((id) => [id, { correct: 4, total: 5 }])) }
  const b = Object.fromEntries(badges(s, UNITS).map((x) => [x.id, x]))
  assert.equal(b.genesis.on, true)
  assert.equal(b.exodo.on, false)
  assert.equal(b.exodo.progress, `0/${UNITS[1].lessons.length} lições`)
  assert.equal(b.trilha.on, false)
  assert.equal(b.perfeita.on, false)
})

test('conteúdo: ids únicos e 5 perguntas por lição', () => {
  const lessons = UNITS.flatMap((u) => u.lessons)
  assert.equal(new Set(lessons.map((l) => l.id)).size, lessons.length)
  for (const l of lessons) assert.equal(l.qs.length, 5, l.id)
})

test('conteúdo: toda pergunta tem 4 alternativas distintas e referência', () => {
  for (const q of [...UNITS.flatMap((u) => u.lessons.flatMap((l) => [...l.qs, ...l.deep])), ...DAILY]) {
    assert.equal(new Set(q.a).size, 4, q.q)
    assert.ok(q.ref, q.q)
  }
  for (const l of UNITS.flatMap((u) => u.lessons)) assert.equal(l.deep.length, 3, `aprofundamento de ${l.id}`)
})

test('quiz de 10 perguntas define a trilha e o tamanho das lições', async () => {
  const { placement, lessonQs, trailOf } = await import('./game.js')
  const { PLACEMENT } = await import('./content.js')
  assert.equal(PLACEMENT.length, 10)
  for (const q of PLACEMENT) assert.equal(new Set(q.a).size, 4, q.q)
  assert.deepEqual([0, 4, 5, 7, 8, 10].map(placement), ['semente', 'semente', 'raiz', 'raiz', 'profunda', 'profunda'])
  const l = UNITS[0].lessons[0]
  assert.deepEqual(['semente', 'raiz', 'profunda'].map((t) => lessonQs(l, t).length), [3, 5, 8])
  assert.deepEqual([{ depth: 4 }, { depth: 'profunda' }, {}].map(trailOf), ['raiz', 'profunda', null]) // quiz antigo guardava número
})

test('baú, equipar e restart', async () => {
  const { rollChest, addItem, equip, restart, ITEMS } = await import('./game.js')
  assert.equal(rollChest(() => 0).r, 'comum')
  assert.equal(rollChest(() => 0.999).r, 'ultra')
  assert.ok(ITEMS.some((i) => i.r === 'lendario'))
  let s = addItem(addItem(base(), 'couraca'), 'restart')
  assert.equal(equip(s, 'couraca'), s) // nível 1 não veste lendário de nível 4
  s = equip({ ...s, seeds: 1500 }, 'couraca')
  assert.equal(s.gear.corpo, 'couraca')
  s = restart(s)
  assert.deepEqual([s.seeds, s.gear, s.inv.restart, s.inv.couraca], [0, {}, 0, 1])
  assert.equal(restart(s), s) // sem restart, nada muda
})

test('desafios: perguntas válidas em todos os modos, ranking e remover item', async () => {
  const { buildChallenge, MODES, rank, removeItem, addItem } = await import('./game.js')
  const { VERSES } = await import('./content.js')
  for (const mode of Object.keys(MODES).filter((m) => MODES[m].n)) {
    const qs = buildChallenge(mode, UNITS, VERSES)
    assert.equal(qs.length, Math.min(MODES[mode].n, mode === 'onde' || mode === 'termine' ? VERSES.length : 99))
    for (const q of qs) assert.equal(new Set(q.a).size, 4, `${mode}: ${q.q}`)
  }
  assert.deepEqual(rank([{ id: 'a', correct: 3, ms: 9 }, { id: 'b', correct: 5, ms: 20 }, { id: 'c', correct: 5, ms: 10 }]).map((r) => r.id), ['c', 'b', 'a'])
  let s = { ...addItem(base(), 'escudo'), gear: { mao: 'escudo' } }
  s = removeItem(s, 'escudo')
  assert.deepEqual([s.inv.escudo, s.gear], [0, {}])
  assert.equal(removeItem(s, 'escudo'), s)
})

test('gartic: cada álbum passa por todos os jogadores, um por rodada', async () => {
  const { garticChain, garticKind } = await import('./game.js')
  for (const n of [2, 3, 5]) {
    for (let r = 0; r < n; r++) {
      const chains = Array.from({ length: n }, (_, i) => garticChain(i, r, n))
      assert.equal(new Set(chains).size, n, `rodada ${r} com ${n}: cada um num álbum diferente`)
    }
    for (let c = 0; c < n; c++) {
      const who = Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, i) => i).find((i) => garticChain(i, r, n) === c))
      assert.equal(new Set(who).size, n, `álbum ${c} passa por todos`)
      assert.equal(who[0], c, 'quem começa o álbum é o dono')
    }
  }
  assert.deepEqual([0, 1, 2, 3, 4].map(garticKind), ['escrever', 'desenhar', 'descrever', 'desenhar', 'descrever'])
})

test('baú guardado: abrir gasta um baú e aplica o prêmio; todo item de vestir tem desenho', async () => {
  const { addChest, openChest, ITEMS } = await import('./game.js')
  const { grao } = await import('./art.js')
  let s = addChest(addChest({ ...base(), lamps: 1 }))
  assert.equal(s.chests, 2)
  const seq = (...xs) => { let k = 0; return () => xs[k++] }
  // raridade comum (0) e último item da lista comum = saco de sementes
  const commons = ITEMS.filter((i) => i.r === 'comum')
  let r = openChest(s, seq(0, (commons.length - 0.5) / commons.length))
  assert.deepEqual([r.item.id, r.state.seeds, r.state.chests, r.state.inv], ['sementes', 50, 1, undefined])
  r = openChest(r.state, seq(0, 0)) // primeiro comum = cajado, vai para o inventário
  assert.deepEqual([r.item.id, r.state.inv.cajado, r.state.chests], ['cajado', 1, 0])
  assert.equal(openChest(r.state).item, null)
  for (const it of ITEMS.filter((i) => i.slot)) assert.notEqual(grao('feliz', 2, { [it.slot]: it.id }), grao('feliz', 2), `desenho de ${it.id}`)
})
