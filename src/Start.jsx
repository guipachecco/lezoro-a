import { useState } from 'react'
import { sb } from './supabase.js'
import { Bar, Grao, Icon, Wordmark } from './ui.jsx'
import { PLACEMENT } from './content.js'
import { placement, shuffle, TRAILS } from './game.js'

/** Tela aberta pelo link de "Esqueci minha senha". */
export function NewPassword({ onDone }) {
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(e) {
    e.preventDefault()
    if (pass.length < MIN_PASS) return setErr(`A senha precisa ter pelo menos ${MIN_PASS} caracteres.`)
    setBusy(true)
    const { data, error } = await sb.auth.updateUser({ password: pass })
    setBusy(false)
    if (error) return setErr(authError(error))
    onDone(data.user)
  }
  return (
    <div className="screen auth">
      <div className="auth-peek"><Grao st="pensando" style={{ width: 110 }} /></div>
      <form className="card auth-card" onSubmit={submit} noValidate>
        <h2>Crie uma nova senha</h2>
        <label className="fl">Nova senha
          <span className="field"><Icon n="cadeado" /><input id="new-password" type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder={`Mínimo de ${MIN_PASS} caracteres`} autoComplete="new-password" /></span>
        </label>
        {err && <p className="err" role="alert">{err}</p>}
        <button className="btn" type="submit" disabled={busy}>{busy ? 'Aguarde…' : 'Salvar e entrar'}</button>
      </form>
    </div>
  )
}

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
const MIN_PASS = 8

// Mensagens do Supabase traduzidas para o usuário.
function authError(err) {
  const m = (err?.message || '').toLowerCase()
  if (m.includes('invalid login')) return 'E-mail ou senha incorretos.'
  if (m.includes('already registered')) return 'Este e-mail já tem conta. Use a aba Entrar.'
  if (m.includes('not confirmed')) return 'Confirme seu e-mail pelo link que enviamos e depois entre.'
  if (m.includes('rate limit') || m.includes('security purposes')) return 'Muitas tentativas seguidas. Espere um minuto e tente de novo.'
  if (m.includes('fetch')) return 'Sem conexão. Verifique a internet e tente de novo.'
  return 'Não deu certo agora. Tente de novo em instantes.'
}

/**
 * Cadastro e login.
 * Com Supabase: senha de verdade; onAuthed(user) recebe o usuário do Supabase.
 * Sem Supabase (modo local): onCreate(user) e onEnter() usam só este aparelho.
 */
