import { useEffect, useMemo, useRef, useState } from 'react'
import { VERSES, UNITS } from './content.js'
import { buildChallenge, MAX_PLAYERS, MODES, rank, shuffle, XP_PLAY, XP_WIN } from './game.js'
import { awardXp, sendInvite } from './social.js'
import { sb } from './supabase.js'
import { Bar, Grao, Icon } from './ui.jsx'

/**
 * Sala de desafio ao vivo (Supabase Realtime, sem tabela):
 * presença = quem está na sala; quem criou manda "inicio" com as perguntas; cada um manda "fim" com acertos e tempo.
 * shortcut: cada aparelho calcula o próprio resultado; quem quiser trapacear consegue. Para valer prêmio de verdade, a correção tem que ir para o servidor.
 */
export function Room({ me, code, mode: myMode, host, friends, lvl, gear, onXp, onExit }) {
  const [players, setPlayers] = useState([])
  const [game, setGame] = useState(null)
  const [results, setResults] = useState({})
  const [mine, setMine] = useState(null)
  const [closed, setClosed] = useState(false)
  const [xp, setXp] = useState(null)
  const [invited, setInvited] = useState({})
  const ch = useRef(null)

  useEffect(() => {
    const c = sb.channel(`sala:${code}`, { config: { presence: { key: me.id }, broadcast: { self: true } } })
    c.on('presence', { event: 'sync' }, () => setPlayers(Object.values(c.presenceState()).map((p) => p[0])))
      .on('broadcast', { event: 'inicio' }, ({ payload }) => setGame((g) => g || payload))
      .on('broadcast', { event: 'fim' }, ({ payload }) => setResults((r) => ({ ...r, [payload.id]: payload })))
      .subscribe((st) => { if (st === 'SUBSCRIBED') c.track({ id: me.id, name: me.name, host, mode: myMode }) })
    ch.current = c
    return () => { sb.removeChannel(c) }
  }, [code])

  const mode = game?.mode || players.find((p) => p.host)?.mode || myMode
  const roster = game ? game.players : players
  const ranking = rank(Object.values(results))
  const final = !!game && (closed || game.players.every((p) => results[p.id]))

  // Prêmio: quem ganhou leva XP_WIN, os outros XP_PLAY. O servidor só conta uma vez por partida.
  useEffect(() => {
    if (!final || xp !== null || ranking.length < 2 || !results[me.id]) return
    const amount = ranking[0].id === me.id ? XP_WIN : XP_PLAY
    setXp(amount)
    awardXp(`${code}-${game.at}`, amount).then(onXp).catch(() => setXp(0))
  }, [final])

  function start() {
    const payload = { mode, at: Date.now(), qs: buildChallenge(mode, UNITS, VERSES), players: players.slice(0, MAX_PLAYERS).map(({ id, name }) => ({ id, name })) }
    ch.current.send({ type: 'broadcast', event: 'inicio', payload })
  }
  function finish(r) {
    setMine(r)
    ch.current.send({ type: 'broadcast', event: 'fim', payload: { id: me.id, name: me.name, ...r } })
  }
  async function invite(f) {
    setInvited((x) => ({ ...x, [f.id]: 'enviando' }))
    try { await sendInvite(f.id, { room: code, mode, from: me.name }); setInvited((x) => ({ ...x, [f.id]: 'ok' })) } catch { setInvited((x) => ({ ...x, [f.id]: 'erro' })) }
  }

  const playing = game && !mine && game.players.some((p) => p.id === me.id)
  if (playing) return <Play key={game.at} qs={game.qs} secs={MODES[game.mode].secs} title={MODES[game.mode].name} onDone={finish} />

  if (game && game.players.some((p) => p.id === me.id)) {
    return (
      <div className="screen result">
        <Grao st={final ? (ranking[0]?.id === me.id ? 'celebra' : 'encoraja') : 'pensando'} lvl={lvl} gear={gear} className="hop" style={{ width: 140 }} />
        <h2>{!final ? 'Esperando a galera terminar…' : ranking[0]?.id === me.id ? 'Você venceu!' : `${ranking[0]?.name} venceu!`}</h2>
        <ol className="rank wide">
          {roster.map((p) => results[p.id] || { ...p, pending: true })
            .sort((x, y) => (x.pending ? 1 : 0) - (y.pending ? 1 : 0) || y.correct - x.correct || x.ms - y.ms)
            .map((r, i) => (
              <li key={r.id} className={r.id === me.id ? 'me' : ''}>
                <span className="pos">{r.pending ? '…' : `${i + 1}º`}</span><span className="grow">{r.name}</span>
                <b>{r.pending ? 'jogando' : `${r.correct}/${game.qs.length} · ${(r.ms / 1000).toFixed(1)}s`}</b>
              </li>
            ))}
        </ol>
        {final && xp !== null && <p className="chest" style={{ '--rc': 'var(--violet)' }}><small>XP ganho</small><b>+{xp} XP</b></p>}
        {!final && <button className="btn ghost-dark" type="button" onClick={() => setClosed(true)}>Encerrar sem esperar</button>}
        <button className="btn push" type="button" onClick={onExit}>Voltar</button>
      </div>
    )
  }

  const online = new Set(players.map((p) => p.id))
  return (
    <div className="screen">
      <div className="row">
        <button className="back inline" type="button" onClick={onExit} aria-label="Sair da sala"><Icon n="x" /></button>
        <h1 className="title" style={{ margin: 0 }}>{mode ? MODES[mode].name : 'Sala'}</h1>
      </div>
      <div className="card center-col">
        <span className="lbl">Código da sala</span>
        <b className="code-big">{code}</b>
        <small className="muted">{game ? 'A partida já começou sem você. Espere a próxima!' : host ? 'Chame seus amigos e comece quando todos estiverem aqui.' : 'Esperando quem criou a sala começar…'}</small>
      </div>
      <div className="card stack">
        <b className="h">Na sala ({players.length}/{MAX_PLAYERS})</b>
        {players.map((p) => (
          <div key={p.id} className="friend"><span className="avatar sm">{p.name[0]?.toUpperCase()}</span><span className="grow"><b>{p.name}</b>{p.host && <small>criou a sala</small>}</span></div>
        ))}
      </div>
      {friends.length > 0 && (
        <div className="card stack">
          <b className="h">Chamar amigos</b>
          {friends.filter((f) => !online.has(f.id)).map((f) => (
            <div key={f.id} className="friend">
              <span className="avatar sm">{f.name[0]?.toUpperCase()}</span><span className="grow"><b>{f.name}</b></span>
              <button className="btn inline small" type="button" disabled={!!invited[f.id] && invited[f.id] !== 'erro'} onClick={() => invite(f)}>
                {{ enviando: 'Chamando…', ok: 'Chamado!', erro: 'Tentar de novo' }[invited[f.id]] || 'Chamar'}
              </button>
            </div>
          ))}
          <small className="muted">O convite chega para quem estiver com o app aberto.</small>
        </div>
      )}
      {host && !game && <button className="btn push" type="button" disabled={players.length < 2} onClick={start}>{players.length < 2 ? 'Esperando mais alguém…' : `Começar com ${Math.min(players.length, MAX_PLAYERS)}`}</button>}
    </div>
  )
}

