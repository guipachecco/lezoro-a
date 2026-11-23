import { grao, icon, leafMark, plant, sym } from './art.js'

export const Art = ({ html, className = '', style }) => (
  <span className={className} style={style} dangerouslySetInnerHTML={{ __html: html }} />
)
export const Grao = ({ st, lvl = 2, gear, className = '', style }) => <Art html={grao(st, lvl, gear)} className={`grao ${className}`} style={style} />
export const Icon = ({ n, f, className = '', style }) => <Art html={icon(n, f)} className={`ic ${className}`} style={style} />
export const Plant = ({ n, className = '' }) => <Art html={plant(n)} className={`plant ${className}`} />
export const Symbol = ({ size = 32 }) => <Art html={sym()} className="sym" style={{ width: size, height: size }} />

export const Wordmark = ({ size = 40, color = 'var(--navy)', leaf }) => (
  <span className="wm" style={{ fontSize: size, color }} aria-label="Lezoro'a">
    lezoro<Art className="ap" html={leafMark(leaf)} />a
  </span>
)

export const fmt = (n) => n.toLocaleString('pt-BR')

export function Counters({ s }) {
  return (
    <div className="counters">
      <Symbol size={30} />
      <span className="ct" style={{ color: 'var(--blue)' }} title="Dias regados"><Icon n="gota" f />{s.streak}</span>
      <span className="ct" style={{ color: 'var(--lime-deep)' }} title="Sementes"><Icon n="semente" f />{fmt(s.seeds)}</span>
      <span className="ct" style={{ color: 'var(--violet)' }} title="Lamparinas"><Icon n="lamparina" f />{s.lamps}</span>
    </div>
  )
}

const TABS = [['home', 'trilha', 'Trilha'], ['bible', 'biblia', 'Bíblia'], ['friends', 'amigos', 'Amigos'], ['badges', 'medalha', 'Conquistas'], ['profile', 'perfil', 'Perfil']]
export function Nav({ tab, go }) {
  return (
    <nav className="nav">
      {TABS.map(([id, ic, label]) => (
        <button key={id} type="button" className={tab === id ? 'on' : ''} onClick={() => go(id)} aria-current={tab === id ? 'page' : undefined}>
          <Icon n={ic} />{label}
        </button>
      ))}
    </nav>
  )
}

export const Bar = ({ pct, color, h }) => (
  <div className="bar" style={h ? { height: h } : undefined} role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
    <i style={{ width: `${Math.max(0, Math.min(100, pct))}%`, background: color }} />
  </div>
)
