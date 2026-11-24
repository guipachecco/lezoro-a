import { useMemo, useState } from 'react'
import { RARITY } from './game.js'
import { Art, Grao, Icon, fmt } from './ui.jsx'

const N = '#10288C', GOLD = '#F2C94C', WOOD = '#9A6233', DARK = '#6E4520'
const HITS = 4 // toques para quebrar
// Rachaduras que aparecem a cada toque (a luz da raridade vaza por elas).
const CRACKS = [
  'M100 44L93 60L104 72L96 88',
  'M38 100L54 118L46 134L60 152',
  'M162 104L148 120L158 136L144 160',
  'M30 84L50 72L60 84M120 120L108 140L118 160',
]

/** Desenho do baú. cracks = quantas rachaduras mostrar; color = cor da luz que vaza. */
export function chestSvg(cracks = 0, color = GOLD) {
  const lines = CRACKS.slice(0, cracks).map((d) => `<path d="${d}" fill="none" stroke="${N}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`).join('')
  return `<svg viewBox="0 0 200 190" aria-hidden="true">
<ellipse cx="100" cy="176" rx="76" ry="9" fill="${N}" opacity=".15"/>
<g class="box"><rect x="28" y="90" width="144" height="80" rx="8" fill="${WOOD}" stroke="${N}" stroke-width="6"/>
<path d="M32 118H168M32 144H168" stroke="${DARK}" stroke-width="3"/>
<rect x="52" y="90" width="16" height="80" fill="${GOLD}" stroke="${N}" stroke-width="3.5"/><rect x="132" y="90" width="16" height="80" fill="${GOLD}" stroke="${N}" stroke-width="3.5"/></g>
<g class="lid"><path d="M26 94Q26 40 100 40Q174 40 174 94Z" fill="${WOOD}" stroke="${N}" stroke-width="6" stroke-linejoin="round"/>
<path d="M40 70Q100 52 160 70" fill="none" stroke="${DARK}" stroke-width="3"/>
<path d="M52 52Q58 48 68 45V94H52Z" fill="${GOLD}" stroke="${N}" stroke-width="3.5"/><path d="M148 52Q142 48 132 45V94H148Z" fill="${GOLD}" stroke="${N}" stroke-width="3.5"/>
<rect x="85" y="78" width="30" height="34" rx="7" fill="${GOLD}" stroke="${N}" stroke-width="4"/><circle cx="100" cy="92" r="4.5" fill="${N}"/><rect x="98" y="94" width="4" height="9" rx="2" fill="${N}"/></g>
<g class="cracks">${lines}</g></svg>`
}

const CONFETTI = ['#B6DB00', '#6338EE', '#274DEA', '#E0367A', '#F2C94C', '#EAF6AD']

/**
 * Tela de abertura: o prêmio já foi sorteado (e salvo) antes de entrar aqui;
 * a animação só revela. Cada toque racha o baú; no último a tampa voa e o prêmio aparece.
 */
export function ChestOpen({ item, left, lvl, worn, onEquip, onAgain, onExit }) {
  const [hits, setHits] = useState(0)
  const [shake, setShake] = useState(0)
  const [rname, color] = RARITY[item.r]
  const open = hits >= HITS
  const confetti = useMemo(() => Array.from({ length: 28 }, (_, k) => ({
    left: Math.random() * 100, delay: Math.random() * 0.6, dur: 1.4 + Math.random() * 1.2, c: CONFETTI[k % CONFETTI.length], r: Math.random() * 360,
  })), [])

  function hit() {
    if (open) return
    setHits((h) => h + 1)
    setShake((x) => x + 1)
    navigator.vibrate?.(hits === HITS - 1 ? [40, 30, 80] : 25)
  }

  return (
    <div className="screen chest-screen" style={{ '--rc': color }}>
      {open && <div className="confetti" aria-hidden="true">{confetti.map((p, k) => <i key={k} style={{ left: `${p.left}%`, background: p.c, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s`, transform: `rotate(${p.r}deg)` }} />)}</div>}
      <div className="chest-stage">
        {/* luz da raridade: cresce a cada rachadura e vira raios girando ao abrir */}
        <div className={`chest-glow ${open ? 'rays' : ''}`} style={{ opacity: open ? 1 : hits * 0.22 }} aria-hidden="true" />
        {!open
          ? (
            <button type="button" className="chest-btn" onClick={hit} aria-label={`Baú fechado. Toque para quebrar, faltam ${HITS - hits} toques`}>
              <Art key={shake} html={chestSvg(hits, color)} className={`chest-art ${shake ? 'shake' : 'bob'}`} />
            </button>
          )
          : (
            <div className="chest-open">
              <Art html={chestSvg(HITS, color)} className="chest-art opened" />
              <div className="prize" role="status">
                <Prize item={item} lvl={lvl} />
              </div>
            </div>
          )}
      </div>
      {!open
        ? (
          <div className="center-col stack">
            <h2>Toque para quebrar!</h2>
            <div className="hits" aria-hidden="true">{Array.from({ length: HITS }, (_, k) => <span key={k} className={k < hits ? 'on' : ''} />)}</div>
          </div>
        )
        : (
          <div className="center-col stack prize-text">
            <span className="rarity-pill">{rname}</span>
            <h2>{item.name}</h2>
            {item.use?.seeds && <p className="muted">+{fmt(item.use.seeds)} sementes direto na sua árvore!</p>}
            {item.use?.lamps && <p className="muted">Todas as lamparinas foram reacesas!</p>}
            {item.id === 'restart' && <p className="muted">Guardado no Perfil. Use quando quiser refazer sua trilha.</p>}
            {item.slot && <p className="muted">{item.ref ? `${item.ref} · ` : ''}{lvl >= item.lvl ? 'Já está no seu inventário.' : `Veste a partir do nível ${item.lvl}.`}</p>}
            {item.slot && lvl >= item.lvl && (worn
              ? <span className="chip">Vestido!</span>
              : <button className="btn" type="button" onClick={() => onEquip(item.id)}>Vestir agora</button>)}
            {left > 0 && <button className="btn" type="button" onClick={onAgain}>Abrir outro baú ({left})</button>}
            <button className="btn ghost-dark" type="button" onClick={onExit}>Voltar</button>
          </div>
        )}
    </div>
  )
}

function Prize({ item, lvl }) {
  if (item.slot) return <Grao st="celebra" lvl={Math.max(lvl, item.lvl)} gear={{ [item.slot]: item.id }} style={{ width: 150 }} />
  const ic = item.use?.seeds ? 'semente' : item.use?.lamps ? 'lamparina' : 'trilha'
  return <span className="prize-icon"><Icon n={ic} f={ic !== 'trilha'} /></span>
}
