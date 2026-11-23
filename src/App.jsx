import { useEffect, useState } from 'react'
import { DAILY } from './content.js'
import { dailyIndex, dayKey, finishDaily, finishLesson, levelOf, loseLamp, newState } from './game.js'
import { Lesson } from './Lesson.jsx'
import { Badges, Bible, Home, Profile } from './Tabs.jsx'
import { Auth, Onboarding, Welcome } from './Start.jsx'
import { load, save } from './store.js'
import { Nav } from './ui.jsx'

export default function App() {
  const [s, setS] = useState(load)
  const [view, setView] = useState(() => (s ? 'home' : 'welcome'))
  const [draft, setDraft] = useState(null) // usuário entre o cadastro e a personalização
  const [authMode, setAuthMode] = useState('create')
  const [lesson, setLesson] = useState(null)
  // shortcut: "hoje" é calculado ao abrir o app; quem deixar aberto de um dia para o outro precisa recarregar.
  const [today] = useState(dayKey)

  useEffect(() => { save(s) }, [s])
  useEffect(() => { window.scrollTo(0, 0) }, [view])

  const saved = load()
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
    case 'welcome':
      return <Welcome onStart={() => { setAuthMode('create'); setView('auth') }} onLogin={() => { setAuthMode('enter'); setView('auth') }} />
    case 'auth':
      return (
        <Auth
          mode={authMode} saved={saved} onBack={() => setView('welcome')}
          onCreate={(user) => { setDraft(user); setView('onboard') }}
          onEnter={() => { setS(saved); setView('home') }}
        />
      )
    case 'onboard':
      return <Onboarding name={draft.name} onBack={() => setView('auth')} onDone={(prefs) => { setS(newState(draft, prefs, today)); setView('home') }} />
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
            <Tab s={s} today={today} onDaily={() => setView('daily')} onLesson={(l) => { setLesson(l); setView('lesson') }} />
          </main>
          <Nav tab={view} go={setView} />
        </div>
      )
    }
  }
}
