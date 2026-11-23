import { useEffect, useRef, useState } from 'react'
import { DAILY } from './content.js'
import { dailyIndex, dayKey, finishDaily, finishLesson, levelOf, loseLamp, newState } from './game.js'
import { Lesson } from './Lesson.jsx'
import { Auth, NewPassword, Onboarding, Welcome } from './Start.jsx'
import { load, loadRemote, save, saveRemote } from './store.js'
import { disableReminder } from './push.js'
import { sb } from './supabase.js'
import { Badges, Bible, Home, Profile } from './Tabs.jsx'
import { Grao, Nav } from './ui.jsx'

const recovering = () => window.location.hash.includes('type=recovery')

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

  async function enter(user) {
    setUid(user.id)
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
    setS(null); setUid(null); setView('welcome')
  }

  const lvl = s ? levelOf(s.seeds).n : 1

  function done(apply) {
    return (correct, total) => {
      const before = levelOf(s.seeds).n
      const r = apply(correct, total)
      setS(r.state)
      return { earned: r.earned, streak: r.state.streak, lvlUp: levelOf(r.state.seeds).n > before }
    }
  }

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
      return <Onboarding name={draft.name} onBack={() => (sb ? logout() : setView('auth'))} onDone={(prefs) => { setS(newState(draft, prefs, today)); setView('home') }} />
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
            : (c, t) => finishLesson(s, lesson.id, c, t, today))}
          onExit={() => setView('home')}
        />
      )
    }
    default: {
      const Tab = { home: Home, bible: Bible, badges: Badges, profile: Profile }[view] || Home
      return (
        <div className="shell">
          <main className="shell-main">
            <Tab s={s} today={today} onDaily={() => setView('daily')} onLesson={(l) => { setLesson(l); setView('lesson') }} onLogout={logout} />
          </main>
          <Nav tab={view} go={setView} />
        </div>
      )
    }
  }
}
