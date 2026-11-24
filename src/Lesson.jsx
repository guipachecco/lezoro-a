import { useMemo, useRef, useState } from 'react'
import { shuffle } from './game.js'
import { chestSvg } from './Chest.jsx'
import { Art, Bar, Grao, Icon, fmt } from './ui.jsx'

const PRAISE = ['Isso mesmo!', 'Muito bem!', 'Mais uma semente plantada!', 'Certinho!']
const pick = (arr, i) => arr[i % arr.length]

/**
 * Uma rodada de perguntas. mode 'daily' não gasta lamparinas.
 * onFinish(correct, total) devolve { earned, streak, lvlUp } para a tela de resultado.
 */
export function Lesson({ title, qs, mode = 'lesson', lamps, lvl, onWrong, onFinish, onExit, onChest }) {
  const items = useMemo(() => qs.map((q) => ({ ...q, opts: shuffle(q.a) })), [qs])
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState(null)
  const [checked, setChecked] = useState(false)
  const [hits, setHits] = useState(0)
  const [end, setEnd] = useState(null) // { kind: 'done' | 'out', ...resultado }
  const finished = useRef(false)

  const q = items[i]
  const ok = checked && picked === q.a[0]
  const out = mode === 'lesson' && lamps <= 0

  function check() {
    setChecked(true)
    if (picked === q.a[0]) setHits((h) => h + 1)
    else if (mode === 'lesson') onWrong()
  }

  function next() {
    if (out) return setEnd({ kind: 'out' })
    if (i < items.length - 1) { setI(i + 1); setPicked(null); setChecked(false); return }
    if (finished.current) return
    finished.current = true
    setEnd({ kind: 'done', correct: hits, total: items.length, ...onFinish(hits, items.length) })
  }

  if (end) return <Result end={end} mode={mode} lvl={lvl} onExit={onExit} onChest={onChest} />

  return (
    <div className="screen lesson">
      <div className="row">
        <button className="back inline" type="button" onClick={onExit} aria-label="Sair da lição"><Icon n="x" /></button>
        <Bar pct={((i + (checked ? 1 : 0)) / items.length) * 100} />
        {mode === 'lesson'
          ? <span className="ct" style={{ color: 'var(--violet)' }}><Icon n="lamparina" f />{lamps}</span>
          : <span className="ct" style={{ color: 'var(--lime-deep)' }}>+20</span>}
      </div>
      <span className="lbl" style={{ color: 'var(--violet)' }}>{mode === 'daily' ? 'Desafio do dia · complete o versículo' : `${title} · escolha a resposta certa`}</span>
      <h2 className="question">{q.q}</h2>
      <div className="stack" role="radiogroup" aria-label="Alternativas">
        {q.opts.map((o, k) => {
          const state = !checked ? (picked === o ? 'sel' : '') : o === q.a[0] ? 'ok' : picked === o ? 'bad' : ''
          return (
            <button key={o} type="button" role="radio" aria-checked={picked === o} disabled={checked} className={`opt ${state}`} onClick={() => setPicked(o)}>
              <span className="k">{state === 'ok' ? <Icon n="check" /> : state === 'bad' ? <Icon n="x" /> : 'ABCD'[k]}</span>{o}
            </button>
          )
        })}
      </div>
      {!checked && <button className="btn push" type="button" disabled={picked === null} onClick={check}>Verificar</button>}
      {checked && (
        <div className={`fb ${ok ? 'ok' : 'no'}`} role="status">
          <div className="row">
            <Grao st={ok ? 'celebra' : 'encoraja'} lvl={lvl} className={ok ? 'hop' : ''} style={{ width: 58, flex: 'none' }} />
            <div style={{ minWidth: 0 }}>
              <h3>{ok ? pick(PRAISE, i) : `Quase! A resposta é: ${q.a[0]}`}</h3>
              <p>{ok ? q.ref : `Errar também faz a gente crescer. ${q.ref}`}</p>
            </div>
            {ok && <span className="float"><Icon n="semente" f />+10</span>}
          </div>
          <button className={`btn ${ok ? '' : 'dark'}`} type="button" onClick={next} autoFocus>{ok ? 'Continuar' : out ? 'Ver resultado' : 'Entendi'}</button>
        </div>
      )}
    </div>
  )
}

function Result({ end, mode, lvl, onExit, onChest }) {
  if (end.kind === 'out') {
    return (
      <div className="screen result">
        <Grao st="dormindo" lvl={lvl} style={{ width: 150 }} />
        <h2>Suas lamparinas apagaram</h2>
        <p className="muted">Elas reacendem amanhã. Enquanto isso, que tal o desafio do dia ou reler a lição?</p>
        <button className="btn push" type="button" onClick={onExit}>Voltar para a trilha</button>
      </div>
    )
  }
  const perfect = end.correct === end.total
  return (
    <div className="screen result">
      <Grao st={end.lvlUp ? 'orgulhoso' : end.correct ? 'sequencia' : 'encoraja'} lvl={lvl} className="hop" style={{ width: 160 }} />
      <h2>{end.lvlUp ? 'Olha só, subimos de nível!' : mode === 'daily' ? (end.correct ? 'Desafio cumprido!' : 'Amanhã tem outro!') : perfect ? 'Lição perfeita!' : 'Lição concluída!'}</h2>
      <div className="result-stats">
        <div><Icon n="semente" f style={{ color: 'var(--lime-deep)' }} /><b>+{fmt(end.earned)}</b><small>sementes</small></div>
        <div><Icon n="check" style={{ color: 'var(--violet)' }} /><b>{end.correct}/{end.total}</b><small>acertos</small></div>
        <div><Icon n="gota" f style={{ color: 'var(--blue)' }} /><b>{end.streak}</b><small>dias regados</small></div>
      </div>
      {end.chest
        ? (
          <>
            <div className="chest-card hop" role="status">
              <Art html={chestSvg()} className="chest-art bob" />
              <span><b>Você ganhou um baú!</b><small className="muted">Abra agora ou guarde para depois.</small></span>
            </div>
            <button className="btn push" type="button" onClick={onChest} autoFocus>Abrir agora</button>
            <button className="btn ghost-dark" type="button" onClick={onExit}>Guardar para depois</button>
          </>
        )
        : <button className="btn push" type="button" onClick={onExit} autoFocus>Continuar</button>}
    </div>
  )
}
