import { useEffect, useState } from 'react'
import { currentReminder, disableReminder, enableReminder, pushSupported } from './push.js'
import { Icon } from './ui.jsx'

const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent)
const installed = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone

/** Cartão do Perfil para ligar, mudar ou desligar o lembrete diário deste aparelho. */
export function Reminder({ suggested }) {
  const supported = pushSupported()
  const [on, setOn] = useState(null) // horário salvo, '' = desligado, null = carregando
  const [time, setTime] = useState(suggested || '20:00')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!supported) return
    currentReminder().then((t) => { setOn(t || ''); if (t) setTime(t) }).catch(() => setOn(''))
  }, [supported])

  async function save() {
    setBusy(true); setMsg('')
    try {
      await enableReminder(time)
      setOn(time)
      setMsg(`Pronto! Se você ainda não tiver estudado, eu te lembro às ${time}.`)
    } catch (e) {
      setMsg(e.message === 'denied'
        ? 'As notificações estão bloqueadas. Libere nas configurações do navegador para este site e tente de novo.'
        : 'Não consegui salvar agora. Verifique a internet e tente de novo.')
    } finally { setBusy(false) }
  }

  async function off() {
    setBusy(true); setMsg('')
    try { await disableReminder(); setOn(''); setMsg('Lembrete desligado neste aparelho.') }
    catch { setMsg('Não consegui desligar agora. Tente de novo.') }
    finally { setBusy(false) }
  }

  if (!supported) {
    return (
      <div className="card reminder">
        <b className="h"><Icon n="lamparina" /> Lembrete diário</b>
        <p className="muted small">
          {isIOS() && !installed()
            ? 'No iPhone, adicione o Lezoro\'a à Tela de Início (compartilhar > Adicionar à Tela de Início) e abra por lá para receber lembretes.'
            : 'Este navegador não recebe lembretes. Tente pelo Chrome no Android ou pelo app instalado no iPhone.'}
        </p>
      </div>
    )
  }

  return (
    <div className="card reminder">
      <div className="row between">
        <b className="h"><Icon n="lamparina" /> Lembrete diário</b>
        <span className={`chip-state ${on ? 'on' : ''}`}>{on === null ? '…' : on ? `Ligado · ${on}` : 'Desligado'}</span>
      </div>
      <label className="row between fl" htmlFor="remind-time">
        Horário
        <input id="remind-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className="time" />
      </label>
      <div className="row">
        <button className="btn small" type="button" onClick={save} disabled={busy || on === null || on === time}>
          {on ? 'Salvar horário' : 'Ligar lembrete'}
        </button>
        {on && <button className="btn small sec" type="button" onClick={off} disabled={busy}>Desligar</button>}
      </div>
      {msg && <p className="info" role="status">{msg}</p>}
    </div>
  )
}
