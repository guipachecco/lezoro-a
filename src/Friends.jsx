import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { sb } from './supabase.js'
import { addItem, ITEMS, itemById, MODES, RARITY, removeItem } from './game.js'
import { addFriend, claimedItem, listFriends, listTrades, proposeTrade, removeFriend, topPlayers, tradeStep } from './social.js'
import { Grao, Icon, fmt } from './ui.jsx'

const ROOM_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const roomCode = () => Array.from({ length: 5 }, () => ROOM_CHARS[Math.floor(Math.random() * ROOM_CHARS.length)]).join('')
const inviteLink = (code) => `${window.location.origin}/?amigo=${code}`
const itemName = (id) => itemById(id)?.name || id

function friendError(err) {
  const m = (err?.message || '').toLowerCase()
  if (m.includes('codigo nao encontrado')) return 'Não achamos ninguém com esse código.'
  if (m.includes('proprio codigo')) return 'Esse é o seu próprio código.'
  if (m.includes('fetch')) return 'Sem conexão. Tente de novo.'
  return 'Não deu certo agora. Tente de novo em instantes.'
}

/** Aba Amigos: código e QR, adicionar, desafios ao vivo, trocas de itens e ranking geral. */
export function Friends(props) {
  if (!sb) return <div className="screen center-col"><Grao st="pensando" style={{ width: 120 }} /><h2>Amigos</h2><p className="muted">Amigos, trocas e desafios precisam de uma conta online.</p></div>
  if (props.me === null) return <div className="screen center-col"><Grao st="dormindo" style={{ width: 120 }} /><p className="muted">Carregando seus amigos…</p></div>
  if (!props.me) return <div className="screen center-col"><Grao st="encoraja" style={{ width: 120 }} /><h2>Amigos</h2><p className="muted">Não conseguimos carregar seus amigos agora. Verifique a internet e abra o app de novo.</p></div>
  return <FriendsBody {...props} />
}

