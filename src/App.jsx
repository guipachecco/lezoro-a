import { useEffect, useRef, useState } from 'react'
import { DAILY } from './content.js'
import { addItem, dailyIndex, dayKey, equip, finishDaily, finishLesson, levelOf, loseLamp, MODES, newState, restart, rollChest } from './game.js'
import { Friends } from './Friends.jsx'
import { Room } from './Room.jsx'
import { addFriend, ensureProfile, inbox, listFriends } from './social.js'
import { Lesson } from './Lesson.jsx'
import { Auth, NewPassword, Onboarding, Placement, Welcome } from './Start.jsx'
import { load, loadRemote, save, saveRemote } from './store.js'
import { disableReminder } from './push.js'
import { sb } from './supabase.js'
import { Badges, Bible, Home, Profile } from './Tabs.jsx'
import { Grao, Icon, Nav } from './ui.jsx'

const recovering = () => window.location.hash.includes('type=recovery')

// Link do QR (?amigo=CÓDIGO): guarda o código até a pessoa entrar ou terminar o cadastro.
const AMIGO = 'lezoroa:amigo'
{
  const code = new URLSearchParams(window.location.search).get('amigo')
  if (code) {
    try { localStorage.setItem(AMIGO, code) } catch { /* modo privado: o convite se perde, a pessoa digita o código */ }
    window.history.replaceState(null, '', window.location.pathname)
  }
}

