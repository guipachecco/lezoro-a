import { useState } from 'react'
import { Bar, Grao, Icon, Wordmark } from './ui.jsx'

export function Welcome({ onStart, onLogin }) {
  return (
    <div className="screen welcome">
      <div className="welcome-hero">
        <Grao st="feliz" className="hop sway blink" style={{ width: 170 }} />
        <Wordmark size={52} color="var(--cream)" />
        <p className="tagline">Cultive sua fé, um dia de cada vez.</p>
      </div>
      <div className="stack">
        <button className="btn" type="button" onClick={onStart}>Começar agora</button>
        <button className="btn ghost" type="button" onClick={onLogin}>Já tenho uma conta</button>
      </div>
    </div>
  )
}

const emailOk = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

export function Auth({ mode: initial, saved, onCreate, onEnter, onBack }) {
  const [mode, setMode] = useState(initial)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [err, setErr] = useState('')

  function submit(e) {
    e.preventDefault()
    const mail = email.trim().toLowerCase()
    if (!emailOk(mail)) return setErr('Digite um e-mail válido, como ana@exemplo.com.')
    if (mode === 'create') {
      if (name.trim().length < 2) return setErr('Digite seu nome para o Grão saber como te chamar.')
      return onCreate({ name: name.trim(), email: mail })
    }
    if (saved?.user.email === mail) return onEnter()
    setErr('Não encontramos essa conta neste aparelho. Crie uma conta para começar.')
  }

  return (
    <div className="screen auth">
      <button className="back" type="button" onClick={onBack} aria-label="Voltar"><Icon n="seta" /></button>
      <div className="auth-peek"><Grao st={err ? 'encoraja' : 'feliz'} style={{ width: 110 }} /></div>
      <form className="card auth-card" onSubmit={submit} noValidate>
        <div className="tabs" role="tablist">
          <button type="button" role="tab" aria-selected={mode === 'enter'} className={mode === 'enter' ? 'on' : ''} onClick={() => { setMode('enter'); setErr('') }}>Entrar</button>
          <button type="button" role="tab" aria-selected={mode === 'create'} className={mode === 'create' ? 'on' : ''} onClick={() => { setMode('create'); setErr('') }}>Criar conta</button>
        </div>
        {mode === 'create' && (
          <label className="fl">Nome
            <span className="field"><Icon n="perfil" /><input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Como quer ser chamado" autoComplete="given-name" /></span>
          </label>
        )}
        <label className="fl">E-mail
          <span className="field"><Icon n="email" /><input id="email" type="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ana@exemplo.com" autoComplete="email" /></span>
        </label>
        {err && <p className="err" role="alert">{err}</p>}
        <button className="btn" type="submit">{mode === 'create' ? 'Criar conta' : 'Entrar'}</button>
        <p className="hint">Versão de teste: seu progresso fica salvo neste aparelho. O login com senha chega na próxima versão.</p>
      </form>
    </div>
  )
}

const STEPS = [
  {
    key: 'minutes', ask: 'Quanto tempo você quer cultivar por dia?', st: 'pensando',
    opts: [[5, 'semente', 'Semear', 'Leve, para começar', '5 min'], [10, 'gota', 'Regar', 'Constante', '10 min'], [15, 'trilha', 'Cultivar', 'Firme', '15 min'], [20, 'luz', 'Colher', 'Intenso', '20 min']],
  },
  {
    key: 'level', ask: 'Como está sua caminhada com a Bíblia?', st: 'lendo',
    opts: [['novo', 'semente', 'Estou começando', 'Quero conhecer as histórias'], ['as-vezes', 'biblia', 'Leio às vezes', 'Conheço o básico'], ['sempre', 'trilha', 'Leio sempre', 'Quero me aprofundar'], ['ensino', 'luz', 'Ensino outras pessoas', 'Quero revisar e treinar']],
  },
  {
    key: 'reminder', ask: 'Quando eu devo te lembrar de me regar?', st: 'dormindo',
    opts: [['07:00', 'luz', 'De manhã', 'Às 7h'], ['12:00', 'gota', 'No almoço', 'Às 12h'], ['20:00', 'lamparina', 'À noite', 'Às 20h'], ['', 'x', 'Não precisa', 'Eu me lembro sozinho']],
  },
]

export function Onboarding({ name, onDone, onBack }) {
  const [i, setI] = useState(0)
  const [prefs, setPrefs] = useState({ minutes: 10 })
  const step = STEPS[i]
  const val = prefs[step.key]

  return (
    <div className="screen onboard">
      <div className="row">
        <button className="back inline" type="button" onClick={() => (i ? setI(i - 1) : onBack())} aria-label="Voltar"><Icon n="seta" /></button>
        <Bar pct={((i + 1) / STEPS.length) * 100} />
        <span className="step">{i + 1}/{STEPS.length}</span>
      </div>
      <div className="ask">
        <Grao st={step.st} lvl={1} style={{ width: 84, flex: 'none' }} />
        <div className="bubble">{i === 0 ? `Oi, ${name}! ` : ''}{step.ask}</div>
      </div>
      <div className="stack" role="radiogroup" aria-label={step.ask}>
        {step.opts.map(([v, ic, title, sub, tag]) => (
          <button key={title} type="button" role="radio" aria-checked={val === v} className={`choice ${val === v ? 'sel' : ''}`} onClick={() => setPrefs({ ...prefs, [step.key]: v })}>
            <Icon n={ic} f={ic === 'gota'} />
            <span><b>{title}</b><small>{sub}</small></span>
            {tag && <span className="t">{tag}</span>}
          </button>
        ))}
      </div>
      <button className="btn push" type="button" disabled={val === undefined} onClick={() => (i < STEPS.length - 1 ? setI(i + 1) : onDone(prefs))}>
        {i < STEPS.length - 1 ? 'Continuar' : 'Plantar meu grão'}
      </button>
    </div>
  )
}
