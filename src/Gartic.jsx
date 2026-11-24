import { useEffect, useRef, useState } from 'react'
import { GARTIC_SECS, garticChain, garticKind, XP_PLAY } from './game.js'
import { awardXp } from './social.js'
import { Bar, Grao, Icon } from './ui.jsx'

const SIZE = 300 // coordenadas do desenho (o quadro escala na tela)
const COLORS = ['#10288C', '#B6DB00', '#6338EE', '#274DEA', '#E0367A', '#9A6233', '#F2C94C', '#FFFFFF']
const MAX_TEXT = 80
const key = (r, c) => `${r}:${c}`

/**
 * Gartic da Bíblia. Quem criou a sala manda "rodada" quando todos enviaram ou o tempo acaba;
 * cada um manda "entrada" (texto ou traços) do álbum em que está.
 * shortcut: se quem criou a sala sair no meio, a partida para. Para resolver, outro jogador teria que assumir o controle.
 */
export function Gartic({ game, me, round, entries, host, code, lvl, gear, onSubmit, onAdvance, onXp, onExit }) {
  const n = game.players.length
  const i = game.players.findIndex((p) => p.id === me.id)
  const kind = garticKind(round)
  const chain = garticChain(i, round, n)
  const sent = Object.keys(entries).filter((k) => k.startsWith(`${round}:`)).length

  // Anfitrião avança a rodada quando todos enviaram, ou quando o tempo acaba (com folga para quem está enviando).
  useEffect(() => {
    if (!host || round >= n) return
    if (sent >= n) { onAdvance(round + 1); return }
    const t = setTimeout(() => onAdvance(round + 1), (GARTIC_SECS[kind] + 6) * 1000)
    return () => clearTimeout(t)
  }, [host, round, sent >= n])

  if (round >= n) return <Albums game={game} entries={entries} code={code} onXp={onXp} onExit={onExit} />
  if (entries[key(round, chain)]) {
    return (
      <div className="screen result">
        <Grao st="pensando" lvl={lvl} gear={gear} className="hop" style={{ width: 130 }} />
        <h2>Enviado!</h2>
        <p className="muted">Esperando a galera… {sent}/{n}</p>
        <Bar pct={(sent / n) * 100} />
      </div>
    )
  }
  const prev = round ? entries[key(round - 1, chain)] : null
  return <Turn key={round} kind={kind} round={round} total={n} prev={prev} scene={game.scenes[i]} onSend={(content) => onSubmit(round, chain, kind, content)} />
}

function Turn({ kind, round, total, prev, scene, onSend }) {
  const secs = GARTIC_SECS[kind]
  const [left, setLeft] = useState(secs)
  const [text, setText] = useState(kind === 'escrever' ? scene : '')
  const strokes = useRef([])
  const sent = useRef(false)

  function send() {
    if (sent.current) return
    sent.current = true
    onSend(kind === 'desenhar' ? { strokes: strokes.current } : { text: text.trim().slice(0, MAX_TEXT) || '…' })
  }
  useEffect(() => { const t = setInterval(() => setLeft((l) => l - 1), 1000); return () => clearInterval(t) }, [])
  useEffect(() => { if (left <= 0) send() }, [left])

  const title = { escrever: 'Escreva uma cena da Bíblia', desenhar: 'Desenhe isto:', descrever: 'O que é este desenho?' }[kind]
  return (
    <div className="screen lesson gartic">
      <div className="row">
        <Bar pct={(left / secs) * 100} />
        <span className="ct" style={{ color: 'var(--violet)' }}>{Math.max(0, left)}s</span>
      </div>
      <span className="lbl" style={{ color: 'var(--violet)' }}>Rodada {round + 1} de {total}</span>
      <h2 className="question">{title}</h2>
      {kind === 'desenhar' && <p className="bubble">{prev?.text || '…'}</p>}
      {kind === 'descrever' && <Drawing strokes={prev?.strokes} />}
      {kind === 'desenhar'
        ? <Pad strokes={strokes} />
        : (
          <label className="fl">{kind === 'escrever' ? 'Pode trocar a sugestão' : 'Sua resposta'}
            <span className="field"><input value={text} maxLength={MAX_TEXT} onChange={(e) => setText(e.target.value)} placeholder={kind === 'escrever' ? 'Ex.: Davi vence Golias' : 'Ex.: Noé e a arca'} autoFocus /></span>
          </label>
        )}
      <button className="btn push" type="button" onClick={send}>Enviar</button>
    </div>
  )
}

