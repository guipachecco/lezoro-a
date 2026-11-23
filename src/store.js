import { dayKey, refresh } from './game.js'
import { sb } from './supabase.js'

const KEY = 'lezoroa:v1'

// Cópia local do progresso: abre rápido e funciona sem internet.
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
    else localStorage.removeItem(KEY)
  } catch {
    // modo privado ou armazenamento cheio: o app continua funcionando nesta sessão
  }
}

/** Progresso salvo na nuvem. null = usuário ainda não tem progresso. Lança erro se a rede falhar. */
export async function loadRemote(userId) {
  const { data, error } = await sb.from('progress').select('data').eq('user_id', userId).maybeSingle()
  if (error) throw error
  return data ? refresh(data.data, dayKey()) : null
}

// shortcut: o último aparelho a salvar vence; se dois aparelhos jogarem ao mesmo tempo, um sobrescreve o outro.
export async function saveRemote(userId, s) {
  const { error } = await sb.from('progress').upsert({ user_id: userId, data: s, updated_at: new Date().toISOString() })
  if (error) console.warn('Não foi possível salvar o progresso na nuvem:', error.message)
}
