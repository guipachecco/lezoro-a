import { dayKey, refresh } from './game.js'

const KEY = 'lezoroa:v1'

// shortcut: o progresso fica só neste navegador (localStorage) e não há senha.
// Trocar por Supabase (auth + banco) quando o login de verdade entrar.
export function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY))
    return s ? refresh(s, dayKey()) : null
  } catch {
    return null
  }
}

export function save(s) {
  try {
    if (s) localStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    // modo privado ou armazenamento cheio: o app continua funcionando nesta sessão
  }
}