export default function App() {
  const [s, setS] = useState(() => (sb ? null : load()))
  const [uid, setUid] = useState(null)
  const [view, setView] = useState(() => (sb ? (recovering() ? 'newpass' : 'loading') : load() ? 'home' : 'welcome'))
  const [draft, setDraft] = useState(null) // usuário entre o cadastro e a personalização
  const [authMode, setAuthMode] = useState('create')
  const [lesson, setLesson] = useState(null)
  // shortcut: "hoje" é calculado ao abrir o app; quem deixar aberto de um dia para o outro precisa recarregar.
  const [today] = useState(dayKey)
  const inRecovery = useRef(recovering())
  const [me, setMe] = useState(null) // perfil público: { id, name, code, xp }
  const [invite, setInvite] = useState(null) // convite para sala recebido agora
  const [room, setRoom] = useState(null) // { code, mode, host, friends }
  const [note, setNote] = useState('')

  // Perfil público para amigos e ranking. Se falhar (sem internet ou social.sql não rodado), o resto do app segue.
  async function connect(user) {
    try {
      const p = await ensureProfile(user.user_metadata?.name || user.email.split('@')[0])
      setMe(p)
      let code = null
      try { code = localStorage.getItem(AMIGO) } catch { /* sem armazenamento */ }
      if (code) {
        try { localStorage.removeItem(AMIGO) } catch { /* idem */ }
        if (code !== p.code) {
          try { const f = await addFriend(code); setNote(`${f.name} agora é seu amigo!`) } catch { setNote('Não deu para adicionar o amigo do convite. Use o código na aba Amigos.') }
        }
      }
    } catch (e) {
      console.warn('Perfil de amigos indisponível:', e.message)
      setMe(false)
    }
  }

  useEffect(() => {
    if (!me) return
    const c = inbox(me.id).on('broadcast', { event: 'convite' }, ({ payload }) => setInvite(payload)).subscribe()
    return () => { sb.removeChannel(c) }
  }, [me?.id])

  async function openRoom(code, mode, host) {
    setInvite(null)
    let friends = []
    try { friends = await listFriends(me.id) } catch { /* sem a lista, só não dá para chamar ninguém */ }
    setRoom({ code, mode, host, friends })
    setView('room')
  }

  async function enter(user) {
    setUid(user.id)
    connect(user)
    let remote
    try {
      remote = await loadRemote(user.id)
    } catch {
      remote = load() // sem internet: usa a cópia deste aparelho
    }
    if (inRecovery.current) { if (remote) setS(remote); return } // o link de nova senha chegou no meio do login
    if (remote) { setS(remote); setView('home'); return }
    setDraft({ name: user.user_metadata?.name || user.email.split('@')[0], email: user.email })
    setView('onboard')
  }

  useEffect(() => {
    if (!sb) return
    if (!recovering()) {
      sb.auth.getSession().then(({ data }) => (data.session ? enter(data.session.user) : setView('welcome')))
    }
    const { data } = sb.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') { inRecovery.current = true; setView('newpass') }
    })
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!s) return
    save(s)
    if (uid) saveRemote(uid, s)
  }, [s, uid])
  useEffect(() => { window.scrollTo(0, 0) }, [view])

  async function logout() {
    // sem isso, o próximo usuário deste aparelho receberia os lembretes de quem saiu
    try { await disableReminder() } catch { /* sem internet: a função apaga a inscrição quando o envio falhar */ }
    if (sb) await sb.auth.signOut()
    save(null)
    setS(null); setUid(null); setMe(null); setView('welcome')
  }

  const lvl = s ? levelOf(s.seeds).n : 1

  function done(apply) {
    return (correct, total) => {
      const before = levelOf(s.seeds).n
      const r = apply(correct, total)
      setS(r.state)
      return { earned: r.earned, streak: r.state.streak, lvlUp: levelOf(r.state.seeds).n > before, item: r.item }
    }
  }

  // Quiz de profundidade (uma chance). s existe em conta antiga ou restart; senão é um cadastro novo.
  const quiz = (
    <Placement onDone={(depth) => {
      if (s) setS({ ...s, prefs: { ...s.prefs, depth } })
      else { const { prefs, ...user } = draft; setS(newState(user, { ...prefs, depth }, today)) }
      setView('home')
    }} />
  )

  switch (view) {
    case 'loading':
      return <div className="splash"><Grao st="dormindo" style={{ width: 120 }} /></div>
    case 'newpass':
      return <NewPassword onDone={(user) => { window.history.replaceState(null, '', '/'); inRecovery.current = false; enter(user) }} />
    case 'welcome':
      return <Welcome onStart={() => { setAuthMode('create'); setView('auth') }} onLogin={() => { setAuthMode('enter'); setView('auth') }} />
    case 'auth': {
      const saved = sb ? null : load()
      return (
        <Auth
          mode={authMode} saved={saved} onBack={() => setView('welcome')}
          onCreate={(user) => { setDraft(user); setView('onboard') }}
          onEnter={() => { setS(saved); setView('home') }}
          onAuthed={enter}
        />
      )
    }
    case 'onboard':
      return <Onboarding name={draft.name} onBack={() => (sb ? logout() : setView('auth'))} onDone={(prefs) => { setDraft({ ...draft, prefs }); setView('quiz') }} />
    case 'quiz':
      return quiz
    case 'lesson':
    case 'daily': {
      const isDaily = view === 'daily'
      return (
        <Lesson
          key={isDaily ? 'daily' : lesson.id}
          mode={isDaily ? 'daily' : 'lesson'}
          title={isDaily ? 'Desafio do dia' : lesson.title}
          qs={isDaily ? [DAILY[dailyIndex(today, DAILY.length)]] : lesson.qs}
          lamps={s.lamps} lvl={lvl}
          onWrong={() => setS((x) => loseLamp(x))}
          onFinish={done(isDaily
            ? (c) => { const st = finishDaily(s, c > 0, today); return { state: st, earned: st.seeds - s.seeds } }
            : (c, t) => { const r = finishLesson(s, lesson.id, c, t, today), item = rollChest(); return { ...r, state: addItem(r.state, item.id), item } })}
          onExit={() => setView('home')}
        />
      )
    }
    case 'room':
      return (
        <Room {...room} me={me} lvl={lvl} gear={s.gear}
          onXp={(xp) => setMe((m) => ({ ...m, xp }))}
          onExit={() => { setRoom(null); setView('friends') }} />
      )
    default: {
      if (!s.prefs?.depth) return quiz // conta antiga ou depois de um restart: faz o quiz uma vez
      const Tab ={ home: Home, bible: Bible, badges: Badges, profile: Profile, friends: Friends }[view] || Home
      return (
        <div className="shell">
          <main className="shell-main">
            {note && <p className="info" role="status" onClick={() => setNote('')}>{note}</p>}
            {invite && (
              <div className="toast invite" role="alert">
                <Grao st="surpreso" lvl={lvl} style={{ width: 52, flex: 'none' }} />
                <span className="grow"><b>{invite.from}</b> te chamou para {MODES[invite.mode]?.name || 'um desafio'}!</span>
                <button className="btn inline small" type="button" onClick={() => openRoom(invite.room, invite.mode, false)}>Entrar</button>
                <button className="icon-btn" type="button" onClick={() => setInvite(null)} aria-label="Recusar convite"><Icon n="x" /></button>
              </div>
            )}
            <Tab s={s} today={today} onDaily={() => setView('daily')} onLogout={logout} me={me} setS={setS} onRoom={openRoom}
              onLesson={(l) => { setLesson({ ...l, qs: l.qs.slice(0, s.prefs?.depth || 5) }); setView('lesson') }}
              onEquip={(id) => setS(equip(s, id))}
              onRestart={() => { setS(restart(s)); setView('quiz') }} />
          </main>
          <Nav tab={view} go={setView} />
        </div>
      )
    }
  }
}
