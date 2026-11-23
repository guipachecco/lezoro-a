// Amigos, trocas, ranking e convites (Supabase). Tabelas e funções em supabase/social.sql.
import { sb } from './supabase.js'

const must = ({ data, error }) => { if (error) throw error; return data }

/** Cria o perfil público na primeira vez (com código de amigo) e devolve { id, name, code, xp }. */
export const ensureProfile = async (name) => must(await sb.rpc('ensure_profile', { p_name: name }))
export const addFriend = async (code) => must(await sb.rpc('add_friend', { p_code: code }))
export const awardXp = async (room, amount) => must(await sb.rpc('award_xp', { p_room: room, p_amount: amount }))
export const topPlayers = async () => must(await sb.from('profiles').select('id,name,xp').order('xp', { ascending: false }).limit(20))

const pair = (me, id) => (me < id ? [me, id] : [id, me])

export async function listFriends(me) {
  const fs = must(await sb.from('friendships').select('a,b'))
  const ids = fs.map((f) => (f.a === me ? f.b : f.a))
  if (!ids.length) return []
  const ps = must(await sb.from('profiles').select('id,name,xp').in('id', ids))
  return ps.sort((x, y) => x.name.localeCompare(y.name))
}

export async function removeFriend(me, id) {
  const [a, b] = pair(me, id)
  must(await sb.from('friendships').delete().eq('a', a).eq('b', b))
}

export const listTrades = async () => must(await sb.from('trades').select('*').order('created_at', { ascending: false }).limit(50))
export const proposeTrade = async (to, give, want) => must(await sb.from('trades').insert({ to_id: to, give, want: want || null }).select().single())

/** accept | decline (quem recebe), cancel | claim (quem propôs). Devolve a troca ou null se já não valia. */
export async function tradeStep(id, action) {
  const r = must(await sb.rpc('trade_step', { p_id: id, p_action: action }))
  return r?.id ? r : null
}

/** Item que volta para quem propôs depois que a troca terminou: o pedido (aceita) ou o próprio (recusada/cancelada). */
export const claimedItem = (t) => (t.status === 'accepted' ? t.want : t.give)

// Convite para sala ao vivo: cada pessoa logada escuta o próprio canal "caixa:<id>".
export const inbox = (id) => sb.channel(`caixa:${id}`)
export async function sendInvite(friendId, payload) {
  const ch = inbox(friendId)
  try { await ch.httpSend('convite', payload) } finally { sb.removeChannel(ch) }
}
