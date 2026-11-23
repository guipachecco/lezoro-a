import { useEffect, useState } from 'react'
import { Grao, Icon } from './ui.jsx'

const ua = navigator.userAgent
export const platform = () =>
  /iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) ? 'ios'
    : /android/i.test(ua) ? 'android' : 'desktop'
export const isInstalled = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true

// O Chrome avisa uma vez quando o app pode ser instalado; guardamos o evento para o botão "Instalar agora".
let prompt = null
const subs = new Set()
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); prompt = e; subs.forEach((f) => f()) })
window.addEventListener('appinstalled', () => { prompt = null; subs.forEach((f) => f()) })
function useInstallPrompt() {
  const [, tick] = useState(0)
  useEffect(() => { const f = () => tick((n) => n + 1); subs.add(f); return () => subs.delete(f) }, [])
  return prompt
}

const DISMISS = 'lezoroa:install-dismissed'
const dismissed = () => { try { return localStorage.getItem(DISMISS) === '1' } catch { return false } }

const STEPS = {
  ios: [
    ['compartilhar', 'Toque em Compartilhar', 'É o quadrado com a seta para cima, na barra de baixo do Safari (no iPad, fica no topo).'],
    ['adicionar', 'Escolha "Adicionar à Tela de Início"', 'Role a lista para baixo se não aparecer de cara.'],
    ['check', 'Toque em "Adicionar"', 'O Grão aparece na sua tela, ao lado dos outros apps.'],
  ],
  android: [
    ['menu', 'Toque no menu ⋮', 'Fica no canto de cima, à direita, no Chrome.'],
    ['adicionar', 'Escolha "Instalar app"', 'Em alguns celulares aparece como "Adicionar à tela inicial".'],
    ['check', 'Confirme em "Instalar"', 'O Lezoro\'a aparece na sua tela, ao lado dos outros apps.'],
  ],
}

export function InstallGuide({ onClose }) {
  const p = platform()
  const deferred = useInstallPrompt()
  const otherIOSBrowser = p === 'ios' && /CriOS|FxiOS|EdgiOS/i.test(ua)

  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [onClose])

  async function installNow() {
    deferred.prompt()
    const { outcome } = await deferred.userChoice
    if (outcome === 'accepted') onClose()
  }

  return (
    <div className="sheet-bg" onClick={onClose}>
      <div className="sheet" role="dialog" aria-modal="true" aria-labelledby="install-title" onClick={(e) => e.stopPropagation()}>
        <button className="sheet-x" type="button" onClick={onClose} aria-label="Fechar"><Icon n="x" /></button>
        <div className="row">
          <Grao st="celebra" style={{ width: 70, flex: 'none' }} />
          <div>
            <h2 id="install-title">Leve o Lezoro'a no bolso</h2>
            <p className="muted small">{p === 'ios' ? 'Guia para iPhone e iPad' : p === 'android' ? 'Guia para Android' : 'Instale no celular'}</p>
          </div>
        </div>
        <ul className="perks">
          <li><Icon n="celular" />Abre em tela cheia, como um app</li>
          <li><Icon n="lamparina" />Recebe o lembrete diário do Grão</li>
          <li><Icon n="trilha" />Fica a um toque de distância</li>
        </ul>

        {p === 'desktop' ? (
          <>
            <p className="small">Abra <b>lezoro-a.vercel.app</b> no navegador do celular e toque em <b>Instalar</b> quando este guia aparecer por lá.</p>
            {deferred && <button className="btn" type="button" onClick={installNow}>Instalar neste computador</button>}
          </>
        ) : (
          <>
            {p === 'android' && deferred && (
              <>
                <button className="btn" type="button" onClick={installNow}>Instalar agora</button>
                <p className="muted small center">Ou faça pelo menu do Chrome:</p>
              </>
            )}
            {otherIOSBrowser && <p className="info">Se não encontrar a opção, abra este site no <b>Safari</b> e siga os passos.</p>}
            <ol className="steps">
              {STEPS[p].map(([ic, title, sub], i) => (
                <li key={title}>
                  <span className="step-n">{i + 1}</span>
                  <span className="step-ic"><Icon n={ic} f={ic === 'menu'} /></span>
                  <span><b>{title}</b><small>{sub}</small></span>
                </li>
              ))}
            </ol>
            {p === 'ios' && <p className="muted small center">Depois, abra o Lezoro'a pelo ícone para ligar os lembretes.</p>}
          </>
        )}
      </div>
    </div>
  )
}

/** Botão que abre o guia. */
export function InstallButton({ label = 'Ver como instalar', className = 'btn small sec' }) {
  const [open, setOpen] = useState(false)
  if (isInstalled()) return null
  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>{label}</button>
      {open && <InstallGuide onClose={() => setOpen(false)} />}
    </>
  )
}

/** Aviso na tela inicial enquanto o app não estiver instalado. Some quando o usuário fecha. */
export function InstallBanner() {
  const [hidden, setHidden] = useState(() => isInstalled() || dismissed())
  const [open, setOpen] = useState(false)
  if (hidden) return null
  function close() {
    try { localStorage.setItem(DISMISS, '1') } catch { /* sem armazenamento: some só nesta sessão */ }
    setHidden(true)
  }
  return (
    <div className="install">
      <Icon n="celular" />
      <span><b>Instale o Lezoro'a</b><small>{platform() === 'ios' ? 'Adicione à Tela de Início em 3 toques.' : 'Tenha o app na sua tela e receba lembretes.'}</small></span>
      <button type="button" className="btn small" onClick={() => setOpen(true)}>Como?</button>
      <button type="button" className="install-x" onClick={close} aria-label="Não mostrar de novo"><Icon n="x" /></button>
      {open && <InstallGuide onClose={() => setOpen(false)} />}
    </div>
  )
}
