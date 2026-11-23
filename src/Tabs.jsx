import { useEffect } from 'react'
import { addDays, badges, currentLesson, dailyIndex, DEPTHS, ITEMS, levelOf, LEVELS, RARITY } from './game.js'
import { DAILY, UNITS } from './content.js'
import { InstallBanner } from './Install.jsx'
import { Reminder } from './Reminder.jsx'
import { sb } from './supabase.js'
import { Bar, Counters, Grao, Icon, Plant, fmt } from './ui.jsx'

const ALL = UNITS.flatMap((u) => u.lessons)
const UNIT_BG = ['var(--blue)', 'var(--violet)', 'var(--navy)']
const OFFSETS = [0, -48, -16, 36, 8, -30]
const WEEK = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

export function Home({ s, today, onLesson, onDaily }) {
  const lv = levelOf(s.seeds)
  const cur = currentLesson(ALL, s.done)
  useEffect(() => { requestAnimationFrame(() => document.querySelector('.node.cur')?.scrollIntoView({ block: 'center' })) }, [])
  const dailyDone = s.dailyDone === today
  const daily = DAILY[dailyIndex(today, DAILY.length)]
  const thirsty = s.streak > 0 && s.lastDay !== today

  return (
    <div className="screen home">
      <Counters s={s} />
      <InstallBanner />
      {thirsty && (
        <div className="toast"><Grao st="dormindo" lvl={lv.n} style={{ width: 52, flex: 'none' }} /><span><b>Estou com sede.</b> Faça uma lição hoje para manter {s.streak} {s.streak === 1 ? 'dia regado' : 'dias regados'}.</span></div>
      )}
      <div className="lvl">
        <Grao st="orgulhoso" lvl={lv.n} gear={s.gear} className="lvl-m" />
        <div className="lvl-body">
          <b>Nível {lv.n} · {lv.name}</b>
          {lv.next
            ? <><Bar pct={((s.seeds - lv.min) / (lv.next.min - lv.min)) * 100} h={8} /><small>{fmt(s.seeds)} / {fmt(lv.next.min)} sementes até {lv.next.name}</small></>
            : <small>Sua árvore já dá frutos. Gálatas 5:22</small>}
        </div>
      </div>
      <div className="daily">
        <span className="lbl" style={{ color: 'var(--cream)' }}><Icon n="luz" /> Desafio do dia</span>
        <b>{dailyDone ? 'Feito! Volte amanhã para outro versículo.' : `Complete ${daily.ref}`}</b>
        <div className="row between">
          <span className="ct" style={{ color: 'var(--lime)' }}>+20 sementes</span>
          {!dailyDone && <button className="btn inline small" type="button" onClick={onDaily}>Começar</button>}
        </div>
      </div>
      {UNITS.map((unit, ui) => {
        const start = UNITS.slice(0, ui).reduce((n, u) => n + u.lessons.length, 0)
        return (
          <section key={unit.id} className="stack">
            <div className="unit" style={{ background: UNIT_BG[ui % UNIT_BG.length] }}><Icon n="biblia" /><div><b>Unidade {ui + 1} · {unit.title}</b><small>{unit.subtitle}</small></div></div>
            <div className="trail">
              {unit.lessons.map((l, k) => {
                const i = start + k
                const state = s.done[l.id] ? 'done' : i === cur ? 'cur' : 'lock'
                return (
                  <div key={l.id} className="trail-row" style={{ '--x': `${OFFSETS[k % OFFSETS.length]}px` }}>
                    <button type="button" className={`node ${state}`} disabled={state === 'lock'} onClick={() => onLesson(l)} aria-label={`${l.title}${state === 'lock' ? ' (bloqueada)' : ''}`}>
                      <Icon n={state === 'done' ? 'check' : state === 'lock' ? 'cadeado' : 'trilha'} />
                    </button>
                    <span className="node-label">{l.title}</span>
                    {state === 'cur' && <Grao st="feliz" lvl={lv.n} gear={s.gear} className="trail-m hop" />}
                  </div>
                )
              })}
            </div>
          </section>
        )
      })}
      {cur === ALL.length && <p className="muted center">Você concluiu a trilha toda! Novas unidades chegam em breve.</p>}
    </div>
  )
}