function FriendsBody({ s, me, setS, onRoom }) {
  const [friends, setFriends] = useState([])
  const [trades, setTrades] = useState([])
  const [top, setTop] = useState([])
  const [qr, setQr] = useState('')
  const [code, setCode] = useState('')
  const [join, setJoin] = useState('')
  const [msg, setMsg] = useState('')
  const [trading, setTrading] = useState(null) // amigo com quem está montando uma troca
  const inv = s.inv || {}

  async function load() {
    try {
      const [fs, ts, tp] = await Promise.all([listFriends(me.id), listTrades(), topPlayers()])
      setFriends(fs); setTop(tp)
      // trocas que terminaram: quem propôs resgata o item (pedido ou o próprio de volta)
      const got = []
      for (const t of ts.filter((t) => t.from_id === me.id && t.status !== 'pending' && !t.claimed)) {
        const r = await tradeStep(t.id, 'claim')
        const id = r && claimedItem(r)
        if (id) { setS((x) => addItem(x, id)); got.push(itemName(id)) }
      }
      if (got.length) setMsg(`Você recebeu: ${got.join(', ')}.`)
      setTrades(ts.filter((t) => t.status === 'pending'))
    } catch (e) {
      setMsg(friendError(e))
    }
  }
  useEffect(() => { load() }, [])
  useEffect(() => { QRCode.toDataURL(inviteLink(me.code), { margin: 1, width: 220, color: { dark: '#10288C' } }).then(setQr) }, [me.code])

  const nameOf = (id) => friends.find((f) => f.id === id)?.name || 'Amigo'

  async function add(e) {
    e.preventDefault()
    setMsg('')
    try { const f = await addFriend(code); setCode(''); setMsg(`${f.name} agora é seu amigo!`); load() } catch (err) { setMsg(friendError(err)) }
  }

  async function share() {
    const text = `Vem cultivar a fé comigo no Lezoro'a! Meu código de amigo: ${me.code}`
    try {
      if (navigator.share) await navigator.share({ title: "Lezoro'a", text, url: inviteLink(me.code) })
      else { await navigator.clipboard.writeText(`${text} ${inviteLink(me.code)}`); setMsg('Convite copiado!') }
    } catch { /* a pessoa fechou o compartilhar */ }
  }

  async function step(t, action) {
    setMsg('')
    if (action === 'accept' && t.want && !inv[t.want]) return setMsg(`Você precisa ter ${itemName(t.want)} para aceitar.`)
    try {
      const r = await tradeStep(t.id, action)
      if (!r) setMsg('Essa troca já não vale mais.')
      else if (action === 'accept') { setS((x) => addItem(t.want ? removeItem(x, t.want) : x, t.give)); setMsg(`Troca feita! Você ganhou ${itemName(t.give)}.`) }
      if (action === 'cancel' && r) {
        const back = await tradeStep(t.id, 'claim')
        if (back) setS((x) => addItem(x, t.give))
      }
    } catch (e) { setMsg(friendError(e)) }
    load()
  }

  async function unfriend(f) {
    if (!window.confirm(`Desfazer a amizade com ${f.name}?`)) return
    try { await removeFriend(me.id, f.id); load() } catch (e) { setMsg(friendError(e)) }
  }

  return (
    <div className="screen">
      <h1 className="title">Amigos</h1>
      {msg && <p className="info" role="status">{msg}</p>}

      <div className="card center-col">
        <span className="lbl">Seu código de amigo</span>
        <b className="code-big">{me.code}</b>
        {qr && <img className="qr" src={qr} alt={`QR code para adicionar ${me.name} como amigo`} width="180" height="180" />}
        <small className="muted">Seu amigo aponta a câmera do celular para o QR e já entra como seu amigo.</small>
        <button className="btn inline small" type="button" onClick={share}><Icon n="compartilhar" />Compartilhar convite</button>
      </div>

      <form className="card stack" onSubmit={add}>
        <b className="h">Adicionar por código</b>
        <div className="row">
          <span className="field" style={{ flex: 1 }}><Icon n="perfil" /><input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Ex.: K7P2QX" maxLength={6} aria-label="Código do amigo" autoCapitalize="characters" /></span>
          <button className="btn inline small" type="submit" disabled={code.trim().length < 6}>Adicionar</button>
        </div>
      </form>

      <div className="card stack">
        <b className="h">Desafio ao vivo</b>
        <small className="muted">Crie uma sala, chame seus amigos e quem ganhar leva XP.</small>
        <div className="modes">
          {Object.entries(MODES).map(([id, m]) => (
            <button key={id} type="button" className="choice" onClick={() => onRoom(roomCode(), id, true)}>
              <span><b>{m.name}</b><small>{m.sub}</small></span>
            </button>
          ))}
        </div>
        <form className="row" onSubmit={(e) => { e.preventDefault(); onRoom(join.trim(), null, false) }}>
          <span className="field" style={{ flex: 1 }}><input value={join} onChange={(e) => setJoin(e.target.value.toUpperCase())} placeholder="Código da sala" maxLength={5} aria-label="Código da sala" /></span>
          <button className="btn inline small ghost-dark" type="submit" disabled={join.trim().length < 5}>Entrar</button>
        </form>
      </div>

      {trades.length > 0 && (
        <div className="card stack">
          <b className="h">Trocas pendentes</b>
          {trades.map((t) => t.to_id === me.id
            ? (
              <div key={t.id} className="trade">
                <span><b>{nameOf(t.from_id)}</b> oferece <b>{itemName(t.give)}</b>{t.want ? <> e pede <b>{itemName(t.want)}</b></> : ' de presente'}</span>
                <div className="row">
                  <button className="btn inline small" type="button" onClick={() => step(t, 'accept')} disabled={!!t.want && !inv[t.want]}>Aceitar</button>
                  <button className="btn inline small ghost-dark" type="button" onClick={() => step(t, 'decline')}>Recusar</button>
                </div>
              </div>
            )
            : (
              <div key={t.id} className="trade">
                <span>Você ofereceu <b>{itemName(t.give)}</b> para <b>{nameOf(t.to_id)}</b>{t.want ? <> por <b>{itemName(t.want)}</b></> : ''}</span>
                <button className="btn inline small ghost-dark" type="button" onClick={() => step(t, 'cancel')}>Cancelar</button>
              </div>
            ))}
        </div>
      )}

      <div className="card stack">
        <b className="h">Seus amigos</b>
        {!friends.length && <small className="muted">Ainda ninguém. Mande seu código ou QR para a galera!</small>}
        {friends.map((f) => (
          <div key={f.id} className="stack">
            <div className="friend">
              <span className="avatar sm">{f.name[0]?.toUpperCase()}</span>
              <span className="grow"><b>{f.name}</b><small>{fmt(f.xp)} XP</small></span>
              <button className="btn inline small" type="button" onClick={() => setTrading(trading?.id === f.id ? null : f)}>Trocar</button>
              <button className="icon-btn" type="button" onClick={() => unfriend(f)} aria-label={`Desfazer amizade com ${f.name}`}><Icon n="x" /></button>
            </div>
            {trading?.id === f.id && <TradeForm inv={inv} friend={f} onSent={(give) => { setS((x) => removeItem(x, give)); setTrading(null); setMsg(`Troca enviada para ${f.name}.`); load() }} onError={(e) => setMsg(friendError(e))} />}
          </div>
        ))}
      </div>

      <div className="card stack">
        <b className="h">Ranking do Lezoro'a</b>
        <ol className="rank">
          {top.map((p, i) => (
            <li key={p.id} className={p.id === me.id ? 'me' : ''}><span className="pos">{i + 1}º</span><span className="grow">{p.name}</span><b>{fmt(p.xp)} XP</b></li>
          ))}
        </ol>
      </div>
    </div>
  )
}

function TradeForm({ inv, friend, onSent, onError }) {
  const mine = ITEMS.filter((it) => inv[it.id])
  const [give, setGive] = useState(mine[0]?.id || '')
  const [want, setWant] = useState('')
  const [busy, setBusy] = useState(false)
  if (!mine.length) return <small className="muted">Você ainda não tem itens. Conclua lições para abrir baús!</small>

  async function send() {
    setBusy(true)
    try { await proposeTrade(friend.id, give, want); onSent(give) } catch (e) { onError(e) } finally { setBusy(false) }
  }
  return (
    <div className="trade-form">
      <label className="fl">Você dá
        <select value={give} onChange={(e) => setGive(e.target.value)}>
          {mine.map((it) => <option key={it.id} value={it.id}>{it.name} ({RARITY[it.r][0]}) ×{inv[it.id]}</option>)}
        </select>
      </label>
      <label className="fl">Você pede (opcional)
        <select value={want} onChange={(e) => setWant(e.target.value)}>
          <option value="">Nada, é presente</option>
          {ITEMS.map((it) => <option key={it.id} value={it.id}>{it.name} ({RARITY[it.r][0]})</option>)}
        </select>
      </label>
      <button className="btn small" type="button" onClick={send} disabled={busy || !give}>{busy ? 'Enviando…' : `Enviar para ${friend.name}`}</button>
    </div>
  )
}