/** Uma partida: responde e já passa para a próxima. Com secs, acaba quando o tempo zera. */
function Play({ qs, secs, title, onDone }) {
  const opts = useMemo(() => qs.map((q) => shuffle(q.a)), [qs])
  const [i, setI] = useState(0)
  const [hits, setHits] = useState(0)
  const [flash, setFlash] = useState(null)
  const [left, setLeft] = useState(secs)
  const t0 = useRef(Date.now())
  const done = useRef(false)

  const finish = (h) => {
    if (done.current) return
    done.current = true
    onDone({ correct: h, ms: Math.min(Date.now() - t0.current, (secs || 9999) * 1000) })
  }
  useEffect(() => {
    if (!secs) return
    const id = setInterval(() => setLeft((l) => l - 1), 1000)
    return () => clearInterval(id)
  }, [secs])
  useEffect(() => { if (secs && left <= 0) finish(hits) }, [left])

  function pick(o) {
    if (flash) return
    const ok = o === qs[i].a[0], h = hits + (ok ? 1 : 0)
    setHits(h); setFlash({ o, ok })
    setTimeout(() => { setFlash(null); if (i + 1 < qs.length) setI(i + 1); else finish(h) }, 400)
  }

  return (
    <div className="screen lesson">
      <div className="row">
        <Bar pct={secs ? (left / secs) * 100 : (i / qs.length) * 100} />
        <span className="ct" style={{ color: 'var(--violet)' }}>{secs ? `${Math.max(0, left)}s` : `${i + 1}/${qs.length}`}</span>
      </div>
      <span className="lbl" style={{ color: 'var(--violet)' }}>{title} · {hits} {hits === 1 ? 'acerto' : 'acertos'}</span>
      <h2 className="question">{qs[i].q}</h2>
      <div className="stack">
        {opts[i].map((o, k) => {
          const st = flash ? (o === qs[i].a[0] ? 'ok' : flash.o === o ? 'bad' : '') : ''
          return (
            <button key={o} type="button" className={`opt ${st}`} onClick={() => pick(o)}>
              <span className="k">{st === 'ok' ? <Icon n="check" /> : st === 'bad' ? <Icon n="x" /> : 'ABCD'[k]}</span>{o}
            </button>
          )
        })}
      </div>
    </div>
  )
}