/** Quadro de desenho: guarda os traços em coordenadas 0–300 para enviar leve pela rede. */
function Pad({ strokes }) {
  const cv = useRef(null)
  const cur = useRef(null)
  const [color, setColor] = useState(COLORS[0])
  const [width, setWidth] = useState(4)

  function paint() {
    const c = cv.current, g = c.getContext('2d'), k = c.width / SIZE
    g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height)
    g.lineCap = 'round'; g.lineJoin = 'round'
    for (const s of strokes.current) {
      g.strokeStyle = s.c; g.lineWidth = s.w * k; g.beginPath()
      g.moveTo(s.p[0] * k, s.p[1] * k)
      for (let j = 2; j < s.p.length; j += 2) g.lineTo(s.p[j] * k, s.p[j + 1] * k)
      if (s.p.length === 2) g.lineTo(s.p[0] * k + 0.1, s.p[1] * k)
      g.stroke()
    }
  }
  useEffect(() => {
    const c = cv.current, dpr = window.devicePixelRatio || 1
    c.width = c.height = Math.round(c.getBoundingClientRect().width * dpr)
    paint()
  }, [])

  const at = (e) => {
    const r = cv.current.getBoundingClientRect()
    return [Math.round(((e.clientX - r.left) / r.width) * SIZE), Math.round(((e.clientY - r.top) / r.height) * SIZE)]
  }
  function down(e) {
    e.preventDefault(); cv.current.setPointerCapture(e.pointerId)
    cur.current = { c: color, w: width, p: at(e) }
    strokes.current = [...strokes.current, cur.current]; paint()
  }
  function move(e) {
    if (!cur.current) return
    const [x, y] = at(e), p = cur.current.p
    if (Math.abs(x - p[p.length - 2]) + Math.abs(y - p[p.length - 1]) < 3) return // menos pontos = envio mais leve
    p.push(x, y); paint()
  }
  const up = () => { cur.current = null }
  const undo = () => { strokes.current = strokes.current.slice(0, -1); paint() }
  const clear = () => { strokes.current = []; paint() }

  return (
    <div className="pad">
      <canvas ref={cv} className="pad-canvas" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} aria-label="Quadro de desenho" />
      <div className="pad-tools">
        {COLORS.map((c) => (
          <button key={c} type="button" className={`swatch ${c === color ? 'on' : ''}`} style={{ background: c }} onClick={() => setColor(c)} aria-label={c === '#FFFFFF' ? 'Borracha' : `Cor ${c}`} />
        ))}
        <button type="button" className={`swatch size ${width === 4 ? 'on' : ''}`} onClick={() => setWidth(4)} aria-label="Traço fino"><i style={{ width: 5, height: 5 }} /></button>
        <button type="button" className={`swatch size ${width === 12 ? 'on' : ''}`} onClick={() => setWidth(12)} aria-label="Traço grosso"><i style={{ width: 12, height: 12 }} /></button>
        <button type="button" className="icon-btn" onClick={undo} aria-label="Desfazer"><Icon n="seta" /></button>
        <button type="button" className="icon-btn" onClick={clear} aria-label="Apagar tudo"><Icon n="x" /></button>
      </div>
    </div>
  )
}

/** Mostra um desenho recebido (traços) em SVG. */
export function Drawing({ strokes = [] }) {
  return (
    <svg className="drawing" viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label="Desenho">
      <rect width={SIZE} height={SIZE} fill="#fff" />
      {strokes.map((s, j) => s.p.length === 2
        ? <circle key={j} cx={s.p[0]} cy={s.p[1]} r={s.w / 2} fill={s.c} />
        : <polyline key={j} points={s.p.join(' ')} fill="none" stroke={s.c} strokeWidth={s.w} strokeLinecap="round" strokeLinejoin="round" />)}
    </svg>
  )
}

function Albums({ game, entries, code, onXp, onExit }) {
  const n = game.players.length
  const [c, setC] = useState(0)
  const [xp, setXp] = useState(null)
  useEffect(() => {
    awardXp(`${code}-${game.at}`, XP_PLAY).then((v) => { setXp(XP_PLAY); onXp(v) }).catch(() => setXp(0))
  }, [])
  const owner = game.players[c]
  return (
    <div className="screen">
      <div className="row between">
        <h1 className="title" style={{ margin: 0 }}>Álbum de {owner.name}</h1>
        <small className="muted">{c + 1}/{n}</small>
      </div>
      {xp ? <p className="info">+{xp} XP por jogar!</p> : null}
      <div className="stack">
        {Array.from({ length: n }, (_, r) => {
          const e = entries[key(r, c)]
          const by = game.players[(c + r) % n].name
          return (
            <div key={r} className="album-step">
              <small className="muted">{by} {garticKind(r) === 'desenhar' ? 'desenhou' : r ? 'achou que era' : 'escreveu'}</small>
              {!e ? <p className="muted">(não enviou)</p> : e.strokes ? <Drawing strokes={e.strokes} /> : <p className="bubble">{e.text}</p>}
            </div>
          )
        })}
      </div>
      <div className="row">
        <button className="btn ghost-dark" type="button" disabled={c === 0} onClick={() => { setC(c - 1); window.scrollTo(0, 0) }}>Anterior</button>
        {c < n - 1
          ? <button className="btn" type="button" onClick={() => { setC(c + 1); window.scrollTo(0, 0) }}>Próximo álbum</button>
          : <button className="btn" type="button" onClick={onExit}>Sair</button>}
      </div>
    </div>
  )
}