export function Auth({ mode: initial, saved, onCreate, onEnter, onAuthed, onBack }) {
  const [mode, setMode] = useState(initial)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [show, setShow] = useState(false)
  const [err, setErr] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)

  const switchTo = (m) => { setMode(m); setErr(''); setInfo('') }

  async function submit(e) {
    e.preventDefault()
    setErr(''); setInfo('')
    const mail = email.trim().toLowerCase()
    if (mode === 'create' && name.trim().length < 2) return setErr('Digite seu nome para o Grão saber como te chamar.')
    if (!emailOk(mail)) return setErr('Digite um e-mail válido, como ana@exemplo.com.')

    if (!sb) {
      if (mode === 'create') return onCreate({ name: name.trim(), email: mail })
      if (saved?.user.email === mail) return onEnter()
      return setErr('Não encontramos essa conta neste aparelho. Crie uma conta para começar.')
    }

    if (pass.length < MIN_PASS) return setErr(`A senha precisa ter pelo menos ${MIN_PASS} caracteres.`)
    setBusy(true)
    try {
      if (mode === 'create') {
        const { data, error } = await sb.auth.signUp({
          email: mail, password: pass,
          options: { data: { name: name.trim() }, emailRedirectTo: window.location.origin },
        })
        if (error) throw error
        if (data.user?.identities?.length === 0) throw new Error('already registered')
        if (data.session) return onAuthed(data.user)
        setPass('')
        switchTo('enter')
        setInfo(`Enviamos um link para ${mail}. Confirme o e-mail e depois entre com sua senha.`)
      } else {
        const { data, error } = await sb.auth.signInWithPassword({ email: mail, password: pass })
        if (error) throw error
        onAuthed(data.user)
      }
    } catch (error) {
      setErr(authError(error))
    } finally {
      setBusy(false)
    }
  }

  async function forgot() {
    setErr(''); setInfo('')
    const mail = email.trim().toLowerCase()
    if (!emailOk(mail)) return setErr('Digite seu e-mail acima e toque de novo em "Esqueci minha senha".')
    setBusy(true)
    const { error } = await sb.auth.resetPasswordForEmail(mail, { redirectTo: window.location.origin })
    setBusy(false)
    if (error) setErr(authError(error))
    else setInfo(`Se ${mail} tiver conta, você vai receber um link para criar uma nova senha.`)
  }

  return (
    <div className="screen auth">
      <button className="back" type="button" onClick={onBack} aria-label="Voltar"><Icon n="seta" /></button>
      <div className="auth-peek"><Grao st={err ? 'encoraja' : 'feliz'} style={{ width: 110 }} /></div>
      <form className="card auth-card" onSubmit={submit} noValidate>
        <div className="tabs" role="tablist">
          <button type="button" role="tab" aria-selected={mode === 'enter'} className={mode === 'enter' ? 'on' : ''} onClick={() => switchTo('enter')}>Entrar</button>
          <button type="button" role="tab" aria-selected={mode === 'create'} className={mode === 'create' ? 'on' : ''} onClick={() => switchTo('create')}>Criar conta</button>
        </div>
        {mode === 'create' && (
          <label className="fl">Nome
            <span className="field"><Icon n="perfil" /><input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Como quer ser chamado" autoComplete="given-name" /></span>
          </label>
        )}
        <label className="fl">E-mail
          <span className="field"><Icon n="email" /><input id="email" type="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ana@exemplo.com" autoComplete="email" /></span>
        </label>
        {sb && (
          <label className="fl">Senha
            <span className="field">
              <Icon n="cadeado" />
              <input id="password" type={show ? 'text' : 'password'} value={pass} onChange={(e) => setPass(e.target.value)}
                placeholder={mode === 'create' ? `Mínimo de ${MIN_PASS} caracteres` : 'Sua senha'} autoComplete={mode === 'create' ? 'new-password' : 'current-password'} />
              <button type="button" className="eye" onClick={() => setShow(!show)} aria-label={show ? 'Esconder senha' : 'Mostrar senha'}><Icon n="olho" /></button>
            </span>
          </label>
        )}
        {sb && mode === 'enter' && <button type="button" className="link" onClick={forgot} disabled={busy}>Esqueci minha senha</button>}
        {err && <p className="err" role="alert">{err}</p>}
        {info && <p className="info" role="status">{info}</p>}
        <button className="btn" type="submit" disabled={busy}>{busy ? 'Aguarde…' : mode === 'create' ? 'Criar conta' : 'Entrar'}</button>
        {!sb && <p className="hint">Modo local: seu progresso fica salvo só neste aparelho.</p>}
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

/** Quiz de nivelamento: cada pergunta tem uma chance só, sem voltar. onDone(perguntas por lição). */
export function Placement({ onDone }) {
  const [i, setI] = useState(0)
  const [score, setScore] = useState(0)
  const [opts] = useState(() => PLACEMENT.map((p) => shuffle(p.a)))
  const trail = placement(score)

  if (i === PLACEMENT.length) {
    return (
      <div className="screen result">
        <Grao st="celebra" lvl={1} style={{ width: 150 }} />
        <h2>Sua trilha: {TRAILS[trail].name}</h2>
        <p className="muted">Você acertou {score} de {PLACEMENT.length}. {TRAILS[trail].desc}. Quer mudar? Só com um restart do baú!</p>
        <button className="btn" type="button" onClick={() => onDone(trail)}>Começar minha trilha</button>
      </div>
    )
  }
  const p = PLACEMENT[i]
  return (
    <div className="screen onboard">
      <div className="row">
        <Bar pct={(i / PLACEMENT.length) * 100} />
        <span className="step">{i + 1}/{PLACEMENT.length}</span>
      </div>
      <div className="ask">
        <Grao st="pensando" lvl={1} style={{ width: 84, flex: 'none' }} />
        <div className="bubble">{i === 0 ? 'Quiz rápido para eu saber o quanto aprofundar sua trilha. Uma chance só! ' : ''}{p.q}</div>
      </div>
      <div className="stack">
        {opts[i].map((o) => (
          <button key={o} type="button" className="choice" onClick={() => { if (o === p.a[0]) setScore(score + 1); setI(i + 1) }}>
            <span><b>{o}</b></span>
          </button>
        ))}
      </div>
    </div>
  )
}

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