export function Bible({ s }) {
  return (
    <div className="screen center-col">
      <Grao st="lendo" lvl={levelOf(s.seeds).n} style={{ width: 150 }} />
      <h2>Leitura da Bíblia</h2>
      <p className="muted">Em breve você vai ler os capítulos de cada lição aqui, com marcações e versículos favoritos.</p>
      {UNITS.map((unit) => (
        <div key={unit.id} className="stack" style={{ width: '100%', textAlign: 'left' }}>
          <span className="lbl">{unit.title}</span>
          {unit.lessons.map((l) => (
            <div key={l.id} className="choice static">
              <Icon n="biblia" />
              <span><b>{l.title}</b><small>{l.qs.slice(0, 2).map((q) => q.ref).join(' · ')}</small></span>
              {s.done[l.id] && <Icon n="check" style={{ color: 'var(--lime-deep)', marginLeft: 'auto' }} />}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

const lastWeek = (today) => Array.from({ length: 7 }, (_, k) => addDays(today, k - 6))
const dow = (key) => { const [y, m, d] = key.split('-').map(Number); return new Date(y, m - 1, d).getDay() }

export function Badges({ s, today }) {
  const list = badges(s, UNITS)
  const lv = levelOf(s.seeds)
  return (
    <div className="screen">
      <div className="row between"><h1 className="title">Conquistas</h1><small className="muted">{list.filter((b) => b.on).length} de {list.length} selos</small></div>
      <div className="streak">
        <div className="row">
          <Grao st={s.streak ? 'sequencia' : 'dormindo'} lvl={lv.n} style={{ width: 62, flex: 'none' }} />
          <div><b>{s.streak} {s.streak === 1 ? 'dia regado' : 'dias regados'}</b><small>{s.best > s.streak ? `Seu recorde é ${s.best}. Faltam ${s.best - s.streak}!` : s.streak ? 'Este é o seu recorde!' : 'Faça uma lição para começar.'}</small></div>
        </div>
        <div className="week">
          {lastWeek(today).map((d) => {
            const on = s.days.includes(d)
            return <span key={d}><Icon n="gota" f={on} style={{ color: on ? 'var(--lime)' : 'rgba(255,255,255,.45)' }} />{WEEK[dow(d)]}</span>
          })}
        </div>
      </div>
      <div className="badges">
        {list.map((b) => (
          <figure key={b.id} className={b.on ? '' : 'off'}>
            <div className="hex"><span className={`hx-${b.id}`}><Icon n={b.on ? b.icon : 'cadeado'} /></span></div>
            {b.title}
            {!b.on && <small>{b.progress}</small>}
          </figure>
        ))}
      </div>
    </div>
  )
}

const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

export function Profile({ s, today, onLogout, onEquip, onRestart }) {
  const lv = levelOf(s.seeds)
  const done = Object.values(s.done)
  const total = done.reduce((a, d) => a + d.total, 0)
  const hits = done.reduce((a, d) => a + d.correct, 0)
  const week = lastWeek(today).map((d) => [d, (s.log || {})[d] || 0])
  const max = Math.max(60, ...week.map(([, v]) => v))
  const [y, m] = (s.since || today).split('-')
  const initials = s.user.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="screen profile">
      <div className="profile-head">
        <span className="avatar">{initials}</span>
        <div>
          <b>{s.user.name}</b>
          <small>Cultivando desde {MONTHS[+m - 1]} {y}</small>
          <span className="chip">Nível {lv.n} · {lv.name}{s.prefs?.depth ? ` · Trilha ${DEPTHS[s.prefs.depth]}` : ''}</span>
        </div>
      </div>
      <div className="card">
        <div className="row between"><b className="h">Seu personagem</b><small className="muted">Baú a cada lição concluída</small></div>
        <div className="row" style={{ alignItems: 'flex-start' }}>
          <Grao st="feliz" lvl={lv.n} gear={s.gear} style={{ width: 140, flex: "none" }} />
          <div className="inv">
            {ITEMS.filter((it) => (s.inv || {})[it.id]).map((it) => {
              const [rname, color] = RARITY[it.r], worn = (s.gear || {})[it.slot] === it.id, low = lv.n < it.lvl
              const n = s.inv[it.id]
              return it.id === 'restart'
                ? <button key={it.id} type="button" className="item" style={{ '--rc': color }}
                    onClick={() => window.confirm('Usar o restart? Seu Grão volta a ser semente: sementes, lições e roupas zeram, e você refaz o quiz. Os itens ficam.') && onRestart()}>
                    <b>{it.name} ×{n}</b><small>{rname} · toque para usar</small>
                  </button>
                : <button key={it.id} type="button" className={`item ${worn ? 'worn' : ''}`} style={{ '--rc': color }} disabled={low} onClick={() => onEquip(it.id)}>
                    <b>{it.name}{n > 1 ? ` ×${n}` : ''}</b><small>{rname} · {low ? `nível ${it.lvl}` : worn ? 'vestido' : 'vestir'}</small>
                  </button>
            })}
            {!Object.keys(s.inv || {}).some((k) => s.inv[k]) && <small className="muted">Conclua uma lição para abrir seu primeiro baú.</small>}
          </div>
        </div>
      </div>
      <div className="stats">
        <div className="stat"><Icon n="gota" f style={{ color: 'var(--blue)' }} /><div><b>{s.days.length}</b><small>dias regados</small></div></div>
        <div className="stat"><Icon n="semente" f style={{ color: 'var(--lime-deep)' }} /><div><b>{fmt(s.seeds)}</b><small>sementes</small></div></div>
        <div className="stat"><Icon n="check" style={{ color: 'var(--violet)' }} /><div><b>{total ? Math.round((hits / total) * 100) : 0}%</b><small>de acertos</small></div></div>
        <div className="stat"><Icon n="biblia" style={{ color: 'var(--navy)' }} /><div><b>{done.length}</b><small>lições concluídas</small></div></div>
      </div>
      <div className="card">
        <div className="row between"><b className="h">Esta semana</b><small className="muted">{fmt(week.reduce((a, [, v]) => a + v, 0))} sementes</small></div>
        <div className="chart">
          {week.map(([d, v]) => (
            <div key={d} className={d === today ? 'hi' : ''} title={`${v} sementes`}>
              <i style={{ height: `${(v / max) * 100}%` }} />{WEEK[dow(d)]}
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <b className="h">Sua árvore</b>
        <div className="tree">
          {LEVELS.map((l) => (
            <div key={l.n} className={l.n === lv.n ? 'on' : l.n > lv.n ? 'later' : ''}>
              <Plant n={l.n} /><span>{l.name}</span>
            </div>
          ))}
        </div>
      </div>
      {sb && <Reminder suggested={s.prefs?.reminder} />}
      {sb
        ? <button type="button" className="logout" onClick={onLogout}><Icon n="sair" />Sair da conta</button>
        : <p className="hint muted center">Modo local: seu progresso fica salvo só neste aparelho.</p>}
    </div>
  )
}
